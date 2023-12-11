import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import { ProjectManager } from '../../../project';
import { FilesTreeItem } from './FilesTreeItem';
import { GestolaExplorer } from '../GestolaExplorer';
import * as fse from 'fs-extra';
import { type } from 'os';
import G = require('glob');


//#region Utilities

namespace _ {

	function handleResult<T>(resolve: (result: T) => void, reject: (error: Error) => void, error: Error | null | undefined, result: T): void {
		if (error) {
			reject(massageError(error));
		} else {
			resolve(result);
		}
	}

	function massageError(error: Error & { code?: string }): Error {
		if (error.code === 'ENOENT') {
			return vscode.FileSystemError.FileNotFound();
		}

		if (error.code === 'EISDIR') {
			return vscode.FileSystemError.FileIsADirectory();
		}

		if (error.code === 'EEXIST') {
			return vscode.FileSystemError.FileExists();
		}

		if (error.code === 'EPERM' || error.code === 'EACCES') {
			return vscode.FileSystemError.NoPermissions();
		}

		return error;
	}

	export function checkCancellation(token: vscode.CancellationToken): void {
		if (token.isCancellationRequested) {
			throw new Error('Operation cancelled');
		}
	}

	export function normalizeNFC(items: string): string;
	export function normalizeNFC(items: string[]): string[];
	export function normalizeNFC(items: string | string[]): string | string[] {
		if (process.platform !== 'darwin') {
			return items;
		}

		if (Array.isArray(items)) {
			return items.map(item => item.normalize('NFC'));
		}

		return items.normalize('NFC');
	}

	export function readdir(path: string): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			fs.readdir(path, (error, children) => handleResult(resolve, reject, error, normalizeNFC(children)));
		});
	}

	export function stat(path: string): Promise<fs.Stats> {
		return new Promise<fs.Stats>((resolve, reject) => {
			fs.stat(path, (error, stat) => handleResult(resolve, reject, error, stat));
		});
	}

	export function readfile(path: string): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			fs.readFile(path, (error, buffer) => handleResult(resolve, reject, error, buffer));
		});
	}

	export function writefile(path: string, content: Buffer): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(path, content, error => handleResult(resolve, reject, error, void 0));
		});
	}

	export function exists(path: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			fs.exists(path, exists => handleResult(resolve, reject, null, exists));
		});
	}

	export function rmrf(path: string): Promise<void> {
		return new Promise<void>(() => {
			rimraf.rimraf(path);
            //error => handleResult(resolve, reject, error, void 0)
		});
	}

	export function mkdir(path: string): Promise<void> {
		return new Promise<void>(() => {
			mkdirp.mkdirp(path);
		});
	}

	export function rename(oldPath: string, newPath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.rename(oldPath, newPath, error => handleResult(resolve, reject, error, void 0));
		});
	}

	export function unlink(path: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.unlink(path, error => handleResult(resolve, reject, error, void 0));
		});
	}
}

export class FileStat implements vscode.FileStat {

	constructor(private fsStat: fs.Stats) { }

	get type(): vscode.FileType {
		return this.fsStat.isFile() ? vscode.FileType.File : this.fsStat.isDirectory() ? vscode.FileType.Directory : this.fsStat.isSymbolicLink() ? vscode.FileType.SymbolicLink : vscode.FileType.Unknown;
	}

	get isFile(): boolean | undefined {
		return this.fsStat.isFile();
	}

	get isDirectory(): boolean | undefined {
		return this.fsStat.isDirectory();
	}

	get isSymbolicLink(): boolean | undefined {
		return this.fsStat.isSymbolicLink();
	}

	get size(): number {
		return this.fsStat.size;
	}

	get ctime(): number {
		return this.fsStat.ctime.getTime();
	}

	get mtime(): number {
		return this.fsStat.mtime.getTime();
	}
}

export interface Entry {
	uri: vscode.Uri;
	type: vscode.FileType;
}

type Node = { 	uri: vscode.Uri;
				type: vscode.FileType; };

//#endregion

export class FileSystemProvider implements vscode.TreeDataProvider<Entry>,  vscode.TreeDragAndDropController<Entry>, vscode.FileSystemProvider {

	private _onDidChangeFile: vscode.EventEmitter<vscode.FileChangeEvent[]>;
	private view: string;
	private root: vscode.Uri | undefined;

    private projManager: ProjectManager;
	private treeView: vscode.TreeView<Entry>;
	private watcher: vscode.FileSystemWatcher | undefined;

	constructor(context: vscode.ExtensionContext, explorer: GestolaExplorer, projManager: ProjectManager, view: string) {

		this._onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();

		this.projManager = projManager;
		this.projManager.onDidChangeProject(() => this.refresh());
		this.onDidChangeFile(() => this.refresh);

		this.view = view;
		this.watcher = undefined;

		this.treeView = vscode.window.createTreeView(
            view, 
            {
                treeDataProvider: this,
                dragAndDropController: this,
				canSelectMany: true
            }
        );
		this.treeView.onDidChangeSelection(() => {

            explorer.currTree = this.treeView;

            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextSingle', this.treeView.selection.length === 1);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextDouble', this.treeView.selection.length === 2);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextMultiple', this.treeView.selection.length > 2);

        });
		context.subscriptions.push(this.treeView);


	}

	get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
		return this._onDidChangeFile.event;
	}

	watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
		const watcher = fs.watch(uri.fsPath, { recursive: options.recursive }, async (event, filename) => {
			if (filename) {
				const filepath = path.join(uri.fsPath, _.normalizeNFC(filename.toString()));

				// TODO support excludes (using minimatch library?)

				this._onDidChangeFile.fire([{
					type: event === 'change' ? vscode.FileChangeType.Changed : await _.exists(filepath) ? vscode.FileChangeType.Created : vscode.FileChangeType.Deleted,
					uri: uri.with({ path: filepath })
				} as vscode.FileChangeEvent]);
			}
		});

		return { dispose: () => watcher.close() };
	}

	stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
		return this._stat(uri.fsPath);
	}

	async _stat(path: string): Promise<vscode.FileStat> {
		return new FileStat(await _.stat(path));
	}

	readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		return this._readDirectory(uri);
	}

	async _readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		const children = await _.readdir(uri.fsPath);

		const result: [string, vscode.FileType][] = [];
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const stat = await this._stat(path.join(uri.fsPath, child));
			result.push([child, stat.type]);
		}

		return Promise.resolve(result);
	}

	createDirectory(uri: vscode.Uri): void | Thenable<void> {
		return _.mkdir(uri.fsPath);
	}

	readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
		return _.readfile(uri.fsPath);
	}

	writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void | Thenable<void> {
		return this._writeFile(uri, content, options);
	}

	async _writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
		const exists = await _.exists(uri.fsPath);
		if (!exists) {
			if (!options.create) {
				throw vscode.FileSystemError.FileNotFound();
			}

			await _.mkdir(path.dirname(uri.fsPath));
		} else {
			if (!options.overwrite) {
				throw vscode.FileSystemError.FileExists();
			}
		}

		return _.writefile(uri.fsPath, content as Buffer);
	}

	delete(uri: vscode.Uri, options: { recursive: boolean; }): void | Thenable<void> {
		if (options.recursive) {
			return _.rmrf(uri.fsPath);
		}

		return _.unlink(uri.fsPath);
	}

	rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
		return this._rename(oldUri, newUri, options);
	}

	async _rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): Promise<void> {
		const exists = await _.exists(newUri.fsPath);
		if (exists) {
			if (!options.overwrite) {
				throw vscode.FileSystemError.FileExists();
			} else {
				await _.rmrf(newUri.fsPath);
			}
		}

		const parentExists = await _.exists(path.dirname(newUri.fsPath));
		if (!parentExists) {
			await _.mkdir(path.dirname(newUri.fsPath));
		}

		return _.rename(oldUri.fsPath, newUri.fsPath);
	}

	// tree data provider

	async getChildren(element?: Entry): Promise<Entry[]> {

		if (element) {
			const children = await this.readDirectory(element.uri);
			return children.map(([name, type]) => ({ uri: vscode.Uri.file(path.join(element.uri.fsPath, name)), type }));
		}

		if(this.projManager.currProj){

			if(this.watcher){
				this.watcher.dispose();
			}

			let rt: vscode.Uri;
			switch (this.view) {
				case "gestola-explorer-systemLvl": rt = this.projManager.currProj.systemFolderUri; break;
				case "gestola-explorer-rtlLvl": rt = this.projManager.currProj.rtlFolderUri; break;
				case "gestola-explorer-topologyLvl": rt = this.projManager.currProj.topologyFolderUri; break;
				case "gestola-explorer-otherFiles": rt = this.projManager.currProj.otherFolderUri; break;
				default: rt = this.projManager.currProj.systemFolderUri; break;
			}
			this.root = rt;

			this.watcher = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(this.root, "**/*")
			);

			this.watcher.onDidChange(() => this.refresh());
			this.watcher.onDidCreate(() => this.refresh());
			this.watcher.onDidDelete(() => this.refresh());

			const children = await this.readDirectory(rt);
			children.sort((a, b) => {
				if (a[1] === b[1]) {
					return a[0].localeCompare(b[0]);
				}
				return a[1] === vscode.FileType.Directory ? -1 : 1;
			});

			return children.map(([name, type]) => ({ uri: vscode.Uri.file(path.join(rt.fsPath, name)), type }));

		}

		return [];
	}

	async getTreeItem(element: Entry): Promise<FilesTreeItem> {
		return Promise.resolve(new FilesTreeItem(element));
	}

	private _onDidChangeTreeData: vscode.EventEmitter<Entry | undefined | null | void> = new vscode.EventEmitter<Entry | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<Entry | undefined | null | void> = this._onDidChangeTreeData.event;
  
	refresh(): void {
	  	this._onDidChangeTreeData.fire();
	}

	dropMimeTypes = ['text/uri-list', 'explorer/treeitem'];
	dragMimeTypes = ['explorer/treeitem'];

	public async handleDrop(target: Entry, source: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {

		if (source.get('explorer/treeitem')) {

			const entries: string[] = (source.get('explorer/treeitem')?.value as string).replace("[", "").replace("]", "").replace(/"/g, "").split(",");

			entries.forEach((l) => {

				let el = vscode.Uri.file(l);

				if(target){	
					target.type === vscode.FileType.Directory
					? fse.move(el.fsPath, path.join(target.uri.fsPath, path.basename(el.fsPath)))
					: fse.move(el.fsPath, path.join(path.dirname(target.uri.fsPath), path.basename(el.fsPath)));
				} else {
					if(this.root){
						fse.move(el.fsPath, path.join(this.root.fsPath, path.basename(el.fsPath)));
					}
				}

			});
			
		} else {

			let list: string = source.get('text/uri-list')?.value;
			let entries: string[] = list.split("\r\n");
	
			entries.forEach((l) => {
	
				let el = vscode.Uri.parse(l);

				if(target){
					target.type === vscode.FileType.Directory
					? fse.copy(el.fsPath, path.join(target.uri.fsPath, path.basename(el.fsPath)))
					: fse.copy(el.fsPath, path.join(path.dirname(target.uri.fsPath), path.basename(el.fsPath)));
				} else {
					if(this.root) {
						fse.copy(el.fsPath, path.join(this.root.fsPath, path.basename(el.fsPath)));
					}
				}

			});

		}

	}

	public async handleDrag(source: Entry[], treeDataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		treeDataTransfer.set('explorer/treeitem', new vscode.DataTransferItem(source.map(i => i.uri.fsPath)));
	}

}
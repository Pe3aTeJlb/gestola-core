import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';
import * as path from 'path';
import { FSProvider } from "../../utils";

export class PasteFileAction implements Action {

    canRevert: boolean;
    paths: string[];

    constructor(readonly target: Entry){
        this.canRevert = true;
        this.paths = [];
    }

    public async execute(context: ActionContext): Promise<void> {
        
        if(context.cancelled){ return; }
        const data = await vscode.env.clipboard.readText();
        if (!data) { return; }

        this.paths = [];

        let filesToCopy: string[] = data.split("\r\n");
        for(let i = 0; i < filesToCopy.length-1; i++){

            if (!(await FSProvider.exists(filesToCopy[i]))) { return; }
            if (!(await FSProvider.exists(this.target.uri.path))) { return; }

            const target = await FSProvider.isDirectory(this.target.uri.path) ? this.target.uri.path : path.dirname(this.target.uri.path);
            const isDirectory = await FSProvider.isDirectory(filesToCopy[i]);
            if (isDirectory) {
                await this.copyDirectory(filesToCopy[i], target);
            } else {
                await this.copyFile(filesToCopy[i], target);
            }
        }
        
    }

    private async copyDirectory(sourcepath: string, targetpath: string): Promise<void> {
        let items = await this.getFilesToCopyFromDirectory(sourcepath, targetpath);
        let keys = Object.keys(items).sort((a, b) => a.length > b.length ? 1 : -1);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            this.paths.push(items[key]);
            let isDirectory = await FSProvider.isDirectory(key);
            if (isDirectory) {
                await FSProvider.mkdir(items[key]);
            } else {
                this.copyFile(key, path.dirname(items[key]));
            }
        }
    }

    private async copyFile(sourcepath: string, targetpath: string): Promise<void> {
        let filename = path.basename(sourcepath);
        let filepath = path.join(targetpath, filename);
        filepath = await FSProvider.createCopyName(filepath);
        filename = path.basename(filepath);
        this.paths.push(filepath);
        await FSProvider.writeFile(filepath, await FSProvider.readFile(sourcepath));
    }

    private async getFilesToCopyFromDirectory(sourcepath: string, targetpath: string): Promise<{ [id: string]: string; }> {
        let result: { [id: string]: string; } = {};
        targetpath = path.join(targetpath, path.basename(sourcepath));
        targetpath = await FSProvider.createCopyName(targetpath);

        result[sourcepath] = targetpath;

        let items = await FSProvider.readdir(sourcepath);
        for (let i = 0; i < items.length; i++) {
            let filename = path.join(sourcepath, items[i]);
            let isDirectory = await FSProvider.isDirectory(filename);
            if (isDirectory) {
                result = Object.assign(await this.getFilesToCopyFromDirectory(filename, targetpath), result);
            } else {
                result[filename] = path.join(targetpath, items[i]);
            }
        }

        return result;
    }

    public async revert(): Promise<void> {
        this.paths.forEach(async i => {if(await FSProvider.exists(i)) {vscode.workspace.fs.delete(vscode.Uri.parse(i));}});
    }

    toString(): string {
        return `Paste Files to ${this.target.uri.path}`;
    }

}
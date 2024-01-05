import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';

export class MoveFileAction implements Action {

    canRevert: boolean;
    map: Map<string, string>;

    constructor(readonly target: Entry, readonly entries: readonly Entry[]){
        this.canRevert = true;
        this.map = new Map();
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            this.entries.forEach((entry) => {
				if(this.target.type === vscode.FileType.Directory){
                    let newPath: string = path.join(this.target.uri.path, path.basename(entry.uri.path));
                    this.map.set(entry.uri.path, newPath);
					fse.move(entry.uri.path, newPath, {overwrite: true});
                } else {
                    let newPath: string = path.join(path.dirname(this.target.uri.path), path.basename(entry.uri.path));
                    this.map.set(entry.uri.path, newPath);
					fse.move(entry.uri.path, newPath, {overwrite: true});
                }
			});
        }
        return Promise.resolve();
    }

    public async revert(): Promise<void> {
        this.map.forEach(async (orig, dest) => {
            if((await vscode.workspace.fs.stat(vscode.Uri.parse(orig))).type === vscode.FileType.Directory){
                fse.move(orig, path.join(dest, path.basename(orig)), {overwrite: true});
            } else {
                fse.move(orig, path.join(path.dirname(dest), path.basename(orig)), {overwrite: true});
            }
        });
    }

    toString(): string {
        return `Move Files ${this.entries} to ${this.target.uri.path}`;
    }

}
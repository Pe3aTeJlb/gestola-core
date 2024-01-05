import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { FSProvider } from "../../utils";

export class AddExternalFileAction implements Action {

    canRevert: boolean;
    paths: string[];

    constructor(readonly target: Entry, readonly entries: readonly Entry[]){
        this.canRevert = true;
        this.paths = [];
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            this.entries.forEach((entry) => {
                if(this.target.type === vscode.FileType.Directory){
                    let dest = path.join(this.target.uri.path, path.basename(entry.uri.path));
                    fse.copy(entry.uri.path, dest);
                    this.paths.push(dest);
                } else {
                    let dest = path.join(path.dirname(this.target.uri.path), path.basename(entry.uri.path));
                    fse.copy(entry.uri.path, dest);
                    this.paths.push(dest);
                }
            });
        }
        return Promise.resolve();
    }

    public async revert(): Promise<void> {
        this.paths.forEach(async i => {if(await FSProvider.exists(i)) {vscode.workspace.fs.delete(vscode.Uri.parse(i));}});
    }

    toString(): string {
        return `Add External Files ${this.entries} to ${this.target.uri.path}`;
    }

}
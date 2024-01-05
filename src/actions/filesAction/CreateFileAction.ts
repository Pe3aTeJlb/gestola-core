import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';
import * as path from 'path';
import { FSProvider } from "../../utils";

export class CreateFileAction implements Action {

    canRevert: boolean;

    constructor(readonly target: Entry, readonly name: string){
        this.canRevert = true;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            if(await FSProvider.isDirectory(this.target.uri.path)){
                vscode.workspace.fs.writeFile(vscode.Uri.parse(path.join(this.target.uri.path, this.name)), new Uint8Array());
            } else {
                vscode.workspace.fs.writeFile(vscode.Uri.parse(path.join(path.dirname(this.target.uri.path), this.name)), new Uint8Array());
            }
        }
        return Promise.resolve();
    }

    public async revert(): Promise<void> {
        if(await FSProvider.isDirectory(this.target.uri.path)){
            vscode.workspace.fs.delete(vscode.Uri.parse(path.join(this.target.uri.path, this.name)));
        } else {
            vscode.workspace.fs.delete(vscode.Uri.parse(path.join(path.dirname(this.target.uri.path), this.name)));
        }
    }

    toString(): string {
        return `Create File ${this.name} at ${this.target.uri.path}`;
    }

}
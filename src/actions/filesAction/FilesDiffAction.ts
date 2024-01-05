import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class FilesDiffAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, readonly selectedItems: readonly Entry[]){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            vscode.commands.executeCommand('vscode.diff', this.selectedItems[0].uri, this.selectedItems[1].uri);
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Files Diff ${this.selectedItems[0].uri.path}, ${this.selectedItems[1].uri.path}`;
    }

}
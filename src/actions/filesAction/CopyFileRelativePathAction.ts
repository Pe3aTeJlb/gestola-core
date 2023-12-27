import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class CopyRelativeFilePathAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, selectedItems: readonly Entry[]){
        this.canRevert = false;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            vscode.commands.executeCommand('copyRelativeFilePath', this.item.uri);
        }
        return Promise.resolve();
    }

    toString(): string {
        return 'Copy Relative Path ' + this.item.uri.fsPath;
    }

}
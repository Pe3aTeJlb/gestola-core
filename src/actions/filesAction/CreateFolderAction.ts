import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class CreateFolderAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, selectedItems: readonly Entry[]){
        this.canRevert = false;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            vscode.commands.executeCommand('explorer.openToSide', this.item.uri);
        }
        return Promise.resolve();
    }

    toString(): string {
        return 'Create Fodler' + this.item.uri.fsPath;
    }

}
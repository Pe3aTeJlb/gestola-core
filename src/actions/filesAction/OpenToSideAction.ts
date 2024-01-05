import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class OpenToSideAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            vscode.commands.executeCommand('explorer.openToSide', this.item.uri);
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Open to the side ${this.item.uri.path}`;
    }

}
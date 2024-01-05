import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class OpenWithAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            vscode.commands.executeCommand('explorer.openWith', this.item.uri);
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Open with ${this.item.uri.path}`;
    }

}
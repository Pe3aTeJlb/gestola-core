import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class CopyFilePathAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, readonly selectedItems: readonly Entry[]){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            if(!this.selectedItems){
                vscode.commands.executeCommand('copyFilePath', this.item.uri);
            } else {
                let res = "";
                for(let i = 0; i < this.selectedItems.length; i++){
                    await vscode.commands.executeCommand('copyFilePath', this.selectedItems[i].uri);
                    res += await vscode.env.clipboard.readText() + "\r\n";
                }
                await vscode.env.clipboard.writeText(res);
            }
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Copy File Path ${this.item.uri.path}, ${this.selectedItems}`;
    }

}
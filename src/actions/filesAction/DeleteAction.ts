import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FSProvider } from "../../utils";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class DeleteAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, readonly selectedItems: readonly Entry[]){
        this.canRevert = true;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            if(!this.selectedItems){
                if(await FSProvider.isDirectory(this.item.uri.path)){
                    await vscode.workspace.fs.delete(this.item.uri, { useTrash: true, recursive: true });
                } else {
                    await vscode.workspace.fs.delete(this.item.uri, { useTrash: true });
                }
            } else {
                for(let i = 0; i < this.selectedItems.length; i++){
                    if(await FSProvider.isDirectory(this.selectedItems[i].uri.path)){
                        await vscode.workspace.fs.delete(this.selectedItems[i].uri, { useTrash: true, recursive: true });
                    } else {
                        await vscode.workspace.fs.delete(this.selectedItems[i].uri, { useTrash: true });
                    }
                }
            }
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Delete File ${this.item.uri.path}, ${this.selectedItems}`;
    }

}
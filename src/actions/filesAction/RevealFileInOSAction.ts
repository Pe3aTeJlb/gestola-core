import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import * as vscode from 'vscode';

export class RevealFileInOSAction implements Action {

    canRevert: boolean;

    constructor(readonly item: Entry, readonly selectedItems: readonly Entry[]){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            if(!this.selectedItems){
                vscode.commands.executeCommand('revealFileInOS', this.item.uri);
            } else {
                for(let i = 0; i < this.selectedItems.length; i++){
                    vscode.commands.executeCommand('revealFileInOS', this.selectedItems[i].uri);    
                }
            }
        }
        return Promise.resolve();
    }

    toString(): string {
        return `Reveal File in OS ${this.item.uri.path}`;
    }

}
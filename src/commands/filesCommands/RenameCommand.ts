import { Action } from "../../actions/Action";
import { RenameFileAction } from "../../actions/filesAction/RenameAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";
import * as vscode from "vscode";
import * as path from 'path';
import { FSProvider } from "../../utils";

export class RenameFileCommand extends FilesActionCommand {

    constructor(){
        super('Rename File Command');
    }

    public shouldRun(item: Entry | undefined): boolean {
        return !!item;
    }

    public async getActions(item: Entry): Promise<Action[]> {
        if(!item) { return[]; };

        const newname = await this.getText('New name', 'New name', path.basename(item.uri.path));
        if (!newname) { return []; }

        const parentFolderPath = path.dirname(item.uri.path);
        let newfilePath = path.join(parentFolderPath, newname);
        if (newfilePath === item.uri.path) {
            return [];
        }

        const caseChanged = item.uri.path.toLowerCase() === newfilePath.toLowerCase();
        if (await FSProvider.exists(newfilePath) && !caseChanged) {
            await vscode.window.showErrorMessage("File already exists");
            return [];
        }

        return [new RenameFileAction(item, newname)];

    }

    private async getText(description: string, placeholder?: string, initialValue?: string): Promise<string | undefined> {
        
        let currentValue: string = initialValue ? initialValue : "";

        const validate: (value: string) => boolean = value => value !== null && value !== undefined;
        const result = new Promise<string | undefined>(resolve => {
            let accepted = false;
            const input = vscode.window.createInputBox();
            input.prompt = description;
            input.value = currentValue;
            input.placeholder = input.value || placeholder;
    
            input.onDidTriggerButton(item => {
                if (item === vscode.QuickInputButtons.Back) {
                    validate(input.value);
                    resolve(input.value);
                } else {
                    if (validate(input.value)) {
                        accepted = true;
                        resolve(input.value);
                    } else {
                        resolve(undefined);
                    }
                }
    
                input.hide();
            });
    
            input.onDidAccept(() => {
                if (validate(input.value)) {
                    accepted = true;
                    resolve(input.value);
                } else {
                    resolve(undefined);
                }
    
                input.hide();
            }),
    
            input.onDidHide(() => {
                if (!accepted) {
                    resolve(undefined);
                }
            });
    
            input.show();
        });
    
        return await result;
    }
   
}
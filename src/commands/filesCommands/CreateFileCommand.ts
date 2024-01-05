import path = require("path");
import { Action } from "../../actions/Action";
import { CreateFileAction } from "../../actions/filesAction/CreateFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FSProvider } from "../../utils";
import { FilesActionCommand } from "./FilesActionCommands";
import * as vscode from "vscode";

export class CreateFileCommand extends FilesActionCommand {

    constructor(){
        super('Open to the Side Command');
    }

    public shouldRun(taget: Entry | undefined): boolean {
        return !!taget;
    }

    public async getActions(target: Entry): Promise<Action[]> {
        if(!target) { return[]; };

        const name = await this.getText('New file', 'New file', "");
        if (!name) { return []; }

        if(await FSProvider.exists(path.join(path.dirname(target.uri.path), name))){
            vscode.window.showErrorMessage("Conflict name. Entity already exist");
            return [];
        }

        return [new CreateFileAction(target, name)];
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
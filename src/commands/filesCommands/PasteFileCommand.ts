import { Action } from "../../actions/Action";
import { PasteFileAction } from "../../actions/filesAction/PasteFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class PasteFileCommand extends FilesActionCommand {

    constructor(){
        super('Paste File Command');
    }

    public shouldRun(target: Entry | undefined): boolean {
        return !!target;
    }

    public async getActions(target: Entry): Promise<Action[]> {
        return [new PasteFileAction(target)];
    }
   
}
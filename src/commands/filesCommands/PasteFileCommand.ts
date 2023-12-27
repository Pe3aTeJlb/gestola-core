import { Action } from "../../actions/Action";
import { PasteFileAction } from "../../actions/filesAction/PasteFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class PasteFileCommand extends FilesActionCommand {

    constructor(){
        super('Paste File Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new PasteFileAction(item, selectedItems)];
    }
   
}
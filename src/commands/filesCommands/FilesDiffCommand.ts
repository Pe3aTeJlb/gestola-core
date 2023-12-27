import { Action } from "../../actions/Action";
import { FilesDiffAction } from "../../actions/filesAction/FilesDiffAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class FilesDiffCommand extends FilesActionCommand {

    constructor(){
        super('Files Diff Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new FilesDiffAction(item, selectedItems)];
    }
   
}
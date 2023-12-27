import { Action } from "../../actions/Action";
import { RenameFileAction } from "../../actions/filesAction/RenameFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class RenameFileCommand extends FilesActionCommand {

    constructor(){
        super('Rename File Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new RenameFileAction(item, selectedItems)];
    }
   
}
import { Action } from "../../actions/Action";
import { DeleteFileAction } from "../../actions/filesAction/DeleteFIleAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class DeleteFileCommand extends FilesActionCommand {

    constructor(){
        super('Delete File Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new DeleteFileAction(item, selectedItems)];
    }
   
}
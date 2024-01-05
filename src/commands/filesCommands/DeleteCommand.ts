import { Action } from "../../actions/Action";
import { DeleteAction } from "../../actions/filesAction/DeleteAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class DeleteCommand extends FilesActionCommand {

    constructor(){
        super('Delete Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item || !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new DeleteAction(item, selectedItems)];
    }
   
}
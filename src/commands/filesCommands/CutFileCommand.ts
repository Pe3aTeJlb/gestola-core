import { Action } from "../../actions/Action";
import { OpenToSideAction } from "../../actions/filesAction/OpenToSideAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CutFileCommand extends FilesActionCommand {

    constructor(){
        super('Cut File Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new OpenToSideAction(item, selectedItems)];
    }
   
}
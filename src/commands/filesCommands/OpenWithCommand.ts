import { Action } from "../../actions/Action";
import { OpenWithAction } from "../../actions/filesAction/OpenWithAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class OpenWithCommand extends FilesActionCommand {

    constructor(){
        super('Open With Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new OpenWithAction(item, selectedItems)];
    }
   
}
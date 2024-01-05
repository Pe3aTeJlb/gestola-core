import { Action } from "../../actions/Action";
import { CopyFilePathAction } from "../../actions/filesAction/CopyFilePathAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CopyFilePathCommand extends FilesActionCommand {

    constructor(){
        super('Copy File Path Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item || !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new CopyFilePathAction(item, selectedItems)];
    }
   
}
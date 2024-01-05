import { Action } from "../../actions/Action";
import { CopyRelativeFilePathAction } from "../../actions/filesAction/CopyFileRelativePathAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CopyRelativeFilePathCommand extends FilesActionCommand {

    constructor(){
        super('Copy Relative Path Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item || !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new CopyRelativeFilePathAction(item, selectedItems)];
    }
   
}
import { Action } from "../../actions/Action";
import { CopyFIleAction } from "../../actions/filesAction/CopyFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CopyFileCommand extends FilesActionCommand {

    constructor(){
        super('Copy File Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new CopyFIleAction(item, selectedItems)];
    }
   
}
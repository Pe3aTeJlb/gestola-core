import { Action } from "../../actions/Action";
import { CreateFileAction } from "../../actions/filesAction/CreateFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CreateFolderCommand extends FilesActionCommand {

    constructor(){
        super('Create Fodler Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new CreateFileAction(item, selectedItems)];
    }
   
}
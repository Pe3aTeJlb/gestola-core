import { Action } from "../../actions/Action";
import { AddExternalFileAction } from "../../actions/filesAction/AddExternalFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class AddExternalFileCommand extends FilesActionCommand {

    constructor(){
        super('Add External File Command');
    }

    public shouldRun(target: Entry | undefined, externalItems: readonly Entry[] | undefined): boolean {
        return !!target && !!externalItems && externalItems.length > 0;
    }

    public async getActions(target: Entry, externalItems: readonly Entry[]): Promise<Action[]> {
        return [new AddExternalFileAction(target, externalItems)];
    }
   
}
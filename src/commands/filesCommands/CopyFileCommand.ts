import { Action } from "../../actions/Action";
import { CopyFileAction } from "../../actions/filesAction/CopyFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class CopyFileCommand extends FilesActionCommand {

    constructor(){
        super('Copy File Command');
    }

    public shouldRun(target: Entry | undefined, toCopy: readonly Entry[] | undefined): boolean {
        return !!target || !!toCopy && toCopy.length > 0;
    }

    public async getActions(target: Entry, toCopy: readonly Entry[]): Promise<Action[]> {
        return [new CopyFileAction(target, toCopy)];
    }
   
}
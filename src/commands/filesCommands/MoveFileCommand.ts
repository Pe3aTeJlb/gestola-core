import { Action } from "../../actions/Action";
import { MoveFileAction } from "../../actions/filesAction/MoveFileAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class MoveFileCommand extends FilesActionCommand {

    constructor(){
        super('Move File Command');
    }

    public shouldRun(target: Entry | undefined, toMove: readonly Entry[] | undefined): boolean {
        return !!target && !!toMove && toMove.length > 0;
    }

    public async getActions(target: Entry, toMove: readonly Entry[]): Promise<Action[]> {
        return [new MoveFileAction(target, toMove)];
    }
   
}
import { Action } from "../../actions/Action";
import { OpenToSideAction } from "../../actions/filesAction/OpenToSideAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class OpenToSideCommand extends FilesActionCommand {

    constructor(){
        super('Open to the Side Command');
    }

    public shouldRun(item: Entry | undefined): boolean {
        return !!item;
    }

    public async getActions(item: Entry): Promise<Action[]> {
        return [new OpenToSideAction(item)];
    }
   
}
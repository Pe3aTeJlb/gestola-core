import { Action } from "../../actions/Action";
import { OpenWithAction } from "../../actions/filesAction/OpenWithAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class OpenWithCommand extends FilesActionCommand {

    constructor(){
        super('Open With Command');
    }

    public shouldRun(item: Entry | undefined): boolean {
        return !!item;
    }

    public async getActions(item: Entry): Promise<Action[]> {
        return [new OpenWithAction(item)];
    }
   
}
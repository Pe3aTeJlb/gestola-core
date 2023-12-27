import { Action } from "../../actions/Action";
import { OpenInIntegratedTerminalAction } from "../../actions/filesAction/OpenInIntegratedTerminalAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class OpenInIntegratedTerminalCommand extends FilesActionCommand {

    constructor(){
        super('Open in Integrated Terminal Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new OpenInIntegratedTerminalAction(item, selectedItems)];
    }
   
}
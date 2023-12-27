import { Action } from "../../actions/Action";
import { RevealFileInOSAction } from "../../actions/filesAction/RevealFileInOSAction";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { FilesActionCommand } from "./FilesActionCommands";

export class RevealFileInOSCommand extends FilesActionCommand {

    constructor(){
        super('Reveal File in OS Command');
    }

    public shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean {
        return !!item && !!selectedItems && selectedItems.length > 0;
    }

    public async getActions(item: Entry, selectedItems: readonly Entry[]): Promise<Action[]> {
        return [new RevealFileInOSAction(item, selectedItems)];
    }
   
}
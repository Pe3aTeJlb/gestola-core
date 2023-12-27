import { Action } from "../../actions/Action";
import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { BaseCommand } from "../BaseCommand";

export abstract class FilesActionCommand extends BaseCommand {

    constructor(title: string) {
        super(title);
    }

    public override async getActionBase(clickedItem: Entry | undefined, selectedItems: readonly Entry[] | undefined): Promise<Action[]> {
        return this.shouldRun(clickedItem, selectedItems) ? this.getActions(clickedItem, selectedItems) : [];
    }

    public abstract override shouldRun(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): boolean;

    public abstract override getActions(item: Entry | undefined, selectedItems: readonly Entry[] | undefined): Promise<Action[]>;

}

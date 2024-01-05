import { Entry } from "../../ui/explorer/filesExplorer/FilesProvider";
import { Action, ActionContext } from "../Action";
import { FSProvider } from "../../utils";
import path = require("path");

export class RenameFileAction implements Action {

    canRevert: boolean;
    newfilePath: string;

    constructor(readonly item: Entry, readonly newName: string){
        this.canRevert = true;
        this.newfilePath = "";
    }

    public async execute(context: ActionContext): Promise<void> {
        if (context.cancelled) {
            return;
        }

        this.newfilePath = path.join(path.dirname(this.item.uri.path), this.newName);
        FSProvider.rename(this.item.uri.path, this.newfilePath);
    }

    public async revert(): Promise<void> {
        FSProvider.rename(this.newfilePath, this.item.uri.path);
    }

    toString(): string {
        return `Rename File ${this.item.uri.path} to ${this.newName}`;
    }

}
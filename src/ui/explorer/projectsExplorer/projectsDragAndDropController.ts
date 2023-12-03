import * as vscode from "vscode";
import { Project } from "../../../project";

const SOLUTION_EXPLORER_MIME_TYPE = 'application/vnd.code.tree.solutionExplorer';
// const URI_LIST_MIME_TYPE = 'text/uri-list';

export class ProjectsDragAndDropController implements vscode.TreeDragAndDropController<Project> {

    constructor(){

    }

    private _onDidChangeTreeData: vscode.EventEmitter<(Project | undefined)[] | undefined> = new vscode.EventEmitter<Project[] | undefined>();
	public onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    public get dropMimeTypes(): string[] {
		return [ SOLUTION_EXPLORER_MIME_TYPE ];
	}

	public get dragMimeTypes(): string[] {
		return [ ];
	}

    public async handleDrop(target: Project | undefined, sources: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
        if (!target) { return; }

        const treeItems = this.getTreeItems(sources);
        if (token.isCancellationRequested) {
            return;
        }

        const actions = await this.getDropActions(target, treeItems);
        if (token.isCancellationRequested) {
            return;
        }

        await this.actionsRunner.run(actions, token);
    }

    private getTreeItems(sources: vscode.DataTransfer): Project[] {
        const transferItem = sources.get(SOLUTION_EXPLORER_MIME_TYPE);
        if (!transferItem) {
            return [];
        }

        const treeItems: Project[] = [];
        for (const id of transferItem.value) {
            const treeItem = this.solutionTreeItemCollection.getLoadedChildTreeItemById(id);
            if (treeItem) {
                treeItems.push(treeItem);
            }
        }

        return treeItems;
    }

    private async getDropActions(target: Project, treeItems: Project[]): Promise<vscode.Action[]> {
        const actions: Action[] = [];
        for(const treeItem of treeItems) {
            if (!treeItem) {
                continue;
            }

            for (const dropHandler of this.dropHandlers) {
                if (await dropHandler.canHandle(treeItem, target)) {
                    const actionsForTreeItem = await dropHandler.handle(treeItem, target);
                    actions.push(...actionsForTreeItem);
                }
            }
        }

        return actions;
    }

}
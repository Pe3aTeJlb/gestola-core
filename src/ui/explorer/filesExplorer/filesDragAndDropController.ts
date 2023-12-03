import * as vscode from "vscode";
import { Project } from "../../../project";
import { ProjectTreeItem } from "../projectsExplorer/projectsProvider";

export class FilesDragAndDropController implements vscode.TreeDragAndDropController<ProjectTreeItem> {

    dropMimeTypes = ['application/vnd.code.tree.testViewDragAndDrop'];
	dragMimeTypes = ['text/uri-list'];

    public async handleDrop(target: TreeItem | undefined, sources: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
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

	public handleDrag(sources: TreeItem[], treeDataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
        if (token.isCancellationRequested) {
            return Promise.resolve();
        }

        const files = sources.map(s => s.id);
		treeDataTransfer.set(SOLUTION_EXPLORER_MIME_TYPE, new vscode.DataTransferItem(files));

        return Promise.resolve();
	}

    private getTreeItems(sources: vscode.DataTransfer): TreeItem[] {
        const transferItem = sources.get(SOLUTION_EXPLORER_MIME_TYPE);
        if (!transferItem) {
            return [];
        }

        const treeItems: TreeItem[] = [];
        for (const id of transferItem.value) {
            const treeItem = this.solutionTreeItemCollection.getLoadedChildTreeItemById(id);
            if (treeItem) {
                treeItems.push(treeItem);
            }
        }

        return treeItems;
    }

    private async getDropActions(target: TreeItem, treeItems: TreeItem[]): Promise<Action[]> {
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
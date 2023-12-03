import * as vscode from 'vscode';
import { ProjectManager } from '../../../project';
import { ProjectTreeItem } from './projectTreeItem';
import { TreeItemCollection } from '../abstractTree/treeItemCollection';
import { ProjectsDragAndDropController } from './projectsDragAndDropController';

export class ProjectsProvider implements vscode.TreeDataProvider<ProjectTreeItem> {

    projManager: ProjectManager;
	treeView: vscode.TreeView<ProjectTreeItem>;
	treeItemCollection: TreeItemCollection;
	projDragAndDropController: ProjectsDragAndDropController;

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){

        this.projManager = projManager;
        this.projManager.onDidChangeProjectList(() => this.refresh());
		this.treeItemCollection = new TreeItemCollection();
		this.projDragAndDropController = new ProjectsDragAndDropController();

		this.treeView = vscode.window.createTreeView(
            'gestola-explorer-projects', 
            {
                treeDataProvider: this
                //dragAndDropController: this.projDragAndDropController
            }
        );

		context.subscriptions.push(this.treeView);

    }

	getChildren(element?: ProjectTreeItem): Promise<ProjectTreeItem[]> {

		if(element){
			return element.getChildren();
		}

		if (!element && this.treeItemCollection.hasChildren) {
			return Promise.resolve(this.treeItemCollection.items);
		}

		if (!element && !this.treeItemCollection.hasChildren) {

			for(let i = 0; i < this.projManager.openedProjects.length; i++) {
				await this.treeItemCollection.addProject(this.projManager.openedProjects[i]);
			}

			return this.treeItemCollection.items;

		}

		return Promise.resolve(this.projManager.openedProjects);
	}

	getTreeItem(element: ProjectTreeItem): ProjectTreeItem {
		return element;
	}

    private _onDidChangeTreeData: vscode.EventEmitter<ProjectTreeItem | undefined | null | void> = new vscode.EventEmitter<ProjectTreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<ProjectTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
  
	refresh(): void {
	  this._onDidChangeTreeData.fire();
	}

}
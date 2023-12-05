import * as vscode from 'vscode';
import { Project, ProjectManager } from '../../../project';
import { ProjectTreeItem } from './projectTreeItem';

export class ProjectsProvider implements vscode.TreeDataProvider<Project>, vscode.TreeDragAndDropController<Project> {

    projManager: ProjectManager;
	treeView: vscode.TreeView<Project>;

	dropMimeTypes = ['text/uri-list'];
	dragMimeTypes = [];

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){

        this.projManager = projManager;
        this.projManager.onDidChangeProjectList(() => this.refresh());
		this.projManager.onDidChangeProjectFavoriteStatus(() => this.refresh());
		this.projManager.onDidChangeProject((event) => {
			if(event.proj){
				this.treeView.title = "projects: " + event.proj.projName;
			} else {
				this.treeView.title = "projects";
			}
		});

		this.treeView = vscode.window.createTreeView(
            'gestola-explorer-projects', 
            {
                treeDataProvider: this,
                dragAndDropController: this
            }
        );
		if(projManager.currProj){
			this.treeView.title = "projects: " + projManager.currProj.projName;
		} else {
			this.treeView.title = "projects";
		}
		context.subscriptions.push(this.treeView);

    }

	async getChildren(element?: Project): Promise<Project[]> {
		return Promise.resolve(this.projManager.openedProjects.sort((a, b) => {
			if((a.isFavorite && b.isFavorite) || (!a.isFavorite && !b.isFavorite)){
				return a.projName.localeCompare(b.projName);	
			} else {
				return a.isFavorite ? -1 : 1;
			}
		}));
	}

	async getTreeItem(element: Project): Promise<ProjectTreeItem> {
		return Promise.resolve(new ProjectTreeItem(element));
	}

    private _onDidChangeTreeData: vscode.EventEmitter<Project | undefined | null | void> = new vscode.EventEmitter<Project | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<Project | undefined | null | void> = this._onDidChangeTreeData.event;
  
	refresh(): void {
	  this._onDidChangeTreeData.fire();
	}

	public async handleDrop(target: Project, source: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
		source.forEach((value) => {
			this.projManager.addProjectByDrop(vscode.Uri.parse(value.value));
		});
	}

}
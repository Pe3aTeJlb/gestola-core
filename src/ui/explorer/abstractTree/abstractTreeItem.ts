import * as vscode from "vscode";

export abstract class AbstractTreeItem extends vscode.TreeItem {

    constructor(
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
    ){
        super(label, collapsibleState);
        this.createId();
        //this.loadIcon();
		this.loadResourceUri();
    }

    public command: vscode.Command | undefined;
    public id?: string;
	public resourceUri?: vscode.Uri;

    protected createId(): void {
        /*
		let id: string;
		if (this.parent) {
			id = this.parent.id + '-' + this.label + '[' + this.contextValue + ']';
		} else if (this.solution) {
			id = this.solution.fullPath + '[' + this.contextValue + ']';
		} else {
			id = this.label + '[' + this.contextValue + ']';
		}

		this.id = id;*/
	}

    protected loadResourceUri(): void {/*
		const ignoreTypes = [
			ContextValues.projectReferencedPackage,
			ContextValues.projectReferencedPackageDependency,
			ContextValues.projectReferencedPackages,
			ContextValues.projectReferencedProject,
			ContextValues.projectReferencedProjects,
			ContextValues.projectReferences,
			ContextValues.solutionFolder
		];

		if (ignoreTypes.indexOf(this.contextValue) >= 0) {
			return;
		}

		if (this.path) {
			this.resourceUri = vscode.Uri.file(this.path);
			return;
		}

		if (this.solution && this.solution.fullPath) {
			this.resourceUri = vscode.Uri.file(path.dirname(this.solution.fullPath));
			return;
		}*/
	}

}
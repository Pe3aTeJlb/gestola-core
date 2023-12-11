import * as vscode from 'vscode';
import { Project } from '../../../project';
import { Entry } from './FilesProvider';

export class FilesTreeItem extends vscode.TreeItem {

    constructor(public entry: Entry){

        super(
            entry.uri,
            entry.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );

        this.resourceUri = entry.uri;
        this.contextValue = entry.type === vscode.FileType.Directory ? 'folder' : 'file';

		if (entry.type === vscode.FileType.File) {
			
            this.command = {
                title: "this.proj.projName",
                command: 'vscode.open',
                arguments: [entry.uri]
            };

		}
        
    }

}
import * as vscode from 'vscode';
import { Project } from '../../../project';
import { Entry } from './filesProvider';

export class FilesTreeItem extends vscode.TreeItem {

    constructor(public entry: Entry){

        super(
            entry.uri,
            entry.type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );

        this.resourceUri = entry.uri;

		if (entry.type === vscode.FileType.File) {
			
            this.contextValue = 'file';
            this.command = {
                title: "this.proj.projName",
                command: 'vscode.open',
                arguments: [entry.uri]
            };

		}
        
    }

}
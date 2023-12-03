import * as vscode from 'vscode';
import { Project } from '../../../project';

export class FilesTreeItem extends vscode.TreeItem{

    resourceUri?: vscode.Uri | undefined;

    constructor(public proj: Project){
        super(proj.projName);
        this.resourceUri = proj.rootUri;
    }
    
    command = {
        title: "this.proj.projName",
        command: 'gestola-core.set-project',
        arguments: [   
            this.proj
        ]
    };


}
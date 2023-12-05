import * as vscode from 'vscode';
import { Project } from '../../../project';

export class ProjectTreeItem extends vscode.TreeItem {

    constructor(public proj: Project){
        
        super(proj.projName);
        
        this.resourceUri = proj.rootUri;

        this.command = {
            title: "this.proj.projName",
            command: 'gestola-core.set-project',
            arguments: [   
                this.proj
            ]
        };

    }

}
import { Project } from '../../../project';
import { AbstractTreeItem } from '../abstractTree/abstractTreeItem';

export class ProjectTreeItem extends AbstractTreeItem{

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
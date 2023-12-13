import { Action } from "../../actions/Action";
import { CreateProjectAction } from "../../actions/projActions/CreateProjectAction";
import { Project, ProjectManager } from "../../project";
import { FilesActionCommand } from "../FilesActionCommands";

export class OpenToSideCommand extends FilesActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Create Project');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return true;
    }

    public async getActions(projects: Project[] | undefined): Promise<Action[]> {
        return [new OpenToS(this.projManager)];
    }
   
}
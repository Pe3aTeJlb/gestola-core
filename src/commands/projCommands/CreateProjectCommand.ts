import { Action } from "../../actions/Action";
import { CreateProjectAction } from "../../actions/projActions/CreateProjectAction";
import { Project, ProjectManager } from "../../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class CreateProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Create Project');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return true;
    }

    public async getActions(projects: Project[] | undefined): Promise<Action[]> {
        return [new CreateProjectAction(this.projManager)];
    }
   
}
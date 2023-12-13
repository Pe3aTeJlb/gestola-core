import { Action } from "../../actions/Action";
import { RemoveProjectAction } from "../../actions/projActions/RemoveProjectAction";
import { SetProjectAction } from "../../actions/projActions/SetProjectAction";
import { Project, ProjectManager } from "../../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class RemoveProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Remove Project');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return !!projects && projects.length > 0;
    }

    public async getActions(projects: Project[] | undefined): Promise<Action[]> {
        return [new RemoveProjectAction(this.projManager, projects)];
    }

}
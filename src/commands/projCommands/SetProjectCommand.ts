import { Action } from "../../actions/Action";
import { SetProjectAction } from "../../actions/projActions/SetProjectAction";
import { Project, ProjectManager } from "../../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class SetProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Set Project Command');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return !!projects && projects.length > 0;
    }

    public async getActions(projects: Project[]): Promise<Action[]> {
        return [new SetProjectAction(this.projManager, projects)];
    }

}
import { Action } from "../actions/Action";
import { OpenProjectAction } from "../actions/OpenProjectAction";
import { Project, ProjectManager } from "../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class OpenProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Open Project');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return true;
    }

    public async getActions(projects: Project[] | undefined): Promise<Action[]> {
        return [new OpenProjectAction(this.projManager)];
    }

}
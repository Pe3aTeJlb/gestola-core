import { Action } from "../../actions/Action";
import { OpenProjectAction } from "../../actions/projActions/OpenProjectAction";
import { Project, ProjectManager } from "../../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class OpenProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Open Project Command');
    }

    public shouldRun(projects: Project[] | undefined): boolean {
        return true;
    }

    public async getActions(projects: Project[]): Promise<Action[]> {
        return [new OpenProjectAction(this.projManager)];
    }

}
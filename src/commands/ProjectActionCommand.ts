import { Action } from "../actions/Action";
import { Project, ProjectManager } from "../project";
import { BaseAction } from "./BaseCommand";

export abstract class ProjectActionCommand {

    constructor(title: string, projManager: ProjectManager){
    }

    public async getActionBase(projects: Project[]): Promise<Action[]> {
        return this.shouldRun(projects) ? this.getActions(projects) : [];
    }

    public abstract shouldRun(projects: Project[] | undefined): boolean;

    public abstract getActions(projects: Project[] | undefined): Promise<Action[]>;

}
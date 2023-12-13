import { Project, ProjectManager } from "../../project";
import { Action, ActionContext } from "../Action";

export class RemoveProjectAction implements Action {

    canRevert: boolean;

    constructor(private readonly projManager: ProjectManager, private readonly projects: Project[] | undefined){
        this.canRevert = !!projects && projects.length > 0;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled && this.projects){
            this.projManager.removeProject(this.projects);
        }
        return Promise.resolve();
    }

    public revert(): Promise<void> {
        if(this.projects){
            this.projManager.addProject(this.projects?.map(i => i.rootUri));
        }
        return Promise.resolve();
    }

    toString(): string {
        return this.projects 
        ? `Remove ${this.projects}` 
        : 'Remove project';
    }

}
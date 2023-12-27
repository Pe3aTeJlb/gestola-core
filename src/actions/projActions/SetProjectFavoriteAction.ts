import { Project, ProjectManager } from "../../project";
import { Action, ActionContext } from "../Action";

export class SetProjectFavoriteAction implements Action {

    canRevert: boolean;

    constructor(private readonly projManager: ProjectManager, private readonly projects: Project[]){
        this.canRevert = false;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled && this.projects){
            this.projManager.setFavorite(this.projects[0]);
        }
        return Promise.resolve();
    }

    toString(): string {
        return this.projects 
        ? `Set ${this.projects[0].projName} favorite` 
        : 'Set project favorite';
    }

}
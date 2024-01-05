import { ProjectManager } from "../../project";
import { Action, ActionContext } from "../Action";

export class CreateProjectAction implements Action {

    canRevert: boolean;

    constructor(private readonly projManager: ProjectManager){
        this.canRevert = false;
    }

    public async execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            this.projManager.createProject();
        }
        return Promise.resolve();
    }

    toString(): string {
        return 'Create Gestola project';
    }

}
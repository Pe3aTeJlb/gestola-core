import { ProjectManager } from "../project";
import { Action, ActionContext } from "./Action";

export class OpenProjectAction implements Action {

    canRevert: boolean;

    constructor(private readonly projManager: ProjectManager){
        this.canRevert = false;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
            this.projManager.openProject();
        }
        return Promise.resolve();
    }

    toString(): string {
        return 'Open Gestola project';
    }

}
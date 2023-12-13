import { ProjectManager } from "../../project";
import { Action, ActionContext } from "../Action";

export class OpenToSideAction implements Action {

    canRevert: boolean;

    constructor(){
        this.canRevert = false;
    }

    public execute(context: ActionContext): Promise<void> {
        if(!context.cancelled){
           
        }
        return Promise.resolve();
    }

    toString(): string {
        return 'Open Gestola project';
    }

}
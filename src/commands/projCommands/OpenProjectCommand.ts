import { Action } from "../../actions/Action";
import { OpenProjectAction } from "../../actions/projActions/OpenProjectAction";
import { ProjectManager } from "../../project";
import { ProjectActionCommand } from "./ProjectActionCommand";

export class OpenProjectCommand extends ProjectActionCommand {

    constructor(private readonly projManager : ProjectManager){
        super('Open Project Command');
    }

    public shouldRun(): boolean {
        return true;
    }

    public async getActions(): Promise<Action[]> {
        return [new OpenProjectAction(this.projManager)];
    }

}
import { Action } from "../../actions/Action";
import { Project } from "../../project";
import { BaseCommand } from "../BaseCommand";

export abstract class ProjectActionCommand extends BaseCommand {

    constructor(title: string){
        super(title);
    }

    public override async getActionBase(projects: Project[]): Promise<Action[]> {
        return this.shouldRun(projects) ? this.getActions(projects) : [];
    }

    public abstract override shouldRun(projects? : Project[]): boolean;

    public abstract override getActions(projects? : Project[]): Promise<Action[]>;

}
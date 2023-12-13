import { Action } from "../actions/Action";

export abstract class BaseCommand {

    constructor(title: string){
    }

    public abstract getActionBase(...args: any): Promise<Action[]>;
    public abstract shouldRun(...args: any): boolean;
    public abstract getActions(...args: any): Promise<Action[]>;

}
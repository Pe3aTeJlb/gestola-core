import { Action } from "../actions/Action";

export abstract class BaseAction {

    constructor(protected title: string){

    }

    public abstract getActionBase(): Promise<Action[]>;

}
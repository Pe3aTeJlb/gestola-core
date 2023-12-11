import * as core from "../Core";
import { GestolaExplorer } from "./explorer/GestolaExplorer";

export class UIController{

    constructor(core: core.Core){

        new GestolaExplorer(core.context, core.projManager);
        
    }

}
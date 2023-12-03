import * as core from "../core";
import { GestolaExplorer } from "./explorer/gestolaExplorer";

export class UIController{

    constructor(core: core.Core){

        new GestolaExplorer(core.context, core.projManager);
        
    }

}
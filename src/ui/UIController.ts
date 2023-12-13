import * as core from "../Core";
import { ExplorerCommands } from "./explorer/ExplorerCommands";
import { GestolaExplorer } from "./explorer/GestolaExplorer";

export class UIController{

    gestolaExplorer: GestolaExplorer;

    constructor(core: core.Core){

        this.gestolaExplorer = new GestolaExplorer(core.context, core.projManager);
        new ExplorerCommands(core.context, this.gestolaExplorer, core.actionsRunner);
        
    }

}
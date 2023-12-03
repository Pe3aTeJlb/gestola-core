import * as vscode          from 'vscode';
import { ProjectManager }   from './project'; 
import { UIController }     from "./ui";

export class Core {

    context: vscode.ExtensionContext;

    projManager: ProjectManager;
    uiController: UIController;

    constructor(context: vscode.ExtensionContext){

        this.context = context;

        this.projManager = new ProjectManager(context);
        this.uiController = new UIController(this);

        context.subscriptions.push(
            vscode.commands.registerCommand('gestola-core.test-msg', this.showInformationMessage, this)
        );

    }

    showInformationMessage(msg = "default message"){
        vscode.window.showInformationMessage(msg);
    }

    dispose(){

        //this.projManager.dispose();

    }

}


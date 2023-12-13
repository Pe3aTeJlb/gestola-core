import * as vscode          from 'vscode';
import { ProjectManager }   from './project'; 
import { UIController }     from "./ui";
import { EventAggregator } from './event/EventAggregator';
import { Logger } from './log/Logger';
import { ActionsRunner } from './ActionsRunner';
import { ProjectCommands } from './project/ProjectCommands';

export class Core {

    context: vscode.ExtensionContext;

    projManager: ProjectManager;
    uiController: UIController;
    actionsRunner: ActionsRunner;

    constructor(context: vscode.ExtensionContext){

        this.context = context;

        const eventAggregator = new EventAggregator();
        const logger = new Logger(eventAggregator);
        this.actionsRunner = new ActionsRunner(logger);

        this.projManager = new ProjectManager();
        new ProjectCommands(context, this.projManager, this.actionsRunner);

        this.uiController = new UIController(this);

        context.subscriptions.push(
            vscode.commands.registerCommand('gestola-core.test-msg', this.showInformationMessage, this)
        );

    }

    showInformationMessage(msg = "default message"){
        vscode.window.showInformationMessage(msg);
    }

    dispose(){

    }

}


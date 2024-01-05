import * as vscode from 'vscode';
import { ProjectManager } from "./ProjectManager";
import { ActionsRunner } from '../ActionsRunner';
import { CreateProjectCommand } from '../commands/projCommands/CreateProjectCommand';
import { ProjectActionCommand } from '../commands/projCommands/ProjectActionCommand';
import { OpenProjectCommand } from '../commands/projCommands/OpenProjectCommand';
import { SetProjectCommand } from '../commands/projCommands/SetProjectCommand';
import { RemoveProjectCommand } from '../commands/projCommands/RemoveProjectCommand';
import { SetProjectFavoriteCommand } from '../commands/projCommands/SetProjectFavoriteCommand';
import { Action } from '../actions/Action';

export class ProjectCommands{

    private commands: Map<string, ProjectActionCommand>;

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager, actionsRunner: ActionsRunner){
        
        this.commands = new Map();

        this.commands.set("gestola-core.create-project", new CreateProjectCommand(projManager));
        this.commands.set("gestola-core.open-project", new OpenProjectCommand(projManager));
        this.commands.set("gestola-core.set-project", new SetProjectCommand(projManager));
        this.commands.set("gestola-core.close-project", new RemoveProjectCommand(projManager));
        this.commands.set("gestola-core.set-project-favorite", new SetProjectFavoriteCommand(projManager));

        for (let [key, command] of this.commands) {
            context.subscriptions.push(vscode.commands.registerCommand(key, async (...args) => {
                let actions: Action[] = [];
                if(args.length !== 0){
                    actions = await command.getActionBase([args[0]]);
                } else if(projManager.currProj){
                    actions = await command.getActionBase([projManager.currProj]);
                } else {
                    //a.k.a null args
                    actions = await command.getActionBase(args);
                }
                if(actions.length > 0){
                    await actionsRunner.run(actions, {isCancellationRequested: false});
                }
            }));
        }

    }

}
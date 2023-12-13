import * as vscode from 'vscode';
import { ProjectManager } from "./ProjectManager";
import { Project } from './Project';
import { ActionsRunner } from '../ActionsRunner';
import { CreateProjectCommand } from '../commands/CreateProjectCommand';
import { ProjectActionCommand } from '../commands/ProjectActionCommand';
import { OpenProjectCommand } from '../commands/OpenProjectCommand';
import { SetProjectCommand } from '../commands/SetProjectCommand';
import { RemoveProjectCommand } from '../commands/RemoveProjectCommand';
import { SetProjectFavoriteCommand } from '../commands/SetProjectFavoriteCommand';

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
                const actions = await command.getActionBase(args);
                if(actions.length > 0){
                    await actionsRunner.run(actions, {isCancellationRequested: false});
                }
            }));
        }

    }

}
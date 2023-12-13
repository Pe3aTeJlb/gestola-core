import * as vscode from 'vscode';
import { ProjectManager } from "./ProjectManager";
import { Project } from './Project';

export class ProjectCommands{

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){
/*
        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.create-project', () => {
            new CreateProjectAction();
        }));
*/



        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.create-project', () => {
            projManager.createProject();
        }));
    
        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.open-project', () => {
            projManager.openProject();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.set-project', (proj:Project) => {
            projManager.setProject(proj);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.close-project', (proj:Project) => {
            projManager.removeProject(proj);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.set-project-favorite', (proj:Project) => {
            projManager.setFavorite(proj);
        }));

    }

}
import * as vscode from 'vscode';
import * as utils from '../utils';
import { defProjStruct, Project } from './project';
import { ProjectCommands } from './projectCommands';
import * as path from 'path';

export interface ProjectChangeEvent {
    readonly proj: Project;
}

export interface ProjectsListChangeEvent {
    readonly projects: Project[];
}

export class ProjectManager {

    projRoot: vscode.WorkspaceFolder | undefined;

    openedProjects: Project[];
    currProj: Project | undefined;

    private _onDidChangeProject: vscode.EventEmitter<ProjectChangeEvent>;
    private _onDidChangeProjectList: vscode.EventEmitter<ProjectsListChangeEvent>;

    constructor(context: vscode.ExtensionContext){

        this._onDidChangeProject = new vscode.EventEmitter<ProjectChangeEvent>();
        this._onDidChangeProjectList = new vscode.EventEmitter<ProjectsListChangeEvent>();
    
        this.openedProjects = [];

        this.refreshProjectsList();
        
        this.openedProjects.length > 0 
        ? this.currProj = this.openedProjects[0]
        : this.currProj = undefined;

        new ProjectCommands(context, this);

    }
    
    createProject() {

        const options: vscode.OpenDialogOptions = {
            title: 'Create Project',
            openLabel: 'Create',
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true
        };

        vscode.window.showOpenDialog(options).then(fileUri => {

            if (fileUri && fileUri[0]) {
                if(utils.FSProvider.isDirEmpty(fileUri[0].fsPath)){
                    utils.FSProvider.createDirStructure(fileUri[0].fsPath, defProjStruct);
                    this.addProject(fileUri[0]);
                } else {
                    vscode.commands.executeCommand("gestola-core.test-msg","Selected directory is not empty");
                }
            }

        });
        
    }

    openProject(){

        const options: vscode.OpenDialogOptions = {
            title: 'Open Project',
            openLabel: 'Open',
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true
        };

        vscode.window.showOpenDialog(options).then(fileUri => {

            if (fileUri && fileUri[0]) {
                if(utils.FSProvider.isDirEmpty(fileUri[0].fsPath)){
                    vscode.commands.executeCommand("gestola-core.test-msg","Selected directory is not a Gestola project");
                } else {
                    if(this.checkForGestolaProject(fileUri[0].fsPath)){
                        if(this.openedProjects.filter(i => i.rootUri === fileUri[0]).length > 0) {
                            this.setProject(this.openedProjects.filter(i => i.rootUri === fileUri[0])[0]);
                        } else {
                            vscode.commands.executeCommand("gestola-core.test-msg","is Gestola project");
                            this.addProject(fileUri[0]);
                        }
                    } else {
                        vscode.commands.executeCommand("gestola-core.test-msg", "Selected directory is not a Gestola project");
                    }
                }
            }

        });

    }

    private refreshProjectsList(){
        this.openedProjects = [];
        if(vscode.workspace.workspaceFolders){
            for(let i = 0; i < vscode.workspace.workspaceFolders.length; i++){
                if(this.checkForGestolaProject(vscode.workspace.workspaceFolders[i].uri.fsPath)){
                    let j = i;
                    this.openedProjects.push(new Project(vscode.workspace.workspaceFolders[j]));
                }
            }
        }
        this.fireProjectsListChangeEvent();
    }

    addProject(uri: vscode.Uri){

        vscode.workspace.updateWorkspaceFolders(
            vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
            0,
            { uri: uri, name: uri.fsPath.split(path.sep)[-1] }
        );
        this.refreshProjectsList();

        //If project is only folder in workspace
        if(this.openedProjects.length === 1){
            this.setProject(this.openedProjects[0]);
        }

    }

    removeProject(proj: Project){
        let toDelete = vscode.workspace.getWorkspaceFolder(proj.rootUri);
        if(vscode.workspace.workspaceFolders && toDelete){
            vscode.workspace.updateWorkspaceFolders(
                vscode.workspace.workspaceFolders.indexOf(toDelete),
                1
            );
        }
        this.refreshProjectsList();
    }   

    setProject(proj: Project){
        this.currProj = proj;
        vscode.commands.executeCommand('setContext', 'gestola-core.projName', proj.projName);
        this.fireProjectChangeEvent();
    }

    //Context

    //Listeners
    private fireProjectChangeEvent(){
        this._onDidChangeProject.fire({proj: this.currProj} as ProjectChangeEvent);
    }

    private fireProjectsListChangeEvent(){
        vscode.commands.executeCommand('setContext', 'gestola-core.isProjOpened', this.openedProjects.length > 0);
        this._onDidChangeProjectList.fire({projects: this.openedProjects} as ProjectsListChangeEvent);
    }

    get onDidChangeProject(): vscode.Event<ProjectChangeEvent> {
		return this._onDidChangeProject.event;
	}

    get onDidChangeProjectList(): vscode.Event<ProjectsListChangeEvent> {
		return this._onDidChangeProjectList.event;
	}

    //Utils

    private checkForGestolaProject(path: string){

        let dirs = utils.FSProvider.getSubDirList(path);

        return (
            dirs.filter( i => i.match(new RegExp('system', "i"))).length   === 1 &&
            dirs.filter( i => i.match(new RegExp('rtl', "i"))).length      === 1 &&
            dirs.filter( i => i.match(new RegExp('topology', "i"))).length === 1 &&
            dirs.filter( i => i.match(new RegExp('other', "i"))).length    === 1 
        );

    }

}
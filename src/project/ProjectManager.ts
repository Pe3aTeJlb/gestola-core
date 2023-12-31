import * as vscode from 'vscode';
import * as utils from '../utils';
import { defProjStruct, Project } from './Project';
import { ProjectCommands } from './ProjectCommands';
import * as path from 'path';

export interface ProjectChangeEvent {
    readonly proj: Project;
}

export interface ProjectsListChangeEvent {
    readonly projects: Project[];
}

export interface ProjectFavoriteStatusChangeEvent {
    readonly project: Project;
}

export class ProjectManager {

    projRoot: vscode.WorkspaceFolder | undefined;

    openedProjects: Project[];
    currProj: Project | undefined;

    private _onDidChangeProject: vscode.EventEmitter<ProjectChangeEvent>;
    private _onDidChangeProjectList: vscode.EventEmitter<ProjectsListChangeEvent>;
    private _onDidChangeFavoriteStatus: vscode.EventEmitter<ProjectFavoriteStatusChangeEvent>;

    constructor(){

        vscode.workspace.onDidChangeWorkspaceFolders(() => this.refreshProjectsList());

        this._onDidChangeProject = new vscode.EventEmitter<ProjectChangeEvent>();
        this._onDidChangeProjectList = new vscode.EventEmitter<ProjectsListChangeEvent>();
        this._onDidChangeFavoriteStatus = new vscode.EventEmitter<ProjectFavoriteStatusChangeEvent>();
    
        this.openedProjects = [];

        this.refreshProjectsList();
        
        this.openedProjects.length > 0 
        ? this.currProj = this.openedProjects[0]
        : this.currProj = undefined;

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
                    this.addProject([fileUri[0]]);
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
                            this.addProject([fileUri[0]]);
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

    addProjectByDrop(uri: vscode.Uri | undefined){
        
        if(!uri){
            return;
        }

        if(this.checkForGestolaProject(uri.fsPath)){
            this.addProject([uri]);
        } else {
            vscode.commands.executeCommand("gestola-core.test-msg", "Selected directory is not a Gestola project");
        }

    }

    addProject(uri: vscode.Uri[]){

        uri.forEach(i => {
            vscode.workspace.updateWorkspaceFolders(
                vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
                0,
                { uri: i, name: path.basename(i.fsPath) }
            );
        });
        this.refreshProjectsList();

        //If project is only folder in workspace
        if(this.openedProjects.length === 1){
            this.setProject(this.openedProjects[0]);
        }

    }

    removeProject(proj: Project[]){
        console.log(proj);
        proj.forEach(p => {
            let toDelete = vscode.workspace.getWorkspaceFolder(p.rootUri);
            if(vscode.workspace.workspaceFolders && toDelete){
                vscode.workspace.updateWorkspaceFolders(
                    vscode.workspace.workspaceFolders.indexOf(toDelete),
                    1
                );
            }
        });
        this.refreshProjectsList();
    }   

    setProject(proj: Project){
        this.currProj = proj;
        this.fireProjectChangeEvent();
    }

    //Context

    setFavorite(proj: Project){
        proj.setFavorite();
        this.fireProjectFavoriteStatusChangeEvent(proj);
    }

    //Listeners
    private fireProjectChangeEvent(){
        this._onDidChangeProject.fire({proj: this.currProj} as ProjectChangeEvent);
    }

    private fireProjectsListChangeEvent(){
        vscode.commands.executeCommand('setContext', 'gestola-core.isProjOpened', this.openedProjects.length > 0);
        this._onDidChangeProjectList.fire({projects: this.openedProjects} as ProjectsListChangeEvent);
    }

    private fireProjectFavoriteStatusChangeEvent(proj: Project){
        this._onDidChangeFavoriteStatus.fire({project: proj} as ProjectFavoriteStatusChangeEvent);
    }

    get onDidChangeProject(): vscode.Event<ProjectChangeEvent> {
		return this._onDidChangeProject.event;
	}

    get onDidChangeProjectList(): vscode.Event<ProjectsListChangeEvent> {
		return this._onDidChangeProjectList.event;
	}

    get onDidChangeProjectFavoriteStatus(): vscode.Event<ProjectFavoriteStatusChangeEvent> {
        return this._onDidChangeFavoriteStatus.event;
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

    public getOpenedProject(uri: vscode.Uri) : Project[] {
        return this.openedProjects.filter(i => i.rootUri.fsPath === uri.fsPath);
    }

    public isOpenedProject(uri: vscode.Uri) : boolean{
        return this.openedProjects.filter(i => i.rootUri.fsPath === uri.fsPath).length > 0;
    }

}
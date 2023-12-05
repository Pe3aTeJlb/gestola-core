import * as vscode from "vscode";
import { ProjectManager } from "../../project";

export class TreeFileDecorationProvider implements vscode.FileDecorationProvider {

    private readonly _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined> = new vscode.EventEmitter< vscode.Uri | vscode.Uri[]>();
    readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[] | undefined> = this._onDidChangeFileDecorations.event;
  
    private projManager: ProjectManager;

    constructor(projManager: ProjectManager) {
        this.projManager = projManager;
        this.projManager.onDidChangeProject(() => {
            this._onDidChangeFileDecorations.fire(projManager.openedProjects.map(i => i.rootUri));
        });
        this.projManager.onDidChangeProjectFavoriteStatus((event) => {
            this._onDidChangeFileDecorations.fire(projManager.openedProjects.map(i => i.rootUri));
        });
    } 
  
    async provideFileDecoration(uri: vscode.Uri): Promise<vscode.FileDecoration | undefined> {

        let badge: string = "";

        if(this.projManager.isOpenedProject(uri)){

            if(this.projManager.getOpenedProject(uri)[0].isFavorite){
                badge += "★";
            }

            if (uri.fsPath === this.projManager.currProj?.rootPath) {
                badge += "⇐";
            }

            if (badge.length > 0) {

                return {
                    badge: badge
                };

            } else {
                return undefined;
            } 

        }

    }
  
  }
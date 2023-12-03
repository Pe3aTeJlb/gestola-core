import * as vscode from "vscode";
import { ProjectManager } from "../../../project";

export class TreeFileDecorationProvider implements vscode.FileDecorationProvider {

    private readonly _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined> = new vscode.EventEmitter< vscode.Uri | vscode.Uri[]>();
    readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[] | undefined> = this._onDidChangeFileDecorations.event;
  
    private projManager: ProjectManager;

    constructor(projManager: ProjectManager) {
        this.projManager = projManager;
        this.projManager.onDidChangeProject(() => {
            this._onDidChangeFileDecorations.fire(projManager.openedProjects.map(i => i.rootUri));
        });
    } 
  
    async provideFileDecoration(uri: vscode.Uri): Promise<vscode.FileDecoration | undefined> {

        if (uri.fsPath === this.projManager.currProj?.rootPath) {
            return {
                badge: "⇐"
            };
        } else {
            return undefined;
        } 

    }
  
  }
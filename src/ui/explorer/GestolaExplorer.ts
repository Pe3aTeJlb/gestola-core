import * as vscode from "vscode";
import { Entry, FileSystemProvider } from "./filesExplorer/FilesProvider";
import { ProjectManager } from "../../project";
import { ProjectsProvider } from "./projectsExplorer/ProjectsProvider";
import { TreeFileDecorationProvider } from "./TreeFileDecoratorProvider";

export class GestolaExplorer{

    currTree: vscode.TreeView<Entry> | undefined = undefined;
    currTreeRoot: Entry | undefined = undefined;
    projManager: ProjectManager;

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){

        this.projManager = projManager;

        vscode.commands.executeCommand(
            'setContext', 
            'gestola-core.explorerFileViews', ["gestola-explorer-systemLvl", "gestola-explorer-rtlLvl", "gestola-explorer-topologyLvl", "gestola-explorer-otherFiles"]
        );

        //TreeView for projects
        new ProjectsProvider(context, projManager);

        //TreeView for project levels]

        new FileSystemProvider(context, this, projManager, "gestola-explorer-systemLvl");
        new FileSystemProvider(context, this, projManager, "gestola-explorer-rtlLvl");
        new FileSystemProvider(context, this, projManager, "gestola-explorer-topologyLvl");
        new FileSystemProvider(context, this, projManager, "gestola-explorer-otherFiles");
       
        //Ohters

        context.subscriptions.push(
            vscode.window.registerFileDecorationProvider(
                new TreeFileDecorationProvider(projManager)
            )
        );

    }

}
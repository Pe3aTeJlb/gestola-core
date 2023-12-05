import * as vscode from "vscode";
import { Entry, FileSystemProvider } from "./filesExplorer/filesProvider";
import { ProjectManager } from "../../project";
import { ProjectsProvider } from "./projectsExplorer/projectsProvider";
import { ExplorerCommands } from "./explorerCommands";
import { TreeFileDecorationProvider } from "./treeFileDecoratorProvider";

export class GestolaExplorer{

    currTree: vscode.TreeView<Entry> | undefined = undefined;

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){

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
        
        new ExplorerCommands(context, this);

    }

}
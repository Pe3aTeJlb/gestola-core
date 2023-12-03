import * as vscode from "vscode";
import { Entry, FileSystemProvider } from "./filesExplorer/filesProvider";
import { ProjectManager } from "../../project";
import { ProjectsProvider } from "./projectsExplorer/projectsProvider";
import { ExplorerCommands } from "./explorerCommands";
import { TreeFileDecorationProvider } from "./projectsExplorer/treeFileDecoratorProvider";

export class GestolaExplorer{

    currTree: vscode.TreeView<Entry> | undefined = undefined;

    constructor(context: vscode.ExtensionContext, projManager: ProjectManager){

        vscode.commands.executeCommand(
            'setContext', 
            'gestola-core.explorerFileViews', ["gestola-explorer-systemLvl", "gestola-explorer-rtlLvl", "gestola-explorer-topologyLvl", "gestola-explorer-otherFiles"]
        );

        //TreeView for projects
        new ProjectsProvider(context, projManager);

        //TreeView for project levels

        let sysTree = vscode.window.createTreeView(
            'gestola-explorer-systemLvl', 
            {
                treeDataProvider: new FileSystemProvider("system", projManager),
                canSelectMany: true
            }
        );
        sysTree.onDidChangeSelection(() => {

            this.currTree = sysTree;

            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextSingle', sysTree.selection.length === 1);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextDouble', sysTree.selection.length === 2);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextMultiple', sysTree.selection.length > 2);

        });
        context.subscriptions.push(sysTree);

        let rtlTree = vscode.window.createTreeView(
            'gestola-explorer-rtlLvl', 
            {
                treeDataProvider: new FileSystemProvider("rtl", projManager),
                canSelectMany: true
            }
        );
        rtlTree.onDidChangeSelection(() => {

            this.currTree = rtlTree;

            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextSingle', rtlTree.selection.length === 1);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextDouble', rtlTree.selection.length === 2);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextMultiple', rtlTree.selection.length > 2);

        });
        context.subscriptions.push(rtlTree);


        let topologyTree = vscode.window.createTreeView(
            'gestola-explorer-topologyLvl', 
            {
                treeDataProvider: new FileSystemProvider("topology", projManager),
                canSelectMany: true
            }
        );
        topologyTree.onDidChangeSelection(() => {

            this.currTree = topologyTree;

            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextSingle', topologyTree.selection.length === 1);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextDouble', topologyTree.selection.length === 2);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextMultiple', topologyTree.selection.length > 2);

        });
        context.subscriptions.push(topologyTree);


        let otherTree = vscode.window.createTreeView(
            'gestola-explorer-otherFiles', 
            {
                treeDataProvider: new FileSystemProvider("other", projManager),
                canSelectMany: true
            }
        );
        otherTree.onDidChangeSelection(() => {
            
            this.currTree = otherTree;

            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextSingle', otherTree.selection.length === 1);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextDouble', otherTree.selection.length === 2);
            vscode.commands.executeCommand('setContext', 'gestola-core.selectionContextMultiple', otherTree.selection.length > 2);

        });
        context.subscriptions.push(otherTree);


        context.subscriptions.push(
            vscode.window.registerFileDecorationProvider(
                new TreeFileDecorationProvider(projManager)
            )
        );
        
        new ExplorerCommands(context, this);

    }

}
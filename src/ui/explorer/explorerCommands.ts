import * as vscode from 'vscode';
import { GestolaExplorer } from './gestolaExplorer';
import { Entry } from './filesExplorer/filesProvider';

export class ExplorerCommands{

    constructor(context: vscode.ExtensionContext, explorer: GestolaExplorer){


        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.openToSide', (selEntry: Entry) => {
            vscode.commands.executeCommand('explorer.openToSide', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.revealFileInOS', (selEntry: Entry) => {

            if(explorer.currTree?.selection){
                for(let i = 0; i < explorer.currTree.selection.length; i++){
                    vscode.commands.executeCommand('revealFileInOS', explorer.currTree.selection[i].uri);    
                }
            } else {
                vscode.commands.executeCommand('revealFileInOS', selEntry.uri);
            }

        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.openWith', (selEntry: Entry) => {
            vscode.commands.executeCommand('explorer.openWith', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.openInIntegratedTerminal', (selEntry: Entry) => {
            vscode.commands.executeCommand('explorer.openWith', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.diff', (selEntry: Entry) => {
            if(explorer.currTree?.selection){
                vscode.commands.executeCommand('vscode.diff', explorer.currTree.selection[0].uri, explorer.currTree.selection[1].uri);
            }
        }));


    
        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.copyFilePath', (selEntry: Entry) => {
            vscode.commands.executeCommand('copyFilePath', selEntry.uri);
        }));
      
        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.copyRelativeFilePath', (selEntry: Entry) => {
            vscode.commands.executeCommand('copyRelativeFilePath', selEntry.uri);
        }));

       

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.cut', (selEntry: Entry) => {
            vscode.commands.executeCommand('filesExplorer.cut', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.copy', (selEntry: Entry) => {
            vscode.commands.executeCommand('filesExplorer.copy', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.paste', (selEntry: Entry) => {
            vscode.commands.executeCommand('filesExplorer.paste', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.rename', (selEntry: Entry) => {
            vscode.commands.executeCommand('renameFile', selEntry.uri);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('gestola-core.delete', (selEntry: Entry) => {
            vscode.commands.executeCommand('moveFileToTrash', selEntry.uri);
        }));


    }

}
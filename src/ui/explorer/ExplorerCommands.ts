import * as vscode from 'vscode';
import { GestolaExplorer } from './GestolaExplorer';
import { FilesActionCommand } from '../../commands/filesCommands/FilesActionCommands';
import { ActionsRunner } from '../../ActionsRunner';
import { OpenToSideCommand } from '../../commands/filesCommands/OpenToSideCommand';
import { RevealFileInOSCommand } from '../../commands/filesCommands/RevealFileInOSCommand';
import { OpenWithCommand } from '../../commands/filesCommands/OpenWithCommand';
import { OpenInIntegratedTerminalCommand } from '../../commands/filesCommands/OpenInIntegratedTerminalCommand';
import { FilesDiffCommand } from '../../commands/filesCommands/FilesDiffCommand';
import { CopyFilePathCommand } from '../../commands/filesCommands/CopyFIlePathCommand';
import { CopyRelativeFilePathCommand } from '../../commands/filesCommands/CopyFileRelativePathCommand';
import { CopyFileCommand } from '../../commands/filesCommands/CopyFileCommand';
import { PasteFileCommand } from '../../commands/filesCommands/PasteFileCommand';
import { RenameFileCommand } from '../../commands/filesCommands/RenameCommand';
import { DeleteCommand } from '../../commands/filesCommands/DeleteCommand';
import { CreateFileCommand } from '../../commands/filesCommands/CreateFileCommand';
import { CreateFolderCommand } from '../../commands/filesCommands/CreateFolderCommand';
import { MoveFileCommand } from '../../commands/filesCommands/MoveFileCommand';
import { AddExternalFileCommand } from '../../commands/filesCommands/AddExternalFileCommand';

export class ExplorerCommands{

    private commands: Map<string, FilesActionCommand>;

    constructor(context: vscode.ExtensionContext, readonly explorer: GestolaExplorer, actionsRunner: ActionsRunner){

        this.commands = new Map();

        this.commands.set("gestola-core.openToSide", new OpenToSideCommand());
        this.commands.set("gestola-core.revealFileInOS", new RevealFileInOSCommand());
        this.commands.set("gestola-core.openWith", new OpenWithCommand());
        this.commands.set("gestola-core.openInIntegratedTerminal", new OpenInIntegratedTerminalCommand());
        this.commands.set("gestola-core.diff", new FilesDiffCommand());

        this.commands.set("gestola-core.copyFilePath", new CopyFilePathCommand());
        this.commands.set("gestola-core.copyRelativeFilePath", new CopyRelativeFilePathCommand());

        this.commands.set("gestola-core.copy", new CopyFileCommand());
        this.commands.set("gestola-core.paste", new PasteFileCommand());
        this.commands.set("gestola-core.rename", new RenameFileCommand());
        this.commands.set("gestola-core.delete", new DeleteCommand());

        this.commands.set("gestola-core.createFile", new CreateFileCommand());
        this.commands.set("gestola-core.createFolder", new CreateFolderCommand());

        this.commands.set("gestola-core.moveFile", new MoveFileCommand());
        this.commands.set("gestola-core.addExternalFile", new AddExternalFileCommand());

        context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFolderHelper1", () => {
			vscode.commands.executeCommand("gestola-core.createFolder", {uri: this.explorer.projManager.currProj?.systemFolderUri, type: vscode.FileType.Directory});
		}));

		context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFileHelper1", () => {
			vscode.commands.executeCommand("gestola-core.createFile", {uri: this.explorer.projManager.currProj?.systemFolderUri, type: vscode.FileType.Directory});
		}));
        context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFolderHelper2", () => {
			vscode.commands.executeCommand("gestola-core.createFolder", {uri: this.explorer.projManager.currProj?.rtlFolderUri, type: vscode.FileType.Directory});
		}));

		context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFileHelper2", () => {
			vscode.commands.executeCommand("gestola-core.createFile", {uri: this.explorer.projManager.currProj?.rtlFolderUri, type: vscode.FileType.Directory});
		}));
        context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFolderHelper3", () => {
			vscode.commands.executeCommand("gestola-core.createFolder", {uri: this.explorer.projManager.currProj?.topologyFolderUri, type: vscode.FileType.Directory});
		}));

		context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFileHelper3", () => {
			vscode.commands.executeCommand("gestola-core.createFile", {uri: this.explorer.projManager.currProj?.topologyFolderUri, type: vscode.FileType.Directory});
		}));
        context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFolderHelper4", () => {
			vscode.commands.executeCommand("gestola-core.createFolder", {uri: this.explorer.projManager.currProj?.otherFolderUri, type: vscode.FileType.Directory});
		}));

		context.subscriptions.push(vscode.commands.registerCommand("gestola-core.createFileHelper4", () => {
			vscode.commands.executeCommand("gestola-core.createFile", {uri: this.explorer.projManager.currProj?.otherFolderUri, type: vscode.FileType.Directory});
		}));

        
        for (let [key, command] of this.commands) {
            context.subscriptions.push(vscode.commands.registerCommand(key, async (...args) => {
                let actions;
                if(args.length !== 0){
                    //context menu action
                    actions = await command.getActionBase(args[0], args[1]);
                } else {
                    //keybinding action
                    actions = await command.getActionBase(explorer.currTree?.selection[0], explorer.currTree?.selection);
                }
                if(actions.length > 0){
                    await actionsRunner.run(actions, {isCancellationRequested: false});
                }
            }));
        }

    }

}
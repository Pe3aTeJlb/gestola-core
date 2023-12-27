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
import { CutFileCommand } from '../../commands/filesCommands/CutFileCommand';
import { CopyFileAction } from '../../actions/filesAction/CopyFileAction';
import { CopyFileCommand } from '../../commands/filesCommands/CopyFileCommand';
import { PasteFileCommand } from '../../commands/filesCommands/PasteFileCommand';
import { RenameFileCommand } from '../../commands/filesCommands/RenameFileCommand';
import { DeleteFileCommand } from '../../commands/filesCommands/DeleteFileCommand';
import { CreateFileCommand } from '../../commands/filesCommands/CreateFileCommand';
import { CreateFolderCommand } from '../../commands/filesCommands/CreateFolderCommand';
import { MoveFileCommand } from '../../commands/filesCommands/MoveFileCommand';

export class ExplorerCommands{

    private commands: Map<string, FilesActionCommand>;

    constructor(context: vscode.ExtensionContext, explorer: GestolaExplorer, actionsRunner: ActionsRunner){

        this.commands = new Map();

        this.commands.set("gestola-core.openToSide", new OpenToSideCommand());
        this.commands.set("gestola-core.revealFileInOS", new RevealFileInOSCommand());
        this.commands.set("gestola-core.openWith", new OpenWithCommand());
        this.commands.set("gestola-core.openInIntegratedTerminal", new OpenInIntegratedTerminalCommand());
        this.commands.set("gestola-core.diff", new FilesDiffCommand());

        this.commands.set("gestola-core.copyFilePath", new CopyFilePathCommand());
        this.commands.set("gestola-core.copyRelativeFilePath", new CopyRelativeFilePathCommand());

        this.commands.set("gestola-core.cut", new CutFileCommand());
        this.commands.set("gestola-core.copy", new CopyFileCommand());
        this.commands.set("gestola-core.paste", new PasteFileCommand());
        this.commands.set("gestola-core.rename", new RenameFileCommand());
        this.commands.set("gestola-core.delete", new DeleteFileCommand());

        this.commands.set("gestola-core.createFile", new CreateFileCommand());
        this.commands.set("gestola-core.createFolder", new CreateFolderCommand());

        this.commands.set("gestola-core.moveFile", new MoveFileCommand());
        
        for (let [key, command] of this.commands) {
            context.subscriptions.push(vscode.commands.registerCommand(key, async (...args) => {
                const actions = await command.getActionBase(args[0], args[1]);
                if(actions.length > 0){
                    await actionsRunner.run(actions, {isCancellationRequested: false});
                }
            }));
        }

    }

}
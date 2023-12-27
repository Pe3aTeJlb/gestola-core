import * as vscode from 'vscode';
import { GestolaExplorer } from './GestolaExplorer';
import { FilesActionCommand } from '../../commands/filesCommands/FilesActionCommands';
import { ActionsRunner } from '../../ActionsRunner';
import { OpenToSideCommand } from '../../commands/filesCommands/OpenToSideCommand';

export class ExplorerCommands{

    private commands: Map<string, FilesActionCommand>;

    constructor(context: vscode.ExtensionContext, explorer: GestolaExplorer, actionsRunner: ActionsRunner){

        this.commands = new Map();

        this.commands.set("gestola-core.openToSide", new OpenToSideCommand());
        this.commands.set("gestola-core.revealFileInOS", new OpenToSideCommand());
        this.commands.set("gestola-core.openWith", new OpenToSideCommand());
        this.commands.set("gestola-core.openInIntegratedTerminal", new OpenToSideCommand());
        this.commands.set("gestola-core.diff", new OpenToSideCommand());

        this.commands.set("gestola-core.copyFilePath", new OpenToSideCommand());
        this.commands.set("gestola-core.copyRelativeFilePath", new OpenToSideCommand());

        this.commands.set("gestola-core.cut", new OpenToSideCommand());
        this.commands.set("gestola-core.copy", new OpenToSideCommand());
        this.commands.set("gestola-core.paste", new OpenToSideCommand());
        this.commands.set("gestola-core.rename", new OpenToSideCommand());
        this.commands.set("gestola-core.delete", new OpenToSideCommand());

        this.commands.set("gestola-core.createFile", new OpenToSideCommand());
        this.commands.set("gestola-core.createFlder", new OpenToSideCommand());

        this.commands.set("gestola-core.moveFile", new OpenToSideCommand());
        

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
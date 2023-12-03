import * as vscode from 'vscode';
import { Core } from './core';

let core : Core;

export async function activate(context: vscode.ExtensionContext) {

    console.log('gestola-core is active.');
    core = new Core(context);

}

export function deactivate() {
    return undefined;
    //core.dispose();
}
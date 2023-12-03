import * as vscode from 'vscode';
import * as path from 'path';
import * as utils from '../utils';

export const defProjStruct = ['system', 'rtl', 'topology', 'other'];

export class Project{

    rootUri: vscode.Uri;
    rootPath: string;

    projName: string;

    systemFolderUri: vscode.Uri;
    rtlFolderUri: vscode.Uri;
    topologyFolderUri: vscode.Uri;
    otherFolderUri: vscode.Uri;

    systemFolderPath: string;
    rtlFolderPath: string;
    topologyFolderPath: string;
    otherFolderPath: string;

    public static regexp =  [
                                new RegExp('system', "i"), 
                                new RegExp('rtl', "i"), 
                                new RegExp('topology', "i"), 
                                new RegExp('other', "i")
                            ];
    
    constructor(folder: vscode.WorkspaceFolder){

        this.rootUri = folder.uri;
        this.rootPath = folder.uri.fsPath;
        
        this.projName = folder.name;


        let dirs = utils.FSProvider.getSubDirList(this.rootPath);

        
        this.systemFolderPath = path.join(this.rootPath, dirs.filter( i => i.match(Project.regexp[0]))[0]);
        this.rtlFolderPath = path.join(this.rootPath, dirs.filter( i => i.match(Project.regexp[1]))[0]);
        this.topologyFolderPath = path.join(this.rootPath, dirs.filter( i => i.match(Project.regexp[2]))[0]);
        this.otherFolderPath = path.join(this.rootPath, dirs.filter( i => i.match(Project.regexp[3]))[0]);        

        this.systemFolderUri = vscode.Uri.file(this.systemFolderPath);
        this.rtlFolderUri = vscode.Uri.file(this.rtlFolderPath);
        this.topologyFolderUri = vscode.Uri.file(this.topologyFolderPath);
        this.otherFolderUri = vscode.Uri.file(this.otherFolderPath);

    }

}
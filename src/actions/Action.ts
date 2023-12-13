export type ActionContext = { multipleActions: boolean, yesAll: boolean, overwriteAll: boolean, keepBothAll: boolean, skipAll: boolean, cancelled: boolean };

export interface Action {

    canRevert: boolean;

    execute(context: ActionContext): Promise<void>;
    revert?(): Promise<void>;
    
    toString(): string;

}


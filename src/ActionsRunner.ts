import { Action, ActionContext } from "./actions/Action";
import { ILogger } from "./log/ILogger";

export class ActionsRunner {

    private undoStack: Action[];

    constructor(private readonly logger: ILogger) {
        this.undoStack = [];
    }

    public async run(actions: Action[], cancellationToken?: { isCancellationRequested: boolean }): Promise<void> {
        const context: ActionContext = {
            multipleActions: actions.length > 1,
            yesAll: false,
            overwriteAll: false,
            keepBothAll: false,
            skipAll: false,
            cancelled: false
        };

        for (const action of actions) {
            
            if (cancellationToken?.isCancellationRequested) {
                this.logger.warn("Actions cancelled");
                return;
            }

            if(action.canRevert){
                this.undoStack.push(action);
            }

            await action.execute(context);
            /*
            try {
                await action.execute(context);
                this.logger.log(`${action.toString()}`);
            } catch (error) {
                this.logger.error(`Error running ${action.toString()}: ${JSON.stringify(error)}`);
            }*/
        }
    }

    public async undo(){
        let action = this.undoStack.pop();
        if(action && action.revert){
            await action.revert();
            /*
            try {
                await action.revert();
                this.logger.log(`Redo ${action.toString()}`);
            } catch (error) {
                this.logger.error(`Error running redo ${action.toString()}: ${JSON.stringify(error)}`);
            }*/
        }
    }

}
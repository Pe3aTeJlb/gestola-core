import { IEventAggregator } from "../event/IEventAggregator";
import { LogEvent } from "../event/log/LogEvent";
import { LogEventType } from "../event/log/LogEventType";
import { ILogger } from "./ILogger";


export class Logger implements ILogger {
    constructor(private readonly eventAggregator: IEventAggregator) {
    }

    public log(text: string): void {
        if (!text) { return; }
        let event = new LogEvent(LogEventType.append, text);
		this.eventAggregator.publish(event);
    }

    public info(text: string): void {
        if (!text) { return; }
        this.log("info: " + text);
    }

    public error(text: string): void {
        if (!text) { return; }
        this.log("error: " + text);
    }

    public warn(text: string): void {
        if (!text) { return; }
        this.log("warning: " + text);
    }
}
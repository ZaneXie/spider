/**
 * Created by qing.he on 2016/12/8.
 */
import {injectable} from 'inversify';
import {getDebugger} from "../util/debug";
import {EventEmitter} from 'events';
let debug = getDebugger("spider");
import {getLogger} from "../config/log";

export const SpiderEvents = {
    TargetUrlChange: 'TargetUrlChange',
    Parsing        : 'Parsing',
}
export interface IBaseSpider {
    Event: EventEmitter;
    run();
    hasTask(): Promise<boolean>;
}

@injectable()
export abstract class BaseSpider implements IBaseSpider {
    public Event: EventEmitter;
    public Logger;
    public constructor() {
        this.Event = new EventEmitter();
        this.Logger = getLogger();
    }

    public async run() {
        if (await this.hasTask()) {
            let currUrl = this.getNextUrl();
            if (currUrl) {
                this.parsePromise(currUrl).then((objs) => {
                    this.saveToDB(objs);
                });
            }
        }
    }

    public abstract getNextUrl(): string|undefined;

    public abstract async hasTask(): Promise<boolean>;

    public abstract async parsePromise(url: string): Promise<{}[]>;

    public abstract saveToDB(objs: {}[]);
}

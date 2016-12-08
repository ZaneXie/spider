/**
 * Created by qing.he on 2016/12/8.
 */
import {injectable} from 'inversify';
import {getDebugger} from "../util/debug";
import {EventEmitter} from 'events';
let debug = getDebugger("spider");

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

    public constructor() {
        this.Event = new EventEmitter();
    }

    public async run() {
        await this.hasTask();
        await this.parsePromise(this.getNextUrl()).then((objs) => {
            return this.saveToDB(objs);
        });
    }

    public abstract getNextUrl(): string;

    public abstract async hasTask(): Promise<boolean>;

    public abstract async parsePromise(url: string): Promise<{}[]>;

    public abstract saveToDB(objs: {}[]);
}

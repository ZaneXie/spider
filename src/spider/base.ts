/**
 * Created by qing.he on 2016/12/8.
 */
import {injectable} from 'inversify';
import {getDebugger} from "../util/debug";
import {EventEmitter} from 'events';
let debug = getDebugger("spider");
import {getLogger} from "../config/log";

export const SpiderEvents = {
    TargetUrlChange         : 'TargetUrlChange',
    Parsing                  : 'Parsing',
    Saving                   : 'Saving',
    Done                     : 'Done',
};

export const SpiderEventsType = {
    Complex: 'Complex',
    Selling: 'Selling',
    Sold   : 'Sold',
};


export enum SpiderItemStatus {
    Waiting,
    Parsing,
    Parsed,
    Saving,
    Saved,
}

export enum SpiderStatus {
    running,
    stopping,
    stopped,
}

export interface SpiderItem {
    id: any;
    url: string;
    status: SpiderItemStatus;
    percent: number;
    [name: string]: any;
}

export interface IBaseSpider {
    Event: EventEmitter;
    run();
    stop();
    prepare();
    getAllTargetItems(),
    getAllTargetItemsCount(),
    getCurrTargetItems(),
    getCurrTargetItemsCount(),
}

@injectable()
export abstract class BaseSpider implements IBaseSpider {
    Event: EventEmitter;
    Logger;
    allTargetItems: SpiderItem[] = [];
    currTargetItems: SpiderItem[] = [];
    spiderStatus: SpiderStatus;

    public constructor() {
        this.Event = new EventEmitter();
        this.Logger = getLogger();
        this.spiderStatus = SpiderStatus.running;
    }

    public async run() {
        let currItem : any = this.getNextTargetItem();
        if (currItem) {
            this.notify(SpiderEvents.Parsing, currItem);
            currItem.status = SpiderItemStatus.Parsing;
            currItem.percent = 10;
            this.parsePromise(currItem).then((objs) => {
                currItem.status = SpiderItemStatus.Parsed;
                currItem.percent = 60;
                currItem.status = SpiderItemStatus.Saving;
                this.notify(SpiderEvents.Saving, currItem);
                currItem.percent = 80;
                this.saveToDB(objs).then(() => {
                    currItem.status = SpiderItemStatus.Saved;
                    currItem.percent = 100;
                    this.notify(SpiderEvents.Done, currItem);
                });
            });
        }
    }

    //TODO
    public stop() {
        this.spiderStatus = SpiderStatus.stopping;
    }

    public async prepare() {
        await this.prepareTargetItems();
        this.notify(SpiderEvents.TargetUrlChange, this.currTargetItems);
    }

    public getAllTargetItems(): SpiderItem[] {
        return this.allTargetItems;
    }

    public getCurrTargetItems(): SpiderItem[] {
        return this.currTargetItems;
    }

    public getAllTargetItemsCount() : number {
        return this.allTargetItems.length;
    }

    public getCurrTargetItemsCount() : number {
        return this.currTargetItems.length;
    }

    getNextTargetItem(): SpiderItem | undefined {
        return this.currTargetItems.pop();
    }

    notify(event: string, items: SpiderItem | SpiderItem[]){
        this.Event.emit(event, this.getSpiderEventType(), items);
    }

    abstract async prepareTargetItems();

    abstract async parsePromise(spiderItem: SpiderItem): Promise<{}[]>;

    abstract saveToDB(objs: {}[]);

    abstract getSpiderEventType() : string;
}

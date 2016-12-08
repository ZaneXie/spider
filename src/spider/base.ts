/**
 * Created by qing.he on 2016/12/8.
 */
import {injectable} from 'inversify';
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");

export interface IBaseSpider {
    run();
    hasTask(): Promise<boolean>;
}

@injectable()
export abstract class BaseSpider implements IBaseSpider{
    public async run(){
        await this.hasTask();
        await this.parsePromise(this.getNextUrl()).then((objs) => {
            return this.saveToDB(objs);
        });
    }

    public abstract getNextUrl(): string;
    public abstract async hasTask(): Promise<boolean>;
    public abstract async parsePromise(url:string):Promise<{}[]>;
    public abstract saveToDB(objs: {}[]);
}

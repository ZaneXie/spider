/**
 * Created by qing.he on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import {getDebugger} from "../util/debug";
import {IComplexManager} from "../manager/complex";
import {inject, injectable} from 'inversify';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("spider");
import {BaseSpider, SpiderEvents, SpiderEventsType} from './base'


@injectable()
export class CDComplexSpider extends BaseSpider {

    private complexManager: IComplexManager;
    private targetUrls;
    private totalPageNum:number = 10;
    private nextPageNum:number = 0;

    public constructor(@inject(SERVICE_IDENTIFIER.ComplexManager) complexManager: IComplexManager) {
        super();
        this.complexManager = complexManager;
        this.targetUrls = this.targetUrlsMaker();
    }

    public async parsePromise(url: string): Promise<{}[]>{
        this.Event.emit(SpiderEvents.Parsing, SpiderEventsType.Complex, url);
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let result: {}[] = [];
        $(".main-box .house-lst li").each(function (key, ele) {
            let where = $(ele).find(".info-panel .where a span").text();
            let url = $(ele).find(".info-panel .where a").attr("href");
            let pattern = /(\d{8,})/
            let match = pattern.exec(url);
            let id = "";
            if (match && match[0]) {
                id = match[0];
            }
            result.push({lj_id:id, url:url, name: where});
        });
        return result;
    }

    public getNextUrl():string|undefined {
        return this.targetUrls.next()['value'];
    }
    private* targetUrlsMaker():IterableIterator<string>{
        while (this.nextPageNum++ <= this.totalPageNum){
            yield  "http://cd.lianjia.com/ershoufang/pg" + this.nextPageNum + "/";
        }
    }

    public saveToDB(complexes: {}[]){
        return this.complexManager.save(complexes);
    }

    public async hasTask(): Promise<boolean>{
        return this.nextPageNum < this.totalPageNum;
    }
}



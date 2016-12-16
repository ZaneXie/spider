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
import {BaseSpider, SpiderEventsType, SpiderItem, SpiderItemStatus} from './base'


class CDComplexItem implements SpiderItem{
    id: any;
    url: string;
    status: any = SpiderItemStatus.Waiting;
    percent: number = 0;
}

@injectable()
export class CDComplexSpider extends BaseSpider {

    private complexManager: IComplexManager;
    private totalPageNum:number = 100;

    public constructor(@inject(SERVICE_IDENTIFIER.ComplexManager) complexManager: IComplexManager) {
        super();
        this.complexManager = complexManager;
    }

    async parsePromise(spiderItem: SpiderItem): Promise<{}[]>{
        let url = spiderItem.url;
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

    private genTargetItems(){
        for (let i = this.totalPageNum; i > 0; i--) {
            let item = new CDComplexItem();
            item.id = i;
            item.url = "http://cd.lianjia.com/ershoufang/pg" + i + "/";
            this.allTargetItems.push(item);
            this.currTargetItems.push(item);
        }
    }

    async prepareTargetItems() {
        this.genTargetItems();
    }

    saveToDB(complexes: {}[]){
        return this.complexManager.save(complexes);
    }

    notify(event: string, item: SpiderItem) {
        this.Event.emit(event, SpiderEventsType.Complex, item.url);
    }

    public getSpiderEventType():string {
        return SpiderEventsType.Complex;
    }
}



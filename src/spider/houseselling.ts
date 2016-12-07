/**
 * Created by qing.he on 2016/12/6.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import {getDebugger} from "../util/debug";
import {inject, injectable} from 'inversify';
import {HouseManager, IHouseManager} from "../manager/house";
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("spider");

export interface IHouseSellingSpider {
    run();
}

@injectable()
export class CDHouseSellingSpider implements IHouseSellingSpider {

    private houseManager: IHouseManager;

    public constructor(@inject(SERVICE_IDENTIFIER.HouseManager) houseManager: IHouseManager) {
        this.houseManager = houseManager;
    }

    async parse(complexID: string) {
        let url = "http://cd.lianjia.com/ershoufang/c" + complexID + "/";
        debug("parsing url: " + url);
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let result:{}[] = [];
        $(".main-box .house-lst li").each(function (key, ele) {
            let title = $(ele).find("h2 a").text().trim();
            let where = $(ele).find(".where a span").text().trim();

            let info = $(ele).find(".where span");
            let layout = $(info.get(0)).find("span").text().trim();
            let area = $(info.get(1)).find(("span")).text().trim();

            let location = $(ele).find(".other .con a").text().trim();
            let detail = $(ele).find(".other .con").text().trim();

            let totalPrice = $(ele).find(".price span").text().trim();
            let unitPrice = $(ele).find(".price-pre").text().trim();

            let visitorNum = $(ele).find(".square span").text().trim();

            let url = $(ele).find(".info-panel h2 a").attr("href");
            let pattern = /.*\/(.*)\.html/
            let match = pattern.exec(url);
            let id = "";
            if (match && match[1]) {
                id = match[1];
            }
            let pattern_price = /(\d+)/
            let match_price = pattern_price.exec(unitPrice);
            if (match_price && match_price[0]) {
                unitPrice = match_price[0];
            }
            result.push({
                ljID: id,
                url: url,
                title: title,
                complex_id: complexID,
                layout: layout,
                area: area,
                location: location,
                total_price: totalPrice,
                unit_price: unitPrice,
                visitor_num: visitorNum,
                detail: detail,
            });
        });
        return result;
    }

    private async realRun() {
        let complexIDs:string[] = [];
        let jobs: Promise<any>[] = [];
        //TODO: Get complex IDs from database.
        complexIDs.push("3011053205624");
        for (let idx:number = 0; idx < complexIDs.length; idx++) {
            jobs.push(this.parse(complexIDs[idx]).then((obj) => {
                this.houseManager.save(obj);
            }));
        }
        await Promise.all(jobs);
    }

    public run() {
        this.realRun()
    }
}


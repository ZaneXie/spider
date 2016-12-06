/**
 * Created by qing.he on 2016/12/6.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");

export interface HouseSellingSpider {
    run();
}

export class CDHouseSellingSpider implements HouseSellingSpider {
    async parse(houseId: string) {
        let url = "http://cd.lianjia.com/ershoufang/c" + houseId + "/";
        debug("parsing url: " + url);
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let result:{}[] = [];
        $(".main-box .house-lst li").each(function (key, ele) {
            let title = $(ele).find("h2 a").text();
            let where = $(ele).find(".where a span").text();

            let info = $(ele).find(".where span");
            let layout = $(info.get(0)).find("span").text();
            let area = $(info.get(1)).find(("span")).text();

            let location = $(ele).find(".other .con a").text();
            let detail = $(ele).find(".other .con").text();

            let totalPrice = $(ele).find(".price span").text();
            let unitPrice = $(ele).find(".price-pre").text();

            let visitorNum = $(ele).find(".square span").text();

            let url = $(ele).find(".info-panel h2 a").attr("href");
            let pattern = /.*\/(.*)\.html/
            let match = pattern.exec(url);
            let id = "";
            if (match && match[1]) {
                id = match[1];
            }
            result.push({id, title, detail, where, totalPrice, unitPrice, visitorNum, url});
           debug(result[1])
        });
        debug("get " + result.length + " elements.");
        return result;
    }

    private async realRun() {
        let complexIDs:string[] = [];
        let jobs: Promise<any>[] = [];
        //TODO: Get complex IDs from database.
        complexIDs.push("3011053205624");
        for (let idx:number = 0; idx < complexIDs.length; idx++) {
            jobs.push(this.parse(complexIDs[idx]).then((obj) => {
                //TODO save info and mark complex done
                obj.forEach((item, index)=> {
                    debug(item["id"] + "[" + index + "]");
                });
            }));
        }
        await Promise.all(jobs);
    }

    public run() {
        this.realRun()
    }
}


/**
 * Created by qing.he on 2016/12/6.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");
import {inject, injectable} from 'inversify';

export interface IHouseSoldSpider {
    run();
}

@injectable()
export class CDHouseSoldSpider implements IHouseSoldSpider {

    async parse(complexID: string) {
        let url = "http://cd.lianjia.com/chengjiao/c" + complexID + "/";
        debug("parsing url: " + url);
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let result:{}[] = [];
        $(".main-box .clinch-list li").each(function (key, ele) {
            let title = $(ele).find("h2 a").text();
            let infos = $(ele).find(".div-cun");
            let time = $(infos.get(0)).text();
            let price = $(infos.get(1)).text();
            let total = $(infos.get(2)).text();
            let detail = $(ele).find(".other .con").text();
            let url = $(ele).find(".info-panel h2 a").attr("href");
            let pattern = /.*\/(.*)\.html/
            let match = pattern.exec(url);
            let id = "";
            if (match && match[1]) {
                id = match[1];
            }
            result.push({id, title, detail, time, price, total, url});
        });
        debug("get " + result.length + " elements.");
        return result;
    }

    private async realRun() {
        let complexIDs:string[] = [];
        let jobs: Promise<any>[] = [];
        let result = '';
        //TODO: Get complex IDs from database
        complexIDs.push("3011053205624");
        for (let idx:number = 0; idx < complexIDs.length; idx++) {
            jobs.push(this.parse(complexIDs[idx]).then((obj) => {
                obj.forEach((item, index)=> {
                    // debug(item["id"] + "[" + index + "]");
                });
                //TODO save info and mark complex done.
            }));
        }
        await Promise.all(jobs);
    }

    public run() {
        this.realRun();
    }
}

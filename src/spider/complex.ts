/**
 * Created by qing.he on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");
let csv: any = Bluebird.promisifyAll(require('csv'));

export interface ComplexSpider {
    run();
}

export class CDComplexSpider implements ComplexSpider {
    async parse(pageNum: number) {
        let url = "http://cd.lianjia.com/ershoufang/pg" + pageNum + "/";
        debug("parsing url: " + url);
        let html = await requestPromise(url);
        let $ = cheerio.load(html);
        let result = [];
        $(".main-box .house-lst li").each(function (key, ele) {
            let where = $(ele).find(".info-panel .where a span").text();
            let url = $(ele).find(".info-panel .where a").attr("href");
            let pattern = /(\d{8,})/
            let match = pattern.exec(url);
            let id = null;
            if (match && match[0]) {
                id = match[0];
            }
            result.push({id, url, where});
        });
        debug("get " + result.length + " elements.");
        return result;
    }

    private i: number = 1;
    private totalPage: number = 1;
    private thread: number = 1;

    private async realRun() {
        if (this.i > this.totalPage) {
            // debug("writing files...");
            // fs.writeFileSync("D:\\1234.csv", result, "utf-8");
            // debug("done");
            return;
        }
        let jobs = [];
        for (let k = 0; k < this.thread && this.i <= this.totalPage; k++, this.i++) {
            jobs.push(this.parse(this.i).then(csv.stringifyAsync).then((line) => {
                // result += line;
            }));
        }
        await Promise.all(jobs);
        this.realRun();
    }

    public run() {
        this.i = 1;
        this.totalPage = 1;
        this.thread = 1;
        this.realRun();
    }
}


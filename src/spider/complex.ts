/**
 * Created by qing.he on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import {getDebugger} from "../util/debug";
import {ComplexManager, IComplexManager} from "../manager/complex";
import {inject, injectable} from 'inversify';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("spider");

export interface IComplexSpider {
    run();
}

@injectable()
export class CDComplexSpider implements IComplexSpider {

    private complexManager: IComplexManager;

    public constructor(@inject(SERVICE_IDENTIFIER.ComplexManager) complexManager: IComplexManager) {
        this.complexManager = complexManager;
    }

    async parse(pageNum: number) {
        let url = "http://cd.lianjia.com/ershoufang/pg" + pageNum + "/";
        debug("parsing url: " + url);
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

    private i: number = 1;
    private totalPage: number = 1;
    private thread: number = 1;

    private async realRun() {
        if (this.i > this.totalPage) {
            return;
        }
        let jobs: Promise<any>[] = [];
        for (let k = 0; k < this.thread && this.i <= this.totalPage; k++, this.i++) {
            jobs.push(this.parse(this.i).then((complexes) => {
                return this.complexManager.save(complexes);
            }));
        }
        await Promise.all(jobs);
        this.realRun();
    }

    public async run() {
        await this.realRun();
    }
}


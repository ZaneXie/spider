/**
 * Created by xiezj on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import fs = require('fs');
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");
let csv: any = Bluebird.promisifyAll(require('csv'));

async function parse(pageNum: number) {
    let url = "http://cd.lianjia.com/chengjiao/pg" + pageNum + "/";
    debug("parsing url: " + url);
    let html = await requestPromise(url);
    let $ = cheerio.load(html);
    let result = [];
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
        let id = null;
        if (match && match[1]) {
            id = match[1];
        }
        result.push({id, title, detail, time, price, total, url});
    });
    debug("get " + result.length + " elements.");
    return result;
}

let result = '';
let i = 1;

let totalPage = 10;
let thread = 10;

let run = async() => {
    if (i > totalPage) {
        debug("writing files...");
        fs.writeFileSync("D:\\123.csv", result, "utf-8");
        debug("done");
        return;
    }
    let jobs = [];
    for (let k = 0; k < thread && i <= totalPage; k++, i++) {
        jobs.push(parse(i).then(csv.stringifyAsync).then((line) => {
            result += line;
        }));
    }
    await Promise.all(jobs);
    run();
}

run();

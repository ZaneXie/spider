/**
 * Created by qing.he on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");


export let parseHtml = (houseId: number) => parse(houseId)

async function parse(pageNum: number) {
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


// let result = '';
// let i = 1;
//
// let totalPage = 1;
// let thread = 1;
//
// let run = async() => {
//     if (i > totalPage) {
//         debug("writing files...");
//         fs.writeFileSync("D:\\1234.csv", result, "utf-8");
//         debug("done");
//         return;
//     }
//     let jobs = [];
//     for (let k = 0; k < thread && i <= totalPage; k++, i++) {
//         jobs.push(parse(i).then(csv.stringifyAsync).then((line) => {
//             result += line;
//         }));
//     }
//     await Promise.all(jobs);
//     run();
// }
//
// run();


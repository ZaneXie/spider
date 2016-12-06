/**
 * Created by qing.he on 2016/12/6.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");

export let parseHtml = (houseId: number) => parse(houseId)

async function parse(houseId: number) {
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
    });
    debug("get " + result.length + " elements.");
    return result;
}
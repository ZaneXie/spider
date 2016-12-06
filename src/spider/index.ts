/**
 * Created by xiezj on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import fs = require('fs-extra-promise');
import {getDebugger} from "../util/debug";
import {CDHouseSellingSpider} from "./houseselling";
import {CDComplexSpider} from "./complex";
import {CDHouseSoldSpider} from "./housesold";
let debug = getDebugger("spider");


let run = async() => {
    debug("Start...")
    let complexSpider = new CDComplexSpider();
    let sellingSpider = new CDHouseSellingSpider();
    let soldSpider = new CDHouseSoldSpider();
    complexSpider.run();
    sellingSpider.run();
    soldSpider.run();
}

run();

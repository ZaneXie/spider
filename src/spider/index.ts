/**
 * Created by xiezj on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import fs = require('fs-extra-promise');
import {getDebugger} from "../util/debug";
import {IComplexSpider} from "./complex";
import {CDHouseSellingSpider} from "./houseselling";
import {CDHouseSoldSpider} from "./housesold";
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {Connection} from '~sequelize/index';
let debug = getDebugger("spider");

let sequelize = container.get<Connection>(SERVICE_IDENTIFIER.Sequelize);

process.on("exit", () => {
    debug("exiting...");
    sequelize.sync();
});

let spider = container.get<IComplexSpider>(SERVICE_IDENTIFIER.ComplexSpider);

sequelize.sync();
spider.run();

// let run = async() => {
//     debug("Start...")
// let complexSpider = new CDComplexSpider();
// let sellingSpider = new CDHouseSellingSpider();
// let soldSpider = new CDHouseSoldSpider();
// complexSpider.run();
// sellingSpider.run();
// soldSpider.run();
// }

// run();

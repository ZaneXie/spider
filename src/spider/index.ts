/**
 * Created by xiezj on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import fs = require('fs-extra-promise');
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {Connection} from '~sequelize/index';
import {dbConfig, initMysql} from '../config/db';
import {IBaseSpider} from "./base";
import {getDebugger} from "../util/debug";
let debug = getDebugger("spider");

let main = async() => {
    if (dbConfig.option.dialect === "mysql") {
        await initMysql();
    }
    let sequelize = container.get<Connection>(SERVICE_IDENTIFIER.Sequelize);

    process.on("exit", () => {
        debug("exiting...");
        sequelize.sync();
    });

    let complexSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.ComplexSpider);
    let sellingSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSellingSpider);
    let soldSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSoldSpider);
    sequelize.sync();
    let jobs: Promise<any>[] = [];
    // while (await complexSpider.hasTask()) {
    //     jobs.push(complexSpider.run());
    // }
    // while (await sellingSpider.hasTask()) {
    //     jobs.push(sellingSpider.run());
    // }

    while (await soldSpider.hasTask()) {
        jobs.push(soldSpider.run());
    }
    await Promise.all(jobs);
    debug("done!");
};

main();


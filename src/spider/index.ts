/**
 * Created by xiezj on 2016/12/5.
 */

import requestPromise = require("request-promise");
import cheerio = require("cheerio");
import Bluebird = require('bluebird');
import fs = require('fs-extra-promise');
import {getDebugger} from "../util/debug";
import {IComplexSpider} from "./complex";
import {IHouseSellingSpider} from "./houseselling";
import {IHouseSoldSpider} from "./housesold";
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {Connection} from '~sequelize/index';
import {dbConfig, initMysql} from '../config/db';
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

    let complexSpider = container.get<IComplexSpider>(SERVICE_IDENTIFIER.ComplexSpider);
    let sellingSpider = container.get<IHouseSellingSpider>(SERVICE_IDENTIFIER.CDHouseSellingSpider);
    let soldSpider = container.get<IHouseSoldSpider>(SERVICE_IDENTIFIER.CDHouseSoldSpider);
    sequelize.sync();
    await complexSpider.run();
    sellingSpider.run();
    // soldSpider.run();
}

main();


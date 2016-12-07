/**
 * Created by xiezongjun on 2016-12-07.
 */

import express = require('express');
import {dbConfig, initMysql} from '../config/db';
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {getDebugger} from '../util/debug';
import {Connection} from '~sequelize/index';
import {IComplexSpider} from '../spider/complex';
import {IHouseSellingSpider} from '../spider/houseselling';
import {IHouseSoldSpider} from '../spider/housesold';
let app = express();
let debug = getDebugger("server");

async function init() {
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
    await sequelize.sync();

    app.get('/', (req, res) => {
        res.send('OK!');
    });

    app.get('/spider/complex', (req, res) => {
        complexSpider.run();
        res.send('done');
    });

    app.get('/spider/selling', (req, res) => {
        sellingSpider.run();
        res.send('done');
    });

    app.get('/spider/sold', (req, res) => {
        soldSpider.run();
        res.send('done');
    });

    app.listen(3000, () => {
        console.log('server started!')
    });
}

init();

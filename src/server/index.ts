/**
 * Created by xiezongjun on 2016-12-07.
 */

import {dbConfig, initMysql} from '../config/db';
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {getDebugger} from '../util/debug';
import {Connection} from '~sequelize/index';
import Koa = require('koa');
import KoaRouter = require('koa-router');
import {IMiddleware} from 'koa-router';
import {IRouterContext} from 'koa-router';
let router = new KoaRouter();
let app = new Koa();
import {IBaseSpider} from "../spider/base";
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

    let complexSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.ComplexSpider);
    let sellingSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSellingSpider);
    let soldSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSoldSpider);
    await sequelize.sync();

    router.get('/', function *(this:IRouterContext, next) {
        this.body = "ok";
        yield next;
    });

    router.get('/spider/complex', function *(this:IRouterContext,next) {
        yield complexSpider.run();
        this.body = "done";
        yield next;
    });

    router.get('/spider/selling', function *(this:IRouterContext,next) {
        yield sellingSpider.run();
        this.body = "done";
        yield next;
    });

    router.get('/spider/sold',  function *(this:IRouterContext,next) {
        yield soldSpider.run();
        this.body = "done";
        yield next
    });

    app.listen(3000, () => {
        console.log('server started!')
    });
    app.use(router.routes())
}

init();

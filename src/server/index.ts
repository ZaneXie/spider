/**
 * Created by xiezongjun on 2016-12-07.
 */

import {dbConfig, initMysql} from '../config/db';
import container from '../config/ioc';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {getDebugger} from '../util/debug';
import Koa = require('koa');
import KoaRouter = require('koa-router');
import {IMiddleware} from 'koa-router';
import {IRouterContext} from 'koa-router';
let router = new KoaRouter();
let app = new Koa();
import {IBaseSpider, SpiderEvents} from "../spider/base";
import {getLogger} from '../config/log';
import IO = require('socket.io');
import {Sequelize} from 'sequelize';
let debug = getDebugger("server");
let logger = getLogger();
async function init() {
    logger.info("start init");
    if (dbConfig.option.dialect === "mysql") {
        await initMysql();
    }
    let sequelize = container.get<Sequelize>(SERVICE_IDENTIFIER.Sequelize);

    process.on("exit", () => {
        debug("exiting...");
        sequelize.sync();
    });

    let complexSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.ComplexSpider);
    let sellingSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSellingSpider);
    let soldSpider = container.get<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSoldSpider);
    await sequelize.sync();

    router.get('/', function *(this: IRouterContext, next) {
        this.body = "ok";
        yield next;
    });

    router.get('/spider/complex', function *(this: IRouterContext, next) {
        logger.info('start complex spider...');
        yield complexSpider.run();
        logger.info('complex spider done!');
        this.body = "done";
        yield next;
    });

    router.get('/spider/selling', function *(this: IRouterContext, next) {
        logger.info('start selling spider...');
        yield sellingSpider.run();
        logger.info('selling spider done!');
        this.body = "done";
        yield next;
    });

    router.get('/spider/sold', function *(this: IRouterContext, next) {
        logger.info('start sold spider...');
        yield soldSpider.run();
        logger.info('sold spider done!');
        this.body = "done";
        yield next
    });

    let server = require('http').createServer(app.callback());
    server.listen(3000, () => {
        // app.listen(3000, () => {
        //     console.log(app.server);
        logger.info('server started at port 3000!')
    });
    let io = IO(server);
    io.on('connection', function (socket) {
        socket.emit('news', {hello: 'world'});
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
    app.use(router.routes())

    complexSpider.Event.on(SpiderEvents.Parsing, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.Parsing, args);
    });

    complexSpider.Event.on(SpiderEvents.TargetUrlChange, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.TargetUrlChange, args);
    });

    sellingSpider.Event.on(SpiderEvents.Parsing, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.Parsing, args);
    });
    sellingSpider.Event.on(SpiderEvents.TargetUrlChange, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.TargetUrlChange, args);
    });

    soldSpider.Event.on(SpiderEvents.Parsing, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.Parsing, args);
    });
    soldSpider.Event.on(SpiderEvents.TargetUrlChange, (...args) => {
        logger.info(JSON.stringify(args));
        io.emit(SpiderEvents.TargetUrlChange, args);
    });
}

init();

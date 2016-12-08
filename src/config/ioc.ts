/**
 * Created by xiezongjun on 2016-12-06.
 */

import {Container} from 'inversify';
import "reflect-metadata";
import Sequelize = require('sequelize');
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {dbConfig} from './db';
import {Connection} from '~sequelize/index';
import {IComplexManager, ComplexManager} from '../manager/complex';
import {DataBase} from '../model/index';
import {IHouseManager, HouseManager} from '../manager/house';
import {IBaseSpider} from "../spider/base";
import {CDComplexSpider} from '../spider/complex';
import {CDHouseSellingSpider} from "../spider/houseselling";
import {CDHouseSoldSpider} from "../spider/housesold";

let container = new Container();

let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.option);

container.bind<Connection>(SERVICE_IDENTIFIER.Sequelize).toConstantValue(sequelize);
container.bind<IComplexManager>(SERVICE_IDENTIFIER.ComplexManager).to(ComplexManager);
container.bind<IHouseManager>(SERVICE_IDENTIFIER.HouseManager).to(HouseManager);
container.bind<IBaseSpider>(SERVICE_IDENTIFIER.ComplexSpider).to(CDComplexSpider);
container.bind<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSellingSpider).to(CDHouseSellingSpider);
container.bind<IBaseSpider>(SERVICE_IDENTIFIER.CDHouseSoldSpider).to(CDHouseSoldSpider);
container.bind<DataBase>(SERVICE_IDENTIFIER.DataBase).to(DataBase);

export default container;
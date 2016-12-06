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
import {IComplexSpider, CDComplexSpider} from '../spider/complex';
import {DataBase} from '../model/index';

let container = new Container();

let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.option);

container.bind<Connection>(SERVICE_IDENTIFIER.Sequelize).toConstantValue(sequelize);
container.bind<IComplexManager>(SERVICE_IDENTIFIER.ComplexManager).to(ComplexManager);
container.bind<IComplexSpider>(SERVICE_IDENTIFIER.ComplexSpider).to(CDComplexSpider);
container.bind<DataBase>(SERVICE_IDENTIFIER.DataBase).to(DataBase);

export default container;
/**
 * Created by xiezj on 2016/12/5.
 */

import Sequelize = require('sequelize');
import fs =require('fs');
import path = require('path');
import Complex = require('./complex')
import House = require('./house')
import {ComplexInstance, ComplexAttribute} from './complex';
import {Model} from '~sequelize/index';
import {HouseAttribute, HouseInstance} from './house';
import {inject, injectable} from 'inversify';
import {Connection} from '~sequelize/index';
import {SERVICE_IDENTIFIER} from '../constants/ioc';

export interface Base {
    id?: number;
}

@injectable()
export class DataBase {
    public complex: Model<ComplexInstance, ComplexAttribute>;
    public house: Model<HouseInstance, HouseAttribute>;

    public constructor(@inject(SERVICE_IDENTIFIER.Sequelize) sequelize: Connection) {
        this.complex = Complex.define(sequelize);
        this.house = House.define(sequelize);
    }
}

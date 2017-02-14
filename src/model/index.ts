/**
 * Created by xiezj on 2016/12/5.
 */

import Sequelize = require('sequelize');
import fs =require('fs');
import path = require('path');
import Complex = require('./complex')
import House = require('./house')
import {ComplexInstance, ComplexAttribute} from './complex';
import {HouseAttribute, HouseInstance} from './house';
import {inject, injectable} from 'inversify';
import {SERVICE_IDENTIFIER} from '../constants/ioc';

export interface Base {
    id?: number;
}

@injectable()
export class DataBase {
    public complex: Sequelize.Model<ComplexInstance, ComplexAttribute>;
    public house: Sequelize.Model<HouseInstance, HouseAttribute>;

    public constructor(@inject(SERVICE_IDENTIFIER.Sequelize) sequelize: Sequelize.SequelizeStatic) {
        this.complex = Complex.define(sequelize);
        this.house = House.define(sequelize);
    }
}

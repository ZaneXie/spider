/**
 * Created by xiezj on 2016/12/5.
 */

import Sequelize = require('sequelize');
import fs =require('fs');
import path = require('path');
import Complex = require('./complex')
import House = require('./house')
import {dbConfig} from "../config/db";

export interface Base {
    id?: number;
}

let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.option);

export const DataBase = {
    Complex: Complex.define(sequelize),
    House: House.define(sequelize),
};
sequelize.sync();

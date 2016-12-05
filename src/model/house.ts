/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import DataTypes = require('sequelize/lib/data-types');
import {Model} from "~sequelize/index";
export interface HouseAttribute extends Base {
    ljID?: string;
    url?: string;
    price?: number;
}

export interface HouseInstance extends Sequelize.Instance<HouseInstance, HouseAttribute>, HouseAttribute {

}

export const define = (sequelize): Model<HouseInstance, HouseAttribute> => {
    let house = sequelize.define("house", {
        ljID: DataTypes.STRING(10),
        url: DataTypes.STRING(512),
        price: DataTypes.INTEGER
    })

    return house;
}


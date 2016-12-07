/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import DataTypes = require('sequelize/lib/data-types');
import {Model} from "~sequelize/index";
export type HouseType = "default" | "revision";
export interface HouseAttribute extends Base {
    lj_id?: string;
    url?: string;
    title?: string;
    complex_id?: string;
    layout?: string;
    area?: number;
    location?: string;
    total_price?: number;
    unit_price?: number;
    visitor_num?: number;
    type?: HouseType;
    detail?: string;
}

export interface HouseInstance extends Sequelize.Instance<HouseInstance, HouseAttribute>, HouseAttribute {

}

let tableDefine = {
    lj_id      : DataTypes.STRING(10),
    url        : DataTypes.STRING(512),
    title      : DataTypes.STRING(512),
    complex_id : DataTypes.STRING(512),
    layout     : DataTypes.STRING(512),
    area       : DataTypes.DOUBLE,
    location   : DataTypes.STRING(512),
    total_price: DataTypes.INTEGER,
    unit_price : DataTypes.INTEGER,
    visitor_num: DataTypes.INTEGER,
    type       : {
        type        : DataTypes.ENUM<string>("default", "revision"),
        allowNull   : false,
        defaultValue: "default",
    },
    detail     : DataTypes.STRING(512)
};

let index = {
    indexes: [
        {
            fields: ['type']
        },
        {
            fields: ['lj_id']
        },
    ]
};

export const define = (sequelize): Model<HouseInstance, HouseAttribute> => {
    let house = sequelize.define("house", tableDefine, index);

    return house;
};


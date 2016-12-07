/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import DataTypes = require('sequelize/lib/data-types');
import {Model} from "~sequelize/index";
export type HouseType = "house" | "revision";
export interface HouseAttribute extends Base {
    ljID?: string;
    url?: string;
    title?: string;
    complex?: string;
    layout?: string;
    area?: number;
    location?: string;
    totalprice?: number;
    unitprice?: number;
    visitornum?: number;
    detail?: string;
    type?: HouseType;
}

export interface HouseInstance extends Sequelize.Instance<HouseInstance, HouseAttribute>, HouseAttribute {

}

let tableDefine = {
    ljID: DataTypes.STRING(10),
    url: DataTypes.STRING(512),
    title: DataTypes.STRING(512),
    complex: DataTypes.STRING(512),
    layout: DataTypes.STRING(512),
    area: DataTypes.STRING(512),
    location: DataTypes.STRING(512),
    totalprice: DataTypes.INTEGER,
    unitprice: DataTypes.INTEGER,
    visitornum: DataTypes.INTEGER,
    type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "house",
    },
    detail: DataTypes.STRING(512)
};

let index = {
    indexes:[
        {
            fields:['type']
        }
    ]
};

export const define = (sequelize): Model<HouseInstance, HouseAttribute> => {
    let house = sequelize.define("house", tableDefine, index);

    return house;
};


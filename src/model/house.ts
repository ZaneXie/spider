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
    title?: string;
    complex?: string;
    layout?: string;
    area?: number;
    location?: string;
    totalprice?: number;
    unitprice?: number;
    visitornum?: number;
    detail?: string;
}

export interface HouseInstance extends Sequelize.Instance<HouseInstance, HouseAttribute>, HouseAttribute {

}

export const define = (sequelize): Model<HouseInstance, HouseAttribute> => {
    let house = sequelize.define("house", {
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
        detail:DataTypes.STRING(512)
    })

    return house;
}


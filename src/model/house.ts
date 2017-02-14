/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
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
    deal_date?:Date;
}

export interface HouseInstance extends Sequelize.Instance<HouseAttribute>, HouseAttribute {

}

let tableDefine = {
    lj_id      : Sequelize.STRING(32),
    url        : Sequelize.STRING(512),
    title      : Sequelize.STRING(512),
    complex_id : Sequelize.STRING(512),
    layout     : Sequelize.STRING(512),
    area       : Sequelize.DOUBLE,
    location   : Sequelize.STRING(512),
    total_price: Sequelize.INTEGER,
    unit_price : Sequelize.INTEGER,
    visitor_num: Sequelize.INTEGER,
    type       : {
        type        : Sequelize.ENUM("default", "revision"),
        allowNull   : false,
        defaultValue: "default",
    },
    detail      : Sequelize.STRING(512),
    deal_date   : Sequelize.DATE
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

export const define = (sequelize): Sequelize.Model<HouseInstance, HouseAttribute> => {
    let house = sequelize.define("house", tableDefine, index);

    return house;
};


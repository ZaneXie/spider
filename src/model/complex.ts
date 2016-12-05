/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import DataTypes = require('sequelize/lib/data-types');
import {Model} from "~sequelize/index";
export interface ComplexAttribute extends Base {
    ljID?: string;
    url?: string;
    price?: number;
}

export interface ComplexInstance extends Sequelize.Instance<ComplexInstance, ComplexAttribute>, ComplexAttribute {

}

export const define = (sequelize): Model<ComplexInstance, ComplexAttribute> => {
    let complex = sequelize.define("complex", {
        ljID: DataTypes.STRING(10),
        url: DataTypes.STRING(512),
        price: DataTypes.INTEGER
    })

    return complex;
}

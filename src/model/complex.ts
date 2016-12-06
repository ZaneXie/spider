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
    name?: string;
}

export interface ComplexInstance extends Sequelize.Instance<ComplexInstance, ComplexAttribute>, ComplexAttribute {

}

export const define = (sequelize): Model<ComplexInstance, ComplexAttribute> => {
    let complex = sequelize.define("complex", {
        ljID: DataTypes.STRING(32),
        url: DataTypes.STRING(512),
        string: DataTypes.STRING(512)
    })

    return complex;
}

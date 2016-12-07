/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import DataTypes = require('sequelize/lib/data-types');
import {Model} from "~sequelize/index";
export type ComplexType = "default"|"revision";
export interface ComplexAttribute extends Base {
    lj_id?: string;
    url?: string;
    name?: string;
    type?: ComplexType;
}

export interface ComplexInstance extends Sequelize.Instance<ComplexInstance, ComplexAttribute>, ComplexAttribute {

}

export const define = (sequelize): Model<ComplexInstance, ComplexAttribute> => {
    let complex = sequelize.define("complex", {
            lj_id: DataTypes.STRING(32),
            url  : DataTypes.STRING(512),
            name : DataTypes.STRING(512),
            type : {
                type        : DataTypes.ENUM<string>("default", "revision"),
                allowNull   : false,
                defaultValue: "default"
            },
        },
        {
            indexes: [
                {
                    fields: ['type']
                },
                {
                    fields: ['lj_id']
                },
            ]
        }
    )

    return complex;
}

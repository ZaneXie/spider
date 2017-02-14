/**
 * Created by xiezj on 2016/12/5.
 */

import {Base} from "./index";
import Sequelize = require('sequelize');
import {DataTypes} from 'sequelize';
export type ComplexType = "default"|"revision";
export interface ComplexAttribute extends Base {
    lj_id?: string;
    url?: string;
    name?: string;
    type?: ComplexType;
}

export interface ComplexInstance extends Sequelize.Instance<ComplexAttribute>, ComplexAttribute {

}

export const define = (sequelize): Sequelize.Model<ComplexInstance, ComplexAttribute> => {
    let complex = sequelize.define("complex", {
            lj_id: Sequelize.STRING(32),
            url: Sequelize.STRING(512),
            name: Sequelize.STRING(512),
            type: {
                type: Sequelize.ENUM("default", "revision"),
                allowNull: false,
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

/**
 * Created by xiezongjun on 2016-12-06.
 */

import {getDebugger} from "../util/debug";
import {BaseManager} from "./base";
import {injectable, inject} from "inversify";
import {DataBase} from '../model/index';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
import {HouseAttribute} from '../model/house';
let debug = getDebugger("manager");
import lodash = require('lodash');

export interface IHouseManager {
    save(complex: HouseAttribute);
    save(complexes: HouseAttribute[]);
}

@injectable()
export class HouseManager extends BaseManager<HouseAttribute> implements IHouseManager {
    private database: DataBase;

    public constructor(@inject(SERVICE_IDENTIFIER.DataBase) database: DataBase) {
        super();
        this.database = database;
    }

    public save(attributes: HouseAttribute| HouseAttribute[]) {
        debug("saving house : %s", Array.isArray(attributes) ? "array " + attributes.length : attributes);
        if (!Array.isArray(attributes)) {
            return this.save([attributes]);
        }
        let ids = lodash.map(attributes, 'lj_id');
        // save old records as revision and insert new records
        this.database.house.update({
            type: 'revision'
        }, {
            where: {lj_id: ids}
        }).then(() => {
            this.database.house.bulkCreate(attributes);
        });
    }
}

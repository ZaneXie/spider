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

export interface IHouseManager {
    save(complex: HouseAttribute | HouseAttribute[]);
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
        if (Array.isArray(attributes)) {
            this.database.house.bulkCreate(attributes);
        } else {
            this.database.house.insertOrUpdate(attributes);
        }
    }
}
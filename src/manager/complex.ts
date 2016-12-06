/**
 * Created by xiezj on 2016/12/5.
 */

import {getDebugger} from "../util/debug";
import {BaseManager} from "./base";
import {ComplexAttribute} from "../model/complex";
import {injectable, inject} from "inversify";
import {DataBase} from '../model/index';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("manager");

export interface IComplexManager {
    save(complex: ComplexAttribute | ComplexAttribute[]);
}

@injectable()
export class ComplexManager extends BaseManager<ComplexAttribute> implements IComplexManager {
    private database: DataBase;

    public constructor(@inject(SERVICE_IDENTIFIER.DataBase) database: DataBase) {
        super();
        this.database = database;
    }

    public save(attributes: ComplexAttribute | ComplexAttribute[]) {
        debug("saving complex : %s", Array.isArray(attributes) ? "array " + attributes.length : attributes);
        if (Array.isArray(attributes)) {
            this.database.complex.bulkCreate(attributes);
        } else {
            this.database.complex.insertOrUpdate(attributes);
        }
    }
}

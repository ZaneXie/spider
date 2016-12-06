/**
 * Created by xiezj on 2016/12/5.
 */

import {getDebugger} from "../util/debug";
import {BaseManager} from "./base";
import {ComplexAttribute} from "../model/complex";
import {injectable, inject} from "inversify";
import {DataBase} from '../model/index';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("ComplexManager");

export interface IComplexManager {
    save(complex: ComplexAttribute | ComplexAttribute[]);
}

@injectable()
export class ComplexManager extends BaseManager<ComplexAttribute> {
    private database: DataBase;

    public constructor(@inject(SERVICE_IDENTIFIER.DataBase) database: DataBase) {
        super();
        this.database = database;
    }

    public save(complex: ComplexAttribute | ComplexAttribute[]) {
        //todo
        debug(complex);
        if (Array.isArray(complex)) {
            this.database.complex.bulkCreate(complex);
        } else {
            this.database.complex.insertOrUpdate(complex);
        }
    }
}

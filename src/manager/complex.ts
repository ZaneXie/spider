/**
 * Created by xiezj on 2016/12/5.
 */

import {getDebugger} from "../util/debug";
import {BaseManager} from "./base";
import {ComplexAttribute, ComplexInstance} from "../model/complex";
import {injectable, inject} from "inversify";
import {DataBase} from '../model/index';
import {SERVICE_IDENTIFIER} from '../constants/ioc';
let debug = getDebugger("manager");
import lodash = require('lodash');
import Bluebird = require('bluebird');

export interface IComplexManager {
    save(complex: ComplexAttribute): Bluebird<ComplexInstance[]>;
    save(complexes: ComplexAttribute[]): Bluebird<ComplexInstance[]>;
}

@injectable()
export class ComplexManager extends BaseManager<ComplexAttribute> implements IComplexManager {
    private database: DataBase;

    public constructor(@inject(SERVICE_IDENTIFIER.DataBase) database: DataBase) {
        super();
        this.database = database;
    }

    public save(attributes: ComplexAttribute | ComplexAttribute[]): Bluebird<ComplexInstance[]> {
        debug("saving complex : %s", Array.isArray(attributes) ? "array " + attributes.length : attributes);
        if (!Array.isArray(attributes)) {
            return this.save([attributes]);
        }
        let ids = lodash.map(attributes, 'lj_id');
        // save old records as revision and insert new records
        return this.database.complex.update({
            type: 'revision'
        }, {
            where: {lj_id: ids}
        }).then(() => {
            return this.database.complex.bulkCreate(attributes);
        });
    }
}

/**
 * Created by xiezj on 2016/12/5.
 */

import {getDebugger} from "../util/debug";
import {BaseManager} from "./base";
import {ComplexAttribute} from "../model/complex";
let debug = getDebugger("ComplexManager");

export class ComplexManager extends BaseManager<ComplexAttribute> {
    public constructor() {
        super();
    }

    public save(complex: ComplexAttribute) {
        //todo
        debug(complex);
    }
}

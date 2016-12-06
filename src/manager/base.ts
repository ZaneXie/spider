/**
 * Created by xiezj on 2016/12/5.
 */

import {injectable} from "inversify";

@injectable()
export abstract class BaseManager<T> {
    public constructor() {
    }

    public save(record: T) {
    }
}
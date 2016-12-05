/**
 * Created by xiezj on 2016/12/5.
 */
import {House} from "../model/model";
import {getDebugger} from "../util/debug";

let debug = getDebugger("HouseManager");

export class HouseManager{
    public constructor(){

    }

    public save(house:House){
        //todo
        debug(house);
    }
}
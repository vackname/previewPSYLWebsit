import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

import sys from "./WatchSys";
import ipM from "./ip";
import LBM from "./loadBlance";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    s:sys|undefined;
    ip:ipM|undefined;
    lb:LBM|undefined;
    constructor($tObj:any) {
        this.s = new sys($tObj,$e);
        this.ip = new ipM($tObj,$e);
        this.lb = new LBM($tObj,$e);
    }
};


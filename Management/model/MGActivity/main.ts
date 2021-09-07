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

import mM from "./index";
import pM from "./product";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    main:mM|undefined;
    p:pM|undefined;
    constructor($tObj:any) {
        this.main = new mM($tObj,$e);
        this.p = new pM($tObj,$e);
    }
};


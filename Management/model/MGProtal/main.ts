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

import stModel from "./story";
import dmModel from "./pDM";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    st:stModel|undefined;
    dm:dmModel|undefined;
    constructor($tObj:any) {
        this.st = new stModel($tObj,$e);
        this.dm = new dmModel($tObj,$e);
    }
};


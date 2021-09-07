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

import m from "./index";
import em from "./edit";
import mk from "./markLabel";
import save from "./save";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    main:m|undefined;
    edit:em|undefined;
    mk:mk|undefined;
    s:save|undefined;
    constructor($tObj:any) {
        this.main = new m($tObj,$e);
        this.edit = new em($tObj,$e);
        this.mk = new mk($tObj,$e);
        this.s = new save($tObj,$e);
    }
};


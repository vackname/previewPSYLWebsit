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
import ser from "./serTool";
import set from "./setMenu";
import apM from "./addPoint";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
/** post system panel  打單*/
export default class main{
    main:m|undefined;
    ser:ser|undefined;
    set:set|undefined;
    addPoint:apM|undefined;
    constructor($tObj:any)
    {
        this.main = new m($tObj,$e);
        this.ser = new ser($tObj,$e);
        this.set = new set($tObj,$e);
        this.addPoint = new apM($tObj,$e);

    }
};
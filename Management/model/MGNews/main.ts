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

import c from "./MGClass";
import n from "./edit";
import aed from "./autoedit";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    cl:c|undefined;
    main:n|undefined;
    au:aed|undefined;
    constructor($tObj:any) 
    {
        this.cl = new c($tObj,$e);
        this.main = new n($tObj,$e);
        this.au = new aed($tObj,$e);
    }
};


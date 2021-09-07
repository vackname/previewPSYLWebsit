import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM}  from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

import m from "./index";
import mp from "./MGProductSetPhoto";
import clM from "./MGClass";
import plM from "./publish";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    main:m|undefined;
    mainp:mp|undefined;
    cl:clM|undefined;
    pl:plM|undefined;
    constructor($tObj:any) {
        this.main = new m($tObj,$e);
        this.mainp = new mp($tObj,$e);
        this.cl = new clM($tObj,$e);
        this.pl = new plM($tObj,$e);
    }
};


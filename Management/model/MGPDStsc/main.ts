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
import md from "./MGProductSetDiscount";
import c from "./MGClass";
import p from "./MGPsOption";
import g from "./MGGift";
import aM from "./autock";
import sfM from "./sf";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    main:m|undefined;
    cl:c|undefined;
    pos:p|undefined;
    gt:g|undefined;
    a:aM|undefined;
    mainp:mp|undefined;
    maind:md|undefined;
    sf:sfM|undefined;
    constructor($tObj:any) {
        this.main = new m($tObj,$e);
        this.cl  = new c($tObj,$e);
        this.pos =  new p($tObj,$e);
        this.gt =  new g($tObj,$e);
        this.mainp = new mp($tObj,$e);
        this.maind = new md($tObj,$e);
        this.a = new aM($tObj,$e);
        this.sf = new sfM($tObj,$e);
    }
};


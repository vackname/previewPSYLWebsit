import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import iLoad from "../../../models/importLoad";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
    /** psyl oad system */
    importLoad?:iLoad,
}

import m from "./index";
import a from "./analytics";
import foM from "./fileOs";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj"),importLoad:eval("importLoad"),};
export default class main{
    /**
     * 主要model
     */
    main:m|undefined;
    /**
     * 訂單分析圖
    */
    antc:a|undefined;
    fo:foM|undefined;
    constructor($tObj:any) {
        this.main = new m($tObj,$e);
        this.antc = new a($tObj,$e);
        this.fo = new foM($tObj,$e);
    }
};
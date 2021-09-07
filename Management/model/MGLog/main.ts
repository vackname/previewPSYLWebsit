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

import i from "./index";
import g from "./goto";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    main:i|undefined;
    go:g|undefined;
    constructor($tObj:any) 
    {
        this.main = new i($tObj,$e);
        this.go = new g($tObj,$e);
    }
};


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

import wm from "./watch";//import ex: class model

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    w:wm|undefined;
    constructor($tObj:any) {
        this.w = new wm($tObj,$e);//join model class
    }
};


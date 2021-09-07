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

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    /**
     主要 model
    */
    main:m|undefined;
    constructor($tObj:any) {

        this.main = new m($tObj,$e);//join model class
    }
};


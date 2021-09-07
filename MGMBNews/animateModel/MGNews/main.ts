import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
// 字串過慮 model
import * as charFilter from "../../../JsonInterface/charFilter";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

import em from "./edit";
import tmk from "./takeLabel";
import index from "./index";
import up from "./upload";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    edit:em|undefined;
    km:tmk|undefined;
    main:index|undefined;
    u:up|undefined;
    char = charFilter;
    constructor($tObj:any) {
        this.edit = new em($tObj,$e);
        this.km = new tmk($tObj,$e);
        this.main = new index($tObj,$e);
        this.u = new up($tObj,$e);
    }
};
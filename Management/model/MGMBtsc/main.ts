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

import ma from "./MGMBAccount";
import mb from "./MBList";
import ph from "./MGpayHistory";
import mM from "./index";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    mb:mb | undefined;
    ma:ma | undefined;
    ph:ph | undefined;
    main:mM | undefined;
    constructor($tObj:any) {
        this.mb = new mb($tObj,$e);
        this.ma = new ma($tObj,$e);
        this.ph = new ph($tObj,$e);
        this.main = new mM($tObj,$e);
    }
};


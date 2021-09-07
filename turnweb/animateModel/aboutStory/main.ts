import pbM from "../../../models/pb";
import { jObj as jObjM} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    pb:pbM,
    Jobj?:jObjM,
}

import gm from "./good";
import sm from "./set";
const $e:modelsFormat = {pb:eval("pb"),Jobj:eval("Jobj")};
export default class main{
    g:gm|undefined;
    s:sm
    constructor($tObj:any) {
        this.g = new gm($tObj,$e);
        this.s = new sm($tObj,$e);
    }
};


import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    pb:pbM,
    Jobj?:jObjM,
}

import m from "./index";

const $e:modelsFormat = {pb:eval("pb"),Jobj:eval("Jobj")};
export default class main{
    main:m|undefined;
    constructor($tObj:any) {
        this.main = new m($tObj,$e);
    }
};


﻿import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import { jObj as jObjM} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

import mD from "./index";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    main:mD|undefined;
    constructor($tObj:any) {
        this.main= new mD($tObj,$e);
    }
}


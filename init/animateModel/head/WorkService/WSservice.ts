import pbM from "../../../../models/pb";
import * as jEnum from "../../../../JsonInterface/enum";

import iLoad from "../../../../models/importLoad";
import * as pub from "../../../../JsonInterface/pub";
import webSocket from "../../../../models/WebSocket/interface";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 入口點init project */
let mt:pub.mainTemp;
/** psyl oad system */
let importLoad:iLoad;

/** 推播 WEB Push */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        importLoad = $eObj.importLoad;
    }

}
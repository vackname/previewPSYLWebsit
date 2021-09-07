/** Qrcode model */
import QRCodeM from "../../../models/qrcode/interface";

import * as pub from "../../../JsonInterface/pub";
import * as jEnum from "../../../JsonInterface/enum";

import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import *  as mbeditPE from "./pubExtendCtr";

/** temp this */
let $t:mbeditPE.mbditTemp;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** login */
let Login:pub.Login;
/** 會員QR token /支付/充值*/
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
        mt = $tObj.mainTemp;
        main = $tObj.main;
        Login = (mt.$m.h.Login as pub.Login);
    }


    /** Account cookie token create qr Code */
    getQurCode=()=>
    {
        pb.v($t,"QRVue").async((ev)=>
        {
            Login((x)=>x.post("/ma/mg/mbinfo/mbidtoken").input({uid:$t.mainTemp.head.mbdata.uid}),(e1:any)=>
            {
                if(e1.error == jEnum.Enum_SystemErrorCode.Null)
                {
                    if(ev.QRSrc !=null)
                    {
                        (ev.QRSrc as QRCodeM).clear();
                    }
                    else
                    {
                        ev.QRSrc = new (eval("QRCode") as QRCodeM)(pb.el.id("mbeditqr").get,{
                            colorDark : "#006241",
                            width:200,
                            height:200,
                            correctLevel:(eval("QRCode") as QRCodeM).CorrectLevel.L
                        });
                    }
                    (ev.QRSrc as QRCodeM).makeCode(e1.token);//生成QR
                }
                else{
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
            });
        });

    }
}
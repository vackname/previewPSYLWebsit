﻿import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
/** Qrcode model */
import QRCodeM from "../../../models/qrcode/interface";
import * as pub from "../../../JsonInterface/pub";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** 商品圖片 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
    }

    /** create qr Code */
    getQurCode=(val:pub.productCar)=>
    {
        if(val.QR==null)
        {
            let qr:QRCodeM = new (eval("QRCode") as QRCodeM)(pb.el.id("pcqr"+val.key).get,{
                width:200,
                height:200,
            });
            qr.makeCode($t.$m.main.getUrl(val));
            val.QR = qr;
        }
    }

  /** 圖片匹次載入動畫
   * @param count 20秒後不在等候動畫
   */
   loadImg = (key:string,count:number)=>
   {
       let _this:model=this;
       if(pb.el.id(key).exist)
       {
           pb.el.id(key)
           .animate({"duration":1,"delay":0,"count":1},
           {//img漸顯動畫
               "0%":{"opacity": "0.1"},
               "100%":{"opacity": "1"},
           }).remove();//移除動畫
       }
       else
       {
           setTimeout(()=>{
               count--;
               _this.loadImg(key,count);
           },20);
       }
   }
};
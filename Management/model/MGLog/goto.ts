import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 前往專案功能 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }
    /** 前往Member審核資料檢閱
     * @param log
     */
     private gotoMB =(log:jDB.LogCk)=>
    {
        mt.$m.h.MG.gourlMBMG();
        pb.v($t.main$m,"MgMb").async((toObj)=>
        {
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            toObj.InputSer = log.id;//關鍵字(帳戶)
            toObj.appckser = "0";//一般搜尋
            setTimeout(()=>
            {
                toObj.$m.mb.MBList(true);
            },300);
        });
    }

    /** 前往會員Pay歷史明細 審核資料檢閱
     * @param log
     */
     private gotoPay =(log:jDB.LogCk)=>
    {
        let uid:string = log.log.split("target:")[1].split(',')[0];
        mt.$m.h.MG.gourlMBMG();
        pb.v($t.main$m,"MgMb").async((toObj)=>
        {
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            toObj.InputSer = uid;//關鍵字(帳戶之uid)
            toObj.appckser = "0";//一般搜尋
            setTimeout(()=>
            {
                toObj.$m.mb.MBList(true,(mb:jDB.Member)=>
                {
                    setTimeout(()=>
                    {
                        toObj.$m.ph.payhistory(mb,true,log.id);//log.id 訂單號
                    },300);
                });
            });
        });
    }

    /** 前往採踩地方審核資料檢閱
     * @param log
     */
     private gotoNewscc =(log:jDB.LogCk)=>
    {
        mt.$m.h.MG.gourlNewsMGcc();
        pb.v($t.main$m,"MgNewscc").async((toObj)=>{
            toObj.showView="editvue";
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            pb.v(toObj,"toolvue").async((obj)=>
            {
                obj.selfclassmain="333";//顯示類別
                obj.selfclass="999";//顯示細項
                obj.InputSer=log.id;//搜尋關鍵字-文章key
                setTimeout(()=>
                {
                    toObj.$m.main.serData(true);
                },300);
            });
        });
    }

    /** 前往採踩地方 自動審核-審核資料檢閱
     * @param log
     */
     private gotoNewsccAuto =(log:jDB.LogCk)=>
    {
        mt.$m.h.MG.gourlNewsMGcc();
        pb.v($t.main$m,"MgNewscc").async((toObj)=>{
            toObj.showView="autoeditvue";
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            pb.v(toObj, "autoeditvue").async((e:any)=>{
                e.InputSer = log.id;//會員帳戶 
                setTimeout(()=>
                {
                    toObj.$m.au.MBList(true);
                });
            });
        });
    }

   /** 前往商品 審核資料檢閱
     * @param log
     */
    private gotoProduct=(log:jDB.LogCk)=>
    {
        mt.$m.h.MG.gourlMGProduct();
        pb.v($t.main$m,"MgPs").async((toObj)=>
        {
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            toObj.pdType ="product";//開起商品設定頁
            toObj.InputSer=log.id;
            toObj.InputType="999";
            toObj.selfclassmain="333";
            toObj.selfclass="999";
            toObj.InputClass="999";
            setTimeout(()=>
            {
                toObj.$m.main.productListSer(true);
            },300);
        });
    }

       /** 前往商品運費 審核資料檢閱
     * @param log
     */
        private gotoProductShfee=(log:jDB.LogCk)=>
        {
            mt.$m.h.MG.gourlMGProduct();
            pb.v($t.main$m,"MgPs").async((toObj)=>
            {
                $t.main$m.turnLog = true;//顯示反回Log審核鈕
                toObj.pdType ="sf";//開起商品設定頁
                pb.v(toObj,"sfView").async((e)=>{
                    setTimeout(()=>
                    {
                        e.ser = log.id;
                        toObj.$m.sf.ser();
                    },300);
                });
            });
        }

    /** 前往活動報名設定審核資料檢閱
     * @param log
     */
     private gotoAC =(log:jDB.LogCk)=>
    {
        mt.$m.h.MG.gourlMgAc();
        pb.v($t.main$m,"MgAc").async((toObj)=>{
            $t.main$m.turnLog = true;//顯示反回Log審核鈕
            toObj.ser = log.id;
            setTimeout(()=>
            {
                toObj.$m.main.serData(true);//搜尋
            },300);
        });
    }

    /**
     * 前往Page
     * @param log
    */
     gotoPage = (val:jDB.LogCk)=>
     {
         //取得現在需定位畫面位置
        $t.scrolltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        switch(val.tb)
        {
            case jEnum.Enum_logDocTB.Member:
                self.gotoMB(val);
                break;
            case jEnum.Enum_logDocTB.NewsL:
                self.gotoNewscc(val);
                break;
            case jEnum.Enum_logDocTB.AutoLCK:
                 self.gotoNewsccAuto(val);
                 break;
            case jEnum.Enum_logDocTB.Product:
                self.gotoProduct(val);
                break;
            case jEnum.Enum_logDocTB.payRecord:
                self.gotoPay(val);
                break;
            case jEnum.Enum_logDocTB.Activity:
                self.gotoAC(val);
                break
            case jEnum.Enum_logDocTB.sff:
                self.gotoProductShfee(val);
                break
        }
    }
}
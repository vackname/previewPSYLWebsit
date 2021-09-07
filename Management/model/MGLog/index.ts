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
/** main */
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

    /**  會員 異動審核通過鈕
     * @param log
    */
   private MBappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>會員("+log.id+")",()=>
        {
            self.appckReturn(log,"/ma/mg/sys/mbappck");
        },null);
    };

    /**  會員身份申請異動 異動審核通過鈕
     * @param log
    */
   private MBApplyAppeck = (log:jDB.LogCk)=>
   {
        mt.viewConfirm("是否確認異動審核通過？<br/>會員("+log.id+")",()=>
        {
            self.appckReturn(log,"/ma/mg/sys/applymbappck");
        },null);
    };

    /** 採踩新聞審核不通過 */
    private NewsLCancel= (log:jDB.LogCk)=>
    {
        mt.ViewConfirmInput("是否確認異動審核取消？<br/>採踩("+log.id+")",(mark)=>
        {
            self.appckReturn(log,"/nscc/mg/sys/appcancel",mark);
        },null);
    };

    /**  會員身份申請異動 異動審核取消鈕
     * @param log
    */
    private MBApplyAppeNot = (log:jDB.LogCk)=>
    {
        mt.ViewConfirmInput("是否確認異動審核取消？<br/>會員("+log.id+")",(mark)=>
        {
            self.appckReturn(log,"/ma/mg/sys/applymbappnot",mark);
        },null);
    };

    /** 採踩地方 異動審核通過鈕
     * @param log
    */
     private Newsccappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>採踩地方("+log.id+")",()=>
        {
            self.appckReturn(log,"/nscc/mg/sys/appcknews");
        },()=>{//取消資格
            setTimeout(()=>{
                self.appNot(log);
            },300);
        });
    };

    /** 採踩地方 自動審核 異動審核通過鈕
     * @param log
    */
     private NewsccAutoappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>採踩地方-自動審核("+log.id+")",()=>
        {
            self.appckReturn(log,"/nscc/mg/sys/appckauto");
        },()=>{
            self.appNot(log);
        });
    };

    /** 商品 異動審核通過鈕
     * @param log
    */
    private Productappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>商品("+log.id+")",()=>
        {
            self.appckReturn(log,"/pc/mg/sys/productappck");
        },null);
    };

    /** 票據 異動審核通過鈕
     * @param log
    */
    private payRecordappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>票據-自動審核("+log.id+")",()=>
        {
            self.appckReturn(log,"/mpay/mg/sys/appckpayrecord");
        },null);
    };

    /** 報名活動 異動審核通過鈕
     * @param log
    */
    private Activityappeck = (log:jDB.LogCk)=>{
        mt.viewConfirm("是否確認異動審核通過？<br/>伴空間活動-報名("+log.id+")",()=>
        {
            self.appckReturn(log,"/ac/mg/sys/appck");
        },null);
    };

    /** 發送審核
     * @param mark 回填訊息
    */
    private appckReturn (log:jDB.LogCk,url:string,mark?:string)
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>
        {
            if(he.load==0)
            {
                let toObj:any = {key:log.key};
                if(mark!=null && mark!=undefined)
                {
                    pb.AddPrototype(toObj,{"mark":mark});//共用規訊息返回
                }
                
                Login((x)=>x.post(url).input(toObj),(e:any)=>{
                    if(Number(e.error)==jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 資訊update */
                        let dbObj:jDB.LogCk=e.data;
                        log.mbid = dbObj.mbid;
                        log.tag = dbObj.tag;
                        log.ckdate = dbObj.ckdate;

                        /** 重建 */
                        let newData:Array<jDB.LogCk> = [e.newdata];
                        ($t.datalist as Array<jDB.LogCk>).forEach((val,nu)=>{
                            (e.del as Array<string>).forEach((val2,nu)=>{
                                if(val.key==val2)
                                {//被排除log
                                    val.del = false;
                                }
                            });

                            newData.push(val);
                        });
                        $t.datalist = newData;
                    }
                    else if(Number(e.error)==jEnum.Enum_SystemErrorCode.ExistData)
                    {
                        mt.viewAlert("已設定任務(請重新整理資訊)！");
                    }
                    else{
                        mt.viewAlert("權限設定失敗！");
                    }
                });
            }
        });
    }

    /**
     * 審核異動-通過
     * @param log
    */
    appCk = (val:jDB.LogCk)=>{
        switch(val.tb)
        {
            case jEnum.Enum_logDocTB.Member:
                self.MBappeck(val);
                break;
            case jEnum.Enum_logDocTB.NewsL:
                self.Newsccappeck(val);
                break;
            case jEnum.Enum_logDocTB.AutoLCK:
                self.NewsccAutoappeck(val);
                break;
            case jEnum.Enum_logDocTB.Product:
                self.Productappeck(val);
                break;
            case jEnum.Enum_logDocTB.payRecord:
                self.payRecordappeck(val);
                break;
            case jEnum.Enum_logDocTB.Activity:
                    self.Activityappeck(val);
                break;
            case jEnum.Enum_logDocTB.MemberApply:
                self.MBApplyAppeck(val);
            break;
        }
    }

    /**
     * 審核異動取消資格(僅tb 為負數)
     * @param log
    */
    appNot = (val:jDB.LogCk)=>{
        switch(val.tb)
        {
            case jEnum.Enum_logDocTB.MemberApply:
                self.MBApplyAppeNot(val);
            break;
            case jEnum.Enum_logDocTB.NewsL:
                self.NewsLCancel(val);
            break;
        }
    }

    /** 使用權限時間單位-pay商品 */
    getData = (init:boolean)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                Login((x)=>x.post("/ma/mg/sys/loglist").input({ser:$t.ser,pagetime:(($t.datalist.length>0 && !init)?$t.datalist[$t.datalist.length-1].date:0),ck:$t.ck}),(e:any)=>{
                    if(Number(e.error)==jEnum.Enum_SystemErrorCode.Null)
                    {
                        if(init)
                        {//初始化
                            $t.datalist=e.data;
                        }
                        else
                        {
                            (e.data as Array<jDB.LogCk>).forEach((val,nu)=>
                            {
                                let inset:boolean=true;
                                ($t.datalist as Array<jDB.LogCk>).forEach((val2,nu2)=>
                                {
                                    if(val2.key==val.key)
                                    {
                                        inset=false;
                                    }
                                });
                                if(inset)
                                {
                                    $t.datalist.push(val);
                                }
                            });
                        }
                    }else{
                        
                        mt.viewAlert("伺服器忙錄中！");
                    }
                });
            }
        });
    };
};


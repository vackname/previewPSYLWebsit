import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** example model item1 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /**
     * 取得單據狀態mark
     */
    documentType = ()=>
    {
        $t.statusfilter = pub.payStatusCT();
        $t.typefilter = pub.payTypeCT();
    };

    /**
     *  前往歷史訂單編號結帳頁面明細
     */
    checkOut = (val:jDB.payRecord)=>
    {
        pb.v($t,"checkoutView").async((ec:any)=>
        {
            ec.list = [];
            ec.checkOutDocument={//單據框架
                display:1,
                amount: 0,
                cash: 0,
                date: 0,
                fee: 0,
                key: "",
                mark: "",
                status: jEnum.Enum_payStatus.create,
                type: jEnum.Enum_payType.store,
            } as jDB.payRecord;//初始化

            ec.close = ()=>
            {//關閉結帳頁
                $t.openCheckOut = false;
            }

            pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
                if(e.load==0)
                {
                    Login((x)=>x.post("/mpay/psys/pay/historydetail").input({key:val.key}),(e2:any)=>
                    {
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            $t.openCheckOut = true;
                            e2.data.forEach((val2:any,nu2:number)=>
                            {
                                if(val2.set)
                                {//套餐base64 to json解析
                                    val2.sdata = JSON.parse(pb.Base64ToUTF8(val2.sdata));
                                }
                                else
                                {//非套餐則建立object
                                    val2.sdata = {old:[],del:[],add:[]} as pE.pSetFormat;
                                }
                            });
                            ec.list = e2.data;
                            ec.checkOutDocument = val;
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        
                    });
                }
            });
        });
    }

    /**
     * 歷史訂單搜尋
     * @param init 初始化
     */
    serFun = (init:boolean)=>
    {
        pb.v($t, "pagetool").async((ePage:pub.pageTool)=>{//Page Number bar
            pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
                if(e.load==0)
                {//防連點
                    if(init)
                    {//初始化
                        $t.list = [];//清空
                        $t.pageTagetNu = 0;
                        ePage.pageNu = 0;
                    }
                    
                    Login((x)=>x.post("/mpay/psys/pay/history").input($t.ctr).input({page:ePage.pageNu}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            ePage.runAction = ()=>{
                                self.serFun(false); 
                            };

                           $t.pageTagetNu=ePage.pageNu;//取得當前頁碼 flag
                           $t.list=e2.data as Array<jDB.payRecord>;
                           ePage.pageCount = e2.pageCount;
                        }
                        else
                        {
                            ePage.pageNu = $t.pageTagetNu;
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        
                    });
                }
                else
                {//回復選頁
                    ePage.pageNu = $t.pageTagetNu;
                }
            });
        });
    };

     /**
     * 取消立單
     * @param obj 單據 object
     */
    cancelFPay=(obj:jDB.payRecord)=>
    {
        mt.viewConfirm($t.getLang('error').cancelFrom,()=>{
            Login((x)=>x.post("/mpay/psys/pay/paydisplay").input({key:obj.key,uid:obj.uid}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            obj.display = e2.display;
                            obj.mark = e2.mark;
                            sessionStorage.setItem("postDocument", JSON.stringify(obj));//結帳頁資訊回復紀錄
                        }
                        else if(Number(e2.error) == jEnum.Enum_SystemErrorCode.limit)
                        {//無權限取消
                            mt.viewAlert($t.getLang("error").notcancel);
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        
                    });
            },null);
    }
};


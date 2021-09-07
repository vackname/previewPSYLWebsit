import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** post 選入商品 */
export interface poPostCtr extends jDB.PayOptions
{
    /** 套餐項目設定 object pE.pSetFormat to string json*/
    setdata:string,
}

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
/** 主要(結帳) */
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
     * 打單
     * @param val 商品資料
     * @param nu 商品 list indexOf nu
     * @param add true=增加 count(商品數)
     */
    chooseProduct=(val:pE.poCtr,nu:number,add:boolean)=>
    {
        $t.itemAddName = val.nameAry;//動畫提示名
        /** 是否已create */
        let exist:Boolean=false;
        $t.pObj().chooseList.forEach((val2:pE.poCtr,nu2:number)=>
        {
            if(val2.pkey==val.key)
            {
                exist=true;
                if(add)
                {//增加
                    $t.$an.pay("productname"+nu,false);
                    $t.nowNu = nu2;
                    val2.count++;
                }
                else
                {//減少
                    val2.count--;
                    if(val2.count>0)
                    {
                        $t.nowNu = nu2;
                    }
                    else
                    {//刪除無需顯示黃球
                        $t.nowNu = -1;
                    }
                    $t.$an.pay("productnameMenu"+nu,val2.count==0,function(){
                        //無數量自動移除
                        $t.pObj().chooseList.splice(nu2,1);
                        if($t.pObj().chooseList.length==0)
                        {//如Item 為0則推回選單,如為套餐加購堆回 準備結帳頁
                            
                            $t.stepPanel = (($t.stepPanel==4)?1:0);
                        }

                        if($t.pObj().chooseList.length==0)
                        {//無list擇不顯示 payMenuView
                            pb.v($t,"payMenuView").async((e:any)=>
                            {
                                e.open=false;
                            });
                        }

                    });
                }
            }
        });

        if(!exist)
        {//create

            $t.$an.pay("productname"+nu);
            $t.pObj().chooseList.push({pkey:val.key,count:1,nameAry:val.nameAry,unitAry:val.unitAry,cash:val.cash,
                set:val.set,
                fee:val.fee,
                allowances:0,
                discount:1,
                gifts:false,
                sfee:0,
                discountAry:val.discountAry,//折數資訊暫存
                setdata:{add:[],del:[],old:[]} as pE.pSetFormat,
            } as pE.poCtr); 
            $t.nowNu = $t.pObj().chooseList.length-1;
        }
    
        setTimeout(()=>
        {//延遲暫存已選 項目
            sessionStorage.setItem("postProduct", JSON.stringify($t.product.chooseList));
        },300);
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

      /**
     *  前往歷史訂單編號結帳頁面明細(step 回復)
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
            {
              //結帳頁關閉
              $t.stepPanel = 0;
              $t.nowNu = -1;
              $t.product.chooseList = [] as Array<pE.poCtr>;
              //移除暫存
              sessionStorage.removeItem("poststepPanel");
              sessionStorage.removeItem("postDocument");
              sessionStorage.removeItem("postProduct");
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

    /** 商品立單 list */
    pay=()=>
    {
        if($t.product.chooseList.length>0)
        {//結帳找零
            pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
                if($t.cash-$t.sum()>=0)
                {
                    if(!e.load)
                    {
                        /** 送單集合 */
                        let option:Array<poPostCtr> =[];
                        $t.product.chooseList.forEach((val:pE.poCtr,nu:number)=>
                        {//重組清單
                            /** set 修改清單-add */
                            let add:Array<Array<jDB.payItem>> = [];
                            /** set 修改清單-del */
                            let del:Array<Array<jDB.payItem>>  = [];
                            val.setdata.add.forEach((val2:Array<jDB.payItem>,nu2:number)=>
                            {//減化資料量清單
                                let getJson:Array<jDB.payItem> = [];
                                val2.forEach((val3:jDB.payItem,nu3:number)=>{
                                    getJson.push({key:val3.key,count:val3.count} as jDB.payItem);
                                });
                                add.push(getJson);
                            });

                            val.setdata.del.forEach((val2:Array<jDB.payItem>,nu2:number)=>
                            {//減化資料量清單
                                let getJson:Array<jDB.payItem> = [];
                                val2.forEach((val3:jDB.payItem,nu3:number)=>{
                                    getJson.push({key:val3.key,count:val3.count} as jDB.payItem);
                                });
                                del.push(getJson);
                            });
                            option.push({pkey:val.pkey,count:val.count, allowances:val.allowances,gifts:val.gifts,setdata:JSON.stringify({add:add,del:del} as pE.pSetFormat)  as string} as poPostCtr);
                        });

                        setTimeout(()=>{
                            $t.$an.loadCheckout();//load 動畫
                        },70);
                        Login((x)=>x.post("/mpay/psys/pay/from").input({"payoption":JSON.stringify(option),cash:$t.cash}),(e2:any)=>
                            {
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    $t.stepPanel = 3;//前往結帳頁
                                    e2.payoption.forEach((val2:any,nu2:number)=>
                                    {
                                        val2["discountAry"] = [];//重建空值 折框架
                                        if(val2.set)
                                        {//套餐base64 to json解析
                                            val2.sdata = JSON.parse(pb.Base64ToUTF8(val2.sdata));
                                        }
                                        else
                                        {//非套餐則建立object
                                            val2.sdata = {old:[],del:[],add:[]};
                                        }
                                    });

                                    pb.v($t,"checkoutView").async((e3:any)=>
                                    {
                                        e3.checkOutDocument = null;
                                        e3.checkOutDocument =  e2.data as jDB.payRecord;
                                        e3.list = [] as Array<jDB.PayOptions>;;
                                        e3.list = e2.payoption as Array<jDB.PayOptions>;
                                        e3.close = ()=>
                                        {//結帳頁關閉
                                            $t.stepPanel = 0;
                                            $t.nowNu = -1;
                                            $t.product.chooseList = [] as Array<pE.poCtr>;
                                            //移除暫存
                                            sessionStorage.removeItem("poststepPanel");
                                            sessionStorage.removeItem("postDocument");
                                            sessionStorage.removeItem("postProduct");
                                        }
                                        //延遲暫存項目
                                        sessionStorage.setItem("poststepPanel", "3");//等候結帳 step
                                        sessionStorage.setItem("postDocument", JSON.stringify(e3.checkOutDocument));//結帳頁資訊回復紀錄
                                        sessionStorage.setItem("postProduct", JSON.stringify(e2.payoption));//打單回復記錄
                                    });
                                }
                                else if(Number(e2.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                                {//限制異常
                                    /** 庫存限制 */
                                    let countLimit:Array<string>=[];
                                    if(e2.datacount!=undefined)
                                    {
                                        e2.datacount.forEach((val:any,nu:number)=>{
                                            countLimit.push(($t.main as pub.main).pub.catchLangName(val.nameAry));
                                        });
                                    }

                                    /** 狀態限制 */
                                    let typeLimit:Array<string>=[];
                                    if(e2.typeLimit!=undefined)
                                    {
                                        e2.datatype.forEach((val:any,nu:number)=>{
                                            typeLimit.push(($t.main as pub.main).pub.catchLangName(val.nameAry));
                                        });
                                    }
                                    
                                    if(countLimit.length>0 || typeLimit.length>0){
                                        //失敗 alert
                                        mt.viewAlert($t.getLang('error').fail+"!!<br/>"+((countLimit.length>0)?$t.getLang('error').iq+":"+countLimit.join(','):'')+((typeLimit.length>0)?"<br/>"+$t.getLang('error').enablePD+":"+typeLimit.join(','):''));
                                    }
                                    else
                                    {//未知權限制錯誤
                                        mt.viewAlert($t.getLang('error').fail+"!!(code:"+e2.error+")");
                                    }
                                }
                                else
                                {
                                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                                }
                                $t.cash=0;
                            });
                    }
                }
                else
                {//未收現 aert
                    mt.viewAlert($t.getLang('error').uncash);
                }
            });
        }
    };
};
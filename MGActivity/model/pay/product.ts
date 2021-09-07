import pbM from "../../../models/pb";

import * as pE from "../pubExtendCtr";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";


/** temp this */
let $t:any | undefined;
/** load file  */
let Jobj:jObjM;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** 加購商品 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
        main = $t.main;
    }

    /** 總額運算 */
    private sumToF = (data:Array<pub.productCar>)=>
    {
        $t.sumProductCash = 0;
        $t.sumfee = 0;
        data.forEach((val,nu)=>{
            $t.sumProductCash += val.count * val.cash*((val.discount==0)?1:val.discount);//總額計算
            $t.sumfee += val.count * val.fee;
        });

        let objGet:pE.acCtr = $t.data;//重新計算運費
        if(!objGet.adrnow)
        {
            let getData =  pub.adrFeeSum(objGet.pdataAry,$t.getAdrfeeList,$t.sumProductCash);
            $t.getShFormat =getData.foramt;
            $t.shFee = getData.fee;
        }
        else
        {
            $t.getShFormat = "";
            $t.shFee = 0;
        }
    }

    /** 新增商品 */
    increase=(obj:pub.productCar)=>{
        if(obj.count<obj.countLimit || obj.countLimit==0){
            obj.count++;
        }
        self.sumToF($t.data.pdataAry);
    }

    /** 減少商品 */
    decrease=(obj:pub.productCar)=>{

        if(obj.count>0){
            obj.count--;
        }
        self.sumToF($t.data.pdataAry);
    }

    /** 取當前時間折扣 */
    discountFun=(val:pub.productCar)=>
    {//目前折數即時(顯示 us)
        var discount=1;
        if(val.discountAry.length>0)
        {
            var nowTime = pb.unixReNow();
            val.discountAry.forEach((val2,nu2)=>
            {
                if(discount>val2.discount
                    && val2.end >= nowTime && val2.start <= nowTime
                    )
                {//選擇最小折數
                    discount=val2.discount;
                }
            });
        }
        val.discount = discount;
    }

    /** 加購商品(preview) */
    PrivewProduct=()=>
    {
        let acobj:pE.acCtr = $t.data;
        if(acobj.pAry.length>0)
        {
            Login(x=>x.post("/pc/pcar/mg/productchoose").input({ary:JSON.stringify(acobj.pAry)}),(obj)=>{
                if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                {
                        acobj.pdataAry = [];
                        /** 取圖片 名 */
                        let geImgList:Array<string> = [];
                        (obj.data as Array<pub.productCar>).forEach((val,nu)=>
                        {
                            val.count=0;
                            val.error=false;
                            val.errorCount=false;
                            val.discount = 1;
                            /** 折數 array 暫存 注入 */
                            let discountAry:Array<jDB.ProductDiscount> = [];
                            obj.discount.forEach((val2:jDB.ProductDiscount,nu2:Number)=>
                            {//找尋目前適合折數
                                if(val2.pkey==val.key)
                                {
                                    discountAry.push(val2);
                                }

                            });
                            val["discountAry"] = discountAry;

                            if(val.imgAry.length>0)
                            {
                                geImgList.push(val.imgAry[0]);
                            }
                            
                        });

                        (acobj.productImg as jObjM)//緩儲圖片容器
                        .loadimgjson("/pc/igpt")//載入圖片
                        .input(geImgList)
                        .async((e3,next3)=>
                        { 
                            e3.forEach((val3,nu3)=>
                            {
                                (obj.data as Array<pub.productCar>).forEach((val,nu)=>
                                {
                                    if(val.imgAry.length>0)
                                    {
                                        if(val3==val.imgAry[0])
                                        {
                                            acobj.pdataAry.forEach((val1,nu1)=>
                                            {
                                                if(val.key==val1.key)
                                                {
                                                    val1.imgAry = [val3];
                                                    $t.$an.loadImg('payactpcPrviewDatali'+val.key,1000);//動畫
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                            /** 匹次載圖 */
                            let reNext = (re:(fun:nextImgLoad)=>void)=>
                            {       
                                //圖片載入完成 imglist
                                if(re!=null)
                                {
                                    re((e4,next4)=>
                                    {
                                        e4.forEach((val3,nu3)=>{
                                            (obj.data as Array<pub.productCar>).forEach((val,nu)=>
                                            {
                                                if(val.imgAry.length>0)
                                                {
                                                    if(val3==val.imgAry[0])
                                                    {
                                                        acobj.pdataAry.forEach((val1,nu1)=>
                                                        {
                                                            if(val.key==val1.key)
                                                            {
                                                                val1.imgAry = [val3];
                                                                $t.$an.loadImg('payactpcPrviewDatali'+val.key,1000);//動畫
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                        reNext(next4);
                                    });
                                }
                            }
                            reNext(next3);
                        });

                        acobj.pAry.forEach((val,nu)=>{//排序位置
                            (obj.data as Array<pub.productCar>).forEach((val1,nu1)=>{
                                if(val1.key==val)
                                {
                                    acobj.pdataAry.push(val1);
                                }
                            });
                        });
                        self.sumToF(acobj.pdataAry);
                }
                else
                {
                    $t.viewAlert($t.main.pub.config.get("error").svbusy);
                }
                
            });
        }
    };
    
}
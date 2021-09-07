import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;

/** 主要 商品dtail */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /**補語系位置 */
    private addIndexOfLang=(obj:Array<string>)=>{
        for(let a=obj.length;a<($t.main as pub.main).pub.langAry.length;a++)
        {
            obj.push("");
        }
    };

    /** 取出網址 */
    getUrl=(val:pub.productCar)=>window.location.protocol.split(':')[0]+"://"+window.location.host+"/u/"+jEnum.Enum_docType.pcar+"/"+val.key;


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

    /* add購物車商品 */
    getProductCar=(obj:pub.productCar)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            mt.$m.h.pc.getProductCar({key:obj.key,count:1},obj.countLimit);//head add 購物車
            e.productCar.forEach((val,nu)=>
            {
                if(val.key==obj.key)
                {//同步商城 商品
                    pb.v($t.pj,"productTemp").async(e2=>
                    {//同步商城陣列
                        (e2.dataList as Array<pub.productCar>).forEach((val1,nu1)=>{
                            if(val.key==val1.key)
                            {
                                val1.ck = true;
                                val1.count = val.count;
                            }
                        });
                    });
                    obj.ck = true;
                    obj.count = val.count;
                }
            });
        });
    };

    /**
     * 載入商品描述
    */
    productDoc = ()=>
    {
        Login(x => x.post("/pc/pb/product/doc").input({key:$t.pj.key,nu:($t.main as pub.main).pub.langNu}),
        (obj:any)=>
        {
            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 載入之商品 */
               let getObj:pub.productCar =$t.data;
                getObj.QR = null;
                this.addIndexOfLang(getObj.descriptionAry);
                getObj.descriptionAry[($t.main as pub.main).pub.langNu] = obj.data;
                let getNewAry:Array<string> = [];
                getObj.descriptionAry.forEach((val,nu)=>
                {
                    getNewAry.push(val);
                });
                getObj.descriptionAry = getNewAry;
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            
        });
    };

    /** 載入圖片/商品描述 */
    productLoadImg =()=>
    {
        Login(x => x.post("/pc/pb/product/img").input({key:$t.pj.key}),
        (obj:any)=>
        {
            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                
                /** 載入之商品 */
                let getObj:pub.productCar=$t.data;
                getObj.imgAry = obj.data;//放入所有圖層
                getObj.QR = null;
                getObj.objImg = new (Jobj as any)();
                getObj.objImg//緩儲圖片容器
                .loadimgjson("/pc/igpt/"+getObj.key)//載入圖片
                .input(getObj.imgAry)
                .async((e3,next3)=>
                { 
                    e3.forEach((val3,nu3)=>{
                        $t.$an.main.loadImg("pDetailToPhoto"+getObj.key,1000);//動畫
                    });
                    self.productDoc();
                    /** 匹次載圖 */
                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                    {       
                        /** 重建圖層更新 get set */
                        let reImgAry:Array<string> = [];
                        getObj.imgAry.forEach((val3,nu2)=>{
                            reImgAry.push(val3);
                        });
                        getObj.imgAry = reImgAry;
                        //圖片載入完成 imglist
                        if(re!=null)
                        {
                            re((e4,next4)=>
                            {
                                reNext(next4);
                            });
                        }
                    }
                    reNext(next3);
                });
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            
        });
    }

    /**
     * 載入商品名細
    */
    productLoad = ()=>
    {
        Login(x => x.post("/pc/pb/product/read").input({key:$t.pj.key}),
        (e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 載入之商品 */
               let getObj:pub.productCar=e.data;
               getObj.langLoad =[];
               self.addIndexOfLang(getObj.descriptionAry);
               getObj.QR = null;
                getObj.objImg = new (Jobj as any)();
                getObj.objImg//緩儲圖片容器
                .loadimgjson("/pc/igpt/"+getObj.key)//載入圖片
                .input(getObj.imgAry)
                .async((e3,next3)=>
                { 
                    e3.forEach((val3,nu3)=>{
                        $t.$an.main.loadImg("pDetailToPhoto"+getObj.key,1000);//動畫
                    });
                    self.productDoc();
                    /** 匹次載圖 */
                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                    {       
                        /** 重建圖層更新 get set */
                        let reImgAry:Array<string> = [];
                        getObj.imgAry.forEach((val3,nu2)=>{
                            reImgAry.push(val3);
                        });
                        getObj.imgAry = reImgAry;
                        //圖片載入完成 imglist
                        if(re!=null)
                        {
                            re((e4,next4)=>
                            {
                                /** 重建圖層更新 get set */
                                let reImgAry:Array<string> = [];
                                getObj.imgAry.forEach((val3,nu2)=>{
                                    reImgAry.push(val3);
                                });
                                getObj.imgAry = reImgAry;
                                reNext(next4);
                            });
                        }
                    }
                    reNext(next3);
                });

                /** 折數 array 暫存 注入 */
                let discountAry:Array<jDB.ProductDiscount> = [];
                e.discount.forEach((val2:jDB.ProductDiscount,nu2:Number)=>
                {//找尋目前適合折數
                    if(val2.pkey==getObj.key)
                    {
                        discountAry.push(val2);
                    }

                });
                getObj["discountAry"] = discountAry;
                pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                    getObj.ck = false;
                    getObj.count = 0;
                    he.productCar.forEach(function(val2,nu2){//同步購物車
                        if(val2.key==getObj.key){
                            getObj.ck = true;
                            getObj.count = val2.count;
                        }
                    });
                    $t.data = getObj;
                    self.productDoc();
                });
            }
            else
            {
                if($t.pj.OutInto || mt.gotoTagBag)
                {//透過 tag 進入
                    $t.returnList();
                    mt.viewAlert( $t.main.pub.config.get("error").stopdoc,()=>{},$t.main.pub.lib.src('mbOff.png'));
                }
                else
                {
                    mt.viewAlert($t.main.pub.config.get("error").svbusy);
                }
            }
        });
    };
}
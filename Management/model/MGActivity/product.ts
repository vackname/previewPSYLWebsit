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

    /**
     * 新增標籤
     * @param key 路徑
     * @param tp doctype enum
     * @param title 標籤名
     */
    insertBt=(key:string,tp:number,title:string)=>
    {
        pb.v($t,"takLabelvue").async(tl$t=>
        {
            /** 標籤名 */
            let nameAry:Array<string> = [((title.replace(/ /g,'')!='')?title:"Label Name")];
            for(let a=1;a< main.pub.langAry.length;a++)
            {
                nameAry.push("Label Name");//補語系位置
            }
            
            tl$t.insertFun({tp:tp,path:key,nameAry:nameAry,
                update:true,
                show:false,
                content:null} as pub.markPathCtr);
            tl$t.close();
        });
    }

    /** 新增加購商品
     * @param key 商品key
     */
     insert =(ac:pE.acCtr,mark:pub.markPathCtr)=>
     {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                Login((x)=>x.post("/ac/mg/doc/pinsert")
                .input({key:ac.key,pkey:mark.path}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        ac.pAry = e.data;
                        self.productLoad(ac,mark.path);
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
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

    /**
     * 載入商品名細
    */
    private productLoad = (ac:pE.acCtr,key:string)=>
    {
         Login(x => x.post("/pc/mg/sys/pread").input({key:key}),
         (e:any)=>
         {
             if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
             {
                 /** 載入之商品 */
                let getObj:pub.productCar=e.data;
                
                /** 驗證是否重覆日入 */
                let re:boolean=false;
                ac.pdataAry.forEach((val1,nu)=>{
                    if(val1.key==getObj.key)
                    {
                        re=true;
                    }
                });

                if(!re)
                {
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

                    if(getObj.imgAry.length>0)
                    {
                        let getImg:string = getObj.imgAry[0];
                        getObj.imgAry = [];
                        (ac.productImg as jObjM)//緩儲圖片容器
                        .loadimgjson("/pc/igpt")//載入圖片
                        .input([getImg])
                        .async((e3,next3)=>
                        { 
                            e3.forEach((val3,nu3)=>{
                                getObj.imgAry = [val3];
                                $t.$an.loadImg('mgactpcPrviewDatali'+getObj.key,1000);//動畫
                            });
                            
                            /** 匹次載圖 */
                            let reNext = (re:(fun:nextImgLoad)=>void)=>
                            {       
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

                    /** 重建排序 */
                    let newpdAry:Array<pub.productCar> = [getObj];

                    ac.pAry.forEach((val,nu)=>{//排序位置
                        ac.pdataAry.forEach((val1,nu)=>{
                            if(val1.key==val)
                            {
                                newpdAry.push(val1);
                            }
                        });
                    });
                    ac.pdataAry = newpdAry;
                }
             }
             else
             {
                     mt.viewAlert($t.main.pub.config.get("error").svbusy);
             }
         });
    }

    /**
      * 刪除商品
      * @param obj 商品 json
      */
     remove = (obj:pub.productCar,ac:pE.acCtr)=>
     {
        mt.viewConfirm("是否確認刪除加購商品？"+$t.main.pub.catchLangName(obj.nameAry),()=>{
            Login((x)=>x.post("/ac/mg/doc/pdel")
                .input({key:ac.key,ary:JSON.stringify([obj.key])}),(e2:any)=>{
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重組刪除商品 */
                        let newpAry:Array<string> = [];
                        ac.pAry.forEach((val,nu)=>{
                            if(obj.key!=val)
                            {
                                newpAry.push(val);
                            }
                        });
                        ac.pAry = newpAry;

                        /** 重組刪除商品 */
                        let newpdAry:Array<pub.productCar> = [];
                        ac.pdataAry.forEach((val,nu)=>{
                            if(obj.key!=val.key)
                            {
                                newpdAry.push(val);
                            }
                        });
                        ac.pdataAry = newpdAry;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
            });
        },null);
     }

     /**
      * 商品往上移
      * @param obj 
      */
     pre =(obj:pub.productCar,ac:pE.acCtr)=>
     {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                Login((x)=>x.post("/ac/mg/doc/ppre")
                .input({key:ac.key,pkey:obj.key}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        ac.pAry = e.data;
                        /** 重建排序 */
                        let newpdAry:Array<pub.productCar> = [];
                        ac.pAry.forEach((val,nu)=>{//排序位置
                            ac.pdataAry.forEach((val1,nu)=>{
                                if(val1.key==val)
                                {
                                    newpdAry.push(val1);
                                }
                            });
                        });
                        ac.pdataAry = newpdAry;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
     }

    /**
     * 商品往下移
    * @param obj 
     */
    next =(obj:pub.productCar,ac:pE.acCtr)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                Login((x)=>x.post("/ac/mg/doc/pnext")
                .input({key:ac.key,pkey:obj.key}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        ac.pAry = e.data;
                        /** 重建排序 */
                        let newpdAry:Array<pub.productCar> = [];
                        ac.pAry.forEach((val,nu)=>{//排序位置
                            ac.pdataAry.forEach((val1,nu)=>{
                                if(val1.key==val)
                                {
                                    newpdAry.push(val1);
                                }
                            });
                        });
                        ac.pdataAry = newpdAry;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
    }

    /** 加購商品(preview) */
    PrivewProduct=(acobj:pE.acCtr)=>
    {
        if(acobj.pAry.length>0)
        {
            Login(x=>x.post("/pc/psys/mg/productchoose").input({ary:JSON.stringify(acobj.pAry)}),(obj)=>{
                if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                {
                        acobj.pdataAry = [];
                        /** 取圖片 名 */
                        let geImgList:Array<string> = [];
                        (obj.data as Array<pub.productCar>).forEach((val,nu)=>
                        {
                            val.error = false;
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
                                                    $t.$an.loadImg('mgactpcPrviewDatali'+val.key,1000);//動畫
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
                                                                $t.$an.loadImg('mgactpcPrviewDatali'+val.key,1000);//動畫
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
                }
                else
                {
                    $t.viewAlert($t.main.pub.config.get("error").svbusy);
                }
                
            });
        }
    };
    
}
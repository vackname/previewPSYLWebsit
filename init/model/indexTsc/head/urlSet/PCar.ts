import ajaxM from "../../../../../models/ajax";
import * as jEnum from "../../../../../JsonInterface/enum";
import pbM from "../../../../../models/pb";
import iLoad from "../../../../../models/importLoad";
import * as vue from "../../../../../models/vueComponent";
import {jObj as jObjM,nextImgLoad} from "../../../../../models/Jobj/interface";
import * as jDB from "../../../../../JsonInterface/db";
import * as pub from "../../../../../JsonInterface/pub";
import * as pE from "../../../pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** load file、document */
let Jobj:jObjM;
/** class this */
let self:model;
/** 注入 psyl vue template */
let vueComponent:vue.vueComponent;
/** psyl oad system */
let importLoad:iLoad;
/** headTemp */
let HeadTemp:pub.mainHeadTemp;

/** 商城 */
export default class model{
    constructor($tObj:any,$eObj:any,head:pub.mainHeadTemp) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        vueComponent = $eObj.vueComponent;
        importLoad = $eObj.importLoad;
        self = this;
        HeadTemp = head;
    }
 /**
 * 載入 MGMBNews 取樣版us
 * @param fun async function
 */
  productCityLoad =(fun:(n:string)=>void)=>
  {
      importLoad.p.productCity((re)=>
      {//載入專案
          /** project name*/
          let n:string="pcview";
              vueComponent($t)
                  .Name(n)
                  .Add((eval('productCity.main') as vue.templateObj).exportVue({//create project temp 綁 index temp
                      main:$t.main,//init 專案 入口點
                      mainTemp:$t//init index temp
                  }));
                  if(fun!=null && fun!=undefined){
                      fun(n);
                  }
      });
  }

  /** 專案
   * @param page 前往頁名 
    * @param page 前往頁名
    * @param gotopay 開啟支付頁
   */
   private PCLaod(page:string,gotopay:boolean)
   {
       HeadTemp.payCar = true;
       this.productCityLoad((n)=>{
           $t.$m.h.ChangePj(pE.enum_pag.productcar,n);
           pb.v($t,n).async((e)=>{
               if(e.VueName!=page)
               {
                 e.VueName = page;//切換顯示頁
               }

               e.openPay=gotopay;//開啟支付頁
               HeadTemp.payCar = !gotopay;//head 購物車小圖

               ($t.main as pub.main).page=page;

               if(e.VueName== "productTemp")
               {//初始化頁面-入口
                    e.OutInto = false;
                    e.showDetail=false;
                    e.showProtal = true;//載入商品
                    e.openEdit = false;
               }
               else if(e.VueName== "MgPs")
               {//載入商品編緝
                    e.openEdit = true;
                    e.openEditLoad = true;
              }   
           });
           HeadTemp.firstHome = true;//是否顯示home鈕
           HeadTemp.headopen = false;
      });
   }

    /** 側邊購物車(preview) */
    PrivewProductPay=()=>
    {
        pb.v(HeadTemp,"pcarTemp").async((e)=>
        {
            /** 商品key */
            let pkeyAry:Array<string> = [];
            HeadTemp.productCar.forEach((val,nu)=>{
                pkeyAry.push(val.key);
            });
            e.productCar = [];
            if(pkeyAry.length>0)
            {
                ($t.$m.h.Login as pub.Login)(x=>x.post("/pc/pcar/mg/productchoose").input({ary:JSON.stringify(pkeyAry)}),(obj)=>{
                    if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                    {
                        if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建購物清單(去除系統排除選購商品) */
                            let rePCar:Array<pub.pCar> = [];
                            let objAry:Array<pub.productCar> = [];//商品資訊
                            /** 取圖片 名 */
                            let geImgList:Array<string> = [];

                            obj.data.forEach((val:pub.productCar,nu:number)=>
                            {
                                val.error = false;
                                val["errorCount"] = false;
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
                                val.QR=null;
                                HeadTemp.productCar.forEach((val2,nu2)=>{
                                    if(val2.key==val.key)
                                    {
                                        val["count"] = val2.count;
                                        objAry.push(val);
                                        rePCar.push({key:val.key,count:val2.count});
                                        if(val.imgAry.length>0)
                                        {
                                            geImgList.push(val.imgAry[0]);
                                        }
                                    }
                                });
                            });

                            HeadTemp.productCar = rePCar;
                            localStorage.setItem("productCar",JSON.stringify(HeadTemp.productCar));
                            //重新存入暫存

                            if(HeadTemp.productCar.length>0)
                            {//有商品才顯示畫面
                                setTimeout(()=>{
                                    $t.pcarShow = true;
                                },300);
                            }
                            e.productCar = obj.data;
                            (e.productImg as jObjM)//緩儲圖片容器
                            .loadimgjson("/pc/igpt")//載入圖片
                            .input(geImgList)
                            .async((e3,next3)=>
                            { 
                                e3.forEach((val3,nu3)=>
                                {
                                    (e.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                    {
                                        if(val.imgAry.length>0)
                                        {
                                            if(val3==val.imgAry[0])
                                            {
                                                val.imgAry = [val3];
                                                HeadTemp.$an.loadImg('pcPrviewDatali'+val.key,1000);//動畫
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
                                                (e.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                                {
                                                    if(val.imgAry.length>0)
                                                    {
                                                        if(val3==val.imgAry[0])
                                                        {
                                                            val.imgAry = [val3];
                                                            HeadTemp.$an.loadImg('pcPrviewExsit'+val3.split('.')[0],1000);//動畫
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
                        }
                        else
                        {
                            $t.viewAlert($t.main.pub.config.get("error").svbusy);
                        }
                    }
                });
            }
        });
    };

    /** 購物車前往結帳頁 */
    GoProductPay = ()=>
    {
        pb.v(HeadTemp,"pcarTemp").async((e)=>
        {
            $t.pcarShow = false;
            HeadTemp.targetPageName = "productPay";
            self.PCLaod( HeadTemp.targetPageName,true);//開啟支付頁
            pb.v($t,'pcview').async((e)=>
            {
                e.openEdit=false;
            });
        });
    };

    /** 商城-首頁 */
    goProductTemp = ()=>
    {
        HeadTemp.targetPageName = "productTemp";
        self.PCLaod(HeadTemp.targetPageName,false);
    };

    /** 店主編緝商品 */
    goProductEditTemp =()=>
    {
        HeadTemp.targetPageName = "MgPs";
        self.PCLaod(HeadTemp.targetPageName,false);
    }

    /** 購物車 add
     * @param limit 購買釋量限制
    */
    getProductCar = (obj:pub.pCar,limit:number)=>
    {
        var inData = true;
        HeadTemp.productCar.forEach((val,nu:number)=>
        {
            if(val.key==obj.key){
                inData =false;
                if(limit>val.count || limit==0)
                {//限制商品增加
                    val.count+=1;
                }

                if(val.count>99)
                {
                    val.count=99;
                }
            }
        });

        if(inData )
        {
            HeadTemp.productCar.push(obj);
        }
        localStorage.setItem("productCar",JSON.stringify(HeadTemp.productCar));
        HeadTemp.$an.loadImg('pcPrviewDatali'+obj.key,1000);//動畫
        HeadTemp.$an.ProductCarAdd();//Add動畫
    }

    /** 減少商品 */
    DelProductCar = (obj:pub.pCar)=>
    {
        var inData = true;
        HeadTemp.productCar.forEach((val,nu:number)=>{
            if(val.key==obj.key){
                inData =false;
                val.count-=1;
                if(val.count<1)
                {
                    val.count=1;
                }
            }
        });
        localStorage.setItem("productCar",JSON.stringify(HeadTemp.productCar));
        HeadTemp.$an.loadImg('pcPrviewDatali'+obj.key,1000);//動畫
    }

    /** 取消特定商品購物車 
     * @param key product key
    */
    cancelProduct = (key:string)=>
    {
        var ary:Array<pub.pCar>=[];
        HeadTemp.productCar.forEach((val,nu)=>{
            if(val.key!=key){
                ary.push(val);
            }
        });

        if(HeadTemp.productCar.length==0)
        {//無任何購物資訊
            localStorage.removeItem("productCar");
        }else{
            localStorage.setItem("productCar",JSON.stringify(ary));//已存在時間
        }
        
        HeadTemp.$an.loadImg('PaypcPrviewDatali'+key,1000);//動畫
        HeadTemp.$an.loadImg('pcPrviewDatali'+key,1000);//動畫

        setTimeout(()=>
        {//更新商城
            HeadTemp.productCar = ary;
            pb.v($t,'pcview').async((e)=>
            {
                pb.v(e,"productTemp").async((e2)=>
                {//商城數量upadte
                    e2.$m.main.productCheck();
                });
            });
        },100);

        

        setTimeout(()=>{
            pb.v(HeadTemp,"pcarTemp").async((e)=>
            {
               
                let objAry:Array<pub.productCar> = [];//商品資訊
                (e.productCar as Array<pub.productCar>).forEach((val,nu)=>
                {
                    if(val.key!=key)
                    {
                        objAry.push(val);
                    }
                });

                e.productCar = objAry;
                if(HeadTemp.productCar.length==0)
                {//無項目則關閉視窗
    
                    e.open= false;
                }
            });
        },300);

    }

}
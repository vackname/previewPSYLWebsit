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

/** 主要 model */
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
                    obj.ck = true;
                    obj.count = val.count;
                }
            });
        });
    };
    
    /* 清除購物車商品 */
    cancelProduct=(obj:pub.productCar)=>
    {
        mt.$m.h.cancelProduct(obj.key);//取消購物車
        obj.ck = false;//同步商城 商品
        obj.count = 0;
    };

    /**補語系位置 */
    private addIndexOfLang=(obj:Array<string>)=>{
        for(let a=obj.length;a<($t.main as pub.main).pub.langAry.length;a++)
        {
            obj.push("");
        }
    };
    
    /** first 分類 */
    productClass = ()=>
    {
        Login(x => x.post("/pc/pcar/mg/productcflist"),
        (obj:any)=>
        {
            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                let getProduct:Array<pub.pctCtr> = [];
                obj.data.forEach((val:pub.pctCtr,nu:number)=>{
                    val.cl=[];//第二層細分類
                    val.opencl=false;
                    val.firstinput=true;
                    self.addIndexOfLang(val.nameAry);
                    getProduct.push(val);
                });
                $t.productcs = getProduct;
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            
        });
    };
    
     /** 分類名第二層 search 
      * @param key first level key
     */
    productClassSec = (key:string)=>
    {
        Login(x => x.post("/pc/pcar/mg/productcslist")
        .input({key:key}),(obj:any)=>
        {
            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                let createList:Array<pub.pcsCtr> = [];
                obj.data.forEach((val2:pub.pcsCtr,nu2:number)=>
                {
                    val2.firstinput=true;
                    this.addIndexOfLang(val2.nameAry);
                    createList.push(val2);
                });
                $t.productcsSec = createList;
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
       });
    };

    /** 確認商品是否已被選取 */
    productCheck=()=>{
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>
        {
            ($t.dataList as Array<pub.productCar>).forEach((val,nu)=>
            {//同步購物車 bind object
                val.ck = false;
                val.count = 0;
                he.productCar.forEach(function(val2,nu2){
                    if(val2.key==val.key){
                        val.ck = true;
                        val.count = val2.count;
                    }
                });
            }); 
        });
    }
    
    /**
     * 商品 search 
     * @param initSer 是否初始化
     */
    productListSer = (initSer:boolean)=>
    {
        if($t.load==true)
        {
            $t.load = false;
            pb.v($t, "pagetool").async((e2:pub.pageTool)=>{//Page Number bar 
    
                if(initSer)
                {//初化搜尋
                    $t.input.InputSer = $t.InputSer;
                    $t.input.selfclassmain = $t.selfclassmain;
                    $t.input.selfclass = $t.selfclass;
                    $t.pageNu = 0;
                    e2.pageNu = 0;
                    e2.pageCount = 0;
                    $t.dataList = [];
                    $t.discountList = [];
                }
         
                if(initSer || $t.pageNu != e2.pageNu)
                {//初始搜尋、或未曾載入分頁
                    Login(x => x.post("/pc/pcar/mg/productlist")
                    .input({
                        ser:$t.input.InputSer,
                        page:e2.pageNu,
                        filter:$t.filter,
                        selfclass:(($t.input.selfclassmain!="333")?(($t.input.selfclass=="999")?"999"+$t.input.selfclassmain:$t.input.selfclass):"333")
                    }),(obj:any)=>{
                            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                                    obj.data.forEach((val:pub.productCar,nu:number)=>{//同步購物車 bind object

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
                                        val.ck = false;
                                        val.count = 0;
                                        he.productCar.forEach(function(val2,nu2){
                                            if(val2.key==val.key){
                                                val.ck = true;
                                                val.count = val2.count;
                                            }
                                        });
                                    });   
                              
                                    /**取得圖層名稱 */
                                    let catchProductImg:Array<string>=[];
                                    /**db product list */
                                    let catchDatalist:Array<pub.productCar>=[];
                                    obj.data.forEach((val:pub.productCar,nu:number)=>{
                                        /** 是否存在*/
                                        let exist:boolean=false;
                                        $t.dataList.forEach((val2:pub.productCar,nu2:number)=>{//排除因刪除而造成找回原資料狀況
                                            if(val.key==val2.key)
                                            {
                                                exist=true;
                                            }
                                        });
                                        if(!exist)
                                        {
                                            this.addIndexOfLang(val.nameAry);
                                            this.addIndexOfLang(val.unitAry);
                                            this.addIndexOfLang(val.descriptionAry);
                                            val["langLoad"] = [];
                                            val["objImg"] = new (Jobj as any)();
                                            val["loaddimg"] = false;
                                            if(val.imgAry.length>0)
                                            {//push
                                                catchProductImg.push(val.imgAry[0]);
                                            }
                                            catchDatalist.push(val);
                                        }
                                    });

                                    catchDatalist.forEach((val,nu)=>
                                    {//渲染框架
                                        $t.dataList.push(val);
                                    });

                                    ($t.productImg as jObjM)//緩儲圖片容器
                                    .loadimgjson("/pc/igpt")//載入圖片
                                    .input(catchProductImg)
                                    .async((e3,next3)=>
                                    { 
                                        e3.forEach((val3,nu3)=>
                                        {
                                            $t.dataList.forEach((val:pub.productCar,nu:number)=>
                                            {
                                                if(val.imgAry.length>0)
                                                {
                                                    if(val3==val.imgAry[0])
                                                    {
                                                        val.imgAry = [val3];
                                                        $t.$an.photo.loadImg('productCityDatali'+val.key,1000);//動畫
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
                                                        

                                                        $t.dataList.forEach((val:jDB.Product,nu:number)=>
                                                        {
                                                            if(val.imgAry.length>0)
                                                            {
                                                                if(val3==val.imgAry[0])
                                                                {
                                                                    val.imgAry = [val3];
                                                                    $t.$an.photo.loadImg('productCityExsit'+val.key.split('.')[0],1000);//動畫
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

                                    obj.discount.forEach((val:jDB.ProductDiscount,nu:number)=>{//正在運行折扣
                                        /** 是否存在*/
                                        let exist:boolean=false;
                                        $t.discountList.forEach((val2:jDB.ProductDiscount,nu2:number)=>{//排除因刪除而造成找回,原資料狀況
                                            if(val.key==val2.key)
                                            {
                                                exist=true;
                                            }
                                        });
                                        if(!exist)
                                        {
                                            $t.discountList.push(val);
                                        }
                                    });

                                    e2.runAction = ()=>
                                    {//宣告 page tool 選擇物件
                                        self.productListSer(false);
                                    }

                                    $t.pageNu = e2.pageNu;
                                    e2.pageCount =  Number(obj.pageCount);

                                    if(e2.pageNu>=e2.pageCount && e2.pageCount > 0)
                                    {//如因商品下載縮減 自動退縮 page number 重取最後一頁
                                        e2.pageNu = e2.pageCount -1;
                                        self.productListSer(false);
                                    }
                                });
                            }
                            else
                            {
                                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                            }

                            $t.load = true;
                    });
                }
            });
        }
    };
};
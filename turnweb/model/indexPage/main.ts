import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import * as jEnum from "../../../JsonInterface/enum";
import * as jDB from "../../../JsonInterface/db";
import doc from "../../../JsonInterface/doc";

import storyM from "./story";
import dmModel from "./pDM";
import mainModel from "./index";

/** 首頁商品文宣 */
interface dmCtr extends jDB.ProductDM
{
    /** 圖片儲存容器 */
    objImg:jObjM,
    /** label */
    tag:pub.markPathCtr,
};

/** 首頁故事文宣 */
interface sCtr extends jDB.Story
{
    /** 圖片儲存容器 */
    objImg:jObjM,
    /** label */
    tag:pub.markPathCtr,
};

/** 新聞 */
interface newsCtr extends jDB.News
{
    /** label */
    tag:pub.markPathCtr,
};

/** 半空間活動 */
interface acCtr extends jDB.ActivityIn
{
    /** 圖片儲存容器 */
    objImg:jObjM,
};


/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

/** login */
let Login:pub.Login;
/** temp this */
let $t:any;
/** 入口點init project */
let mt:pub.mainTemp;
/** class this */
let self:main;
/** 文章載入內容共用 */
let docload:doc;
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    /** 故事 model */
    st:storyM | undefined;
    /** 商品 */
    dm:dmModel|undefined;
    /** 主要 搜尋 model */
    main:mainModel|undefined;
    constructor($tObj:any) {
        $t = $tObj;
        mt = $t.mainTemp;
        self = this;
        this.main = new mainModel($tObj,$e);
        this.st = new storyM($t,$e); 
        this.dm = new dmModel($tObj,$e);
        Login = (mt.$m.h.Login as pub.Login);
        docload = new doc($tObj,$e);
    }

    /** 取消訂閱-推播 */
    NotificationCancel=()=>
    {//todo
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register("/libjs/models/NotificationServiceWorkPSYL.min.js").then((e)=>{
                //推播/訂閱事件 work service 偵聽 事件
                e.pushManager.getSubscription()
                .then(function(subscription) {
                  if (subscription) {//取消
                    return subscription.unsubscribe();
                  }
                })
                .catch(function(error) {
                  console.log('Error unsubscribing', error);
                })
                .then(function() {
                  console.log('User is unsubscribed.');
                });;

                console.log("catch Work service");
                console.log(e);
            }).catch((error)=>{
                console.log(error);
                console.log("error Work service");
            });
            } else {
            console.log('Push is not supported');
            }
    }


    /** 加入訂閱-推播 */
    NotificationAdd=()=>
    {//todo
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register("/libjs/models/NotificationServiceWorkPSYL.min.js").then((e)=>{
                //推播/訂閱事件 work service 偵聽 事件
                e.pushManager.subscribe({
                    userVisibleOnly:true,
                    applicationServerKey:'BFJZicEEHLm16qgv-Kqan_qbOIET27m1j2xbaT62BdhJjPeJLE2Y8W-2Sm-ETCYDNNXr4gv10mpVB6JZDRR5XuI'
                }).then(subscription=>
                {//訂閱加密
                    console.log(JSON.stringify(subscription));
                }).catch((error)=>{
                    console.log("subscribe error");
                });

                console.log("catch Work service");
                console.log(e);
            }).catch((error)=>{
                console.log(error);
                console.log("error Work service");
            });
          } else {
            console.log('Push is not supported');
          }
    }
    
    /**
     * 搜尋
    */
    searchF = ()=>
    {
        $t.$an.search();//搜尋觸發動畫
        if ($t.searchTxt != "") 
        {
            $e.pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
            {
                if(e.load==0)
                {
                    Login(x => x.post("/ma/main/ser")
                    .input({ser:$t.searchTxt}),(obj:any)=>
                    {
                        if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            $t.searchResult = obj.data;
                            e.firstHome = true;//是否顯示home鈕e
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        $t.mainTemp.showTagBag = false;//關閉背包
                    });

                    setTimeout(()=>
                    {//取新聞
                        Login(x => x.post("/ns/main/data/newslist")
                        .input({
                            ser:$t.searchTxt,
                            pagetime:0,
                            selfclass:"333",
                            fkey:JSON.stringify([])
                        })
                        ,(obj:any)=>
                        {
                            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                (obj.data as Array<newsCtr>).forEach((val,nu)=>{
                                    val.tag = {path:val.key,show:false,content:null,tp:jEnum.Enum_docType.News} as pub.markPathCtr;
                                });
                                $t.newsList = obj.data as Array<newsCtr>;
                            }
                            else
                            {
                                mt.viewAlert( ($t.main as pub.main).pub.config.get("error").svbusy);
                            }
                        });
                    },100);

                    setTimeout(()=>
                    {//取採踩地方
                        Login(x => x.post("/nscc/main/data/newslist")
                        .input({
                            ser:$t.searchTxt,
                            pagetime:0,
                            selfclass:"333",
                            fkey:JSON.stringify([])
                        })
                        ,(obj:any)=>
                        {
                            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                (obj.data as Array<newsCtr>).forEach((val,nu)=>{
                                    val.tag = {path:val.key,show:false,content:null,tp:jEnum.Enum_docType.Newscc} as pub.markPathCtr;
                                });
                                $t.newsccList = obj.data as Array<newsCtr>;
                            }
                            else
                            {
                                mt.viewAlert( ($t.main as pub.main).pub.config.get("error").svbusy);
                            }
                        });
                    },100);

                    //最新消息
                    Login(x => x.post("/ma/main/serdm")
                    .input({ser:$t.searchTxt}),(obj:any)=>
                    {
                        if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            (obj.data as Array<dmCtr>).forEach((val2,nu)=>
                            {//新增資料
                                val2.tag = {path:val2.key,show:false,content:null,tp:jEnum.Enum_docType.Product} as pub.markPathCtr;
                                if(val2.objImg == null)
                                {//建立圖片容器
                                    val2.objImg = new (eval("Jobj") as any)();
                                }

                                val2.objImg//緩儲圖片容器
                                .loadimgjson("/ma/pdimg/"+val2.key)//載入圖片
                                .input(val2.imgAry)
                                .async((e3,next3)=>
                                { 
                                    /** 匹次載圖 */
                                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                                    {       
                                        /** 重建圖層更新 get set */
                                        let reImgAry:Array<string> = [];
                                        val2.imgAry.forEach((val3,nu2)=>{
                                            reImgAry.push(val3);
                                        });
                                        val2.imgAry = reImgAry;
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
                            });

                            $t.productList = (obj.data as Array<dmCtr>);
                        }
                        else
                        {
                            mt.viewAlert( ($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                    });
          
                    //伴空間最新消息
                    Login(x => x.post("/ma/main/serstory")
                    .input({ser:$t.searchTxt}),(obj:any)=>
                    {
                        if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            (obj.data as Array<sCtr>).forEach((val2,nu)=>
                            {//新增資料
                                val2.tag = {path:val2.key,show:false,content:null,tp:jEnum.Enum_docType.Story} as pub.markPathCtr;
                                if(val2.objImg == null)
                                {//建立圖片容器
                                    val2.objImg = new (eval("Jobj") as any)();
                                }

                                val2.objImg//緩儲圖片容器
                                .loadimgjson("/ma/stimg/"+val2.key)//載入圖片
                                .input(val2.imgAry)
                                .async((e3,next3)=>
                                { 
                                    /** 匹次載圖 */
                                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                                    {       
                                        /** 重建圖層更新 get set */
                                        let reImgAry:Array<string> = [];
                                        val2.imgAry.forEach((val3,nu2)=>{
                                            reImgAry.push(val3);
                                        });
                                        val2.imgAry = reImgAry;
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
                            });
                            $t.storyList = (obj.data as Array<sCtr>);
                        }
                        else
                        {
                            mt.viewAlert( ($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                    });

                    setTimeout(()=>
                    {//伴空間活動
                        Login((x)=>x.post("/ac/main/ser")
                            .input({ser:$t.searchTxt,date:0}),(e:any)=>
                            {
                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    $t.acList = [];
                                    e.data.forEach((val2:acCtr,nu2:number)=>
                                    {//新增資料
                                            if(val2.titleAry.length < ($t.main as pub.main).pub.langAry.length)
                                            {//補語系位置
                                                for(let a=val2.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                                {
                                                    val2.titleAry.push("");
                                                }
                                            }
                                    
                                            if(val2.descriptionAry.length < ($t.main as pub.main).pub.langAry.length)
                                            {//補語系位置
                                                for(let a=val2.descriptionAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                                {
                                                    val2.descriptionAry.push("");
                                                }
                                            }

                                            if(val2.objImg == null)
                                            {//建立圖片容器
                                                val2.objImg = new (eval("Jobj") as any)();
                                            }

                                            val2.objImg//緩儲圖片容器
                                            .loadimgjson("/ac/pdimg/"+val2.key)//載入圖片
                                            .input(val2.imgAry)
                                            .async((e3,next3)=>
                                            { 
                                                e3.forEach((val3,nu3)=>{
                                                    $t.$an.loadImg("serMGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                                });
                                                /** 匹次載圖 */
                                                let reNext = (re:(fun:nextImgLoad)=>void)=>
                                                {       
                                                    /** 重建圖層更新 get set */
                                                    let reImgAry:Array<string> = [];
                                                    val2.imgAry.forEach((val3,nu2)=>{
                                                        reImgAry.push(val3);
                                                    });
                                                    val2.imgAry = reImgAry;
                                                    //圖片載入完成 imglist
                                                    if(re!=null)
                                                    {
                                                        re((e4,next4)=>
                                                        {
                                                            e4.forEach((val3,nu3)=>{
                                                                $t.$an.loadImg("serMGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                                            });
                                                            reNext(next4);
                                                        });
                                                    }
                                                }
                                                reNext(next3);
                                            });
                                            $t.acList.push(val2);
                                    });
                                }
                            });
                    },300);

                    setTimeout(()=>{//商城-市集
                        Login(x => x.post("/pc/pcar/mg/productlist")
                        .input({
                            ser:$t.searchTxt,
                            page:0,
                            filter:false,
                            selfclass:"333"
                        }),(obj:any)=>{
                            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                            
                                /**取得圖層名稱 */
                                let catchProductImg:Array<string>=[];
                                obj.data.forEach((val:pub.productCar,nu:number)=>{
                                    if(val.imgAry.length>0)
                                    {//push img
                                        catchProductImg.push(val.imgAry[0]);
                                    }
                                });   
                                $t.pcarList = obj.data;
                                if($t.pcarImg==null)
                                {
                                    $t.pcarImg = new (eval("Jobj") as any)();
                                }
                                ($t.pcarImg as jObjM)//緩儲圖片容器
                                .loadimgjson("/pc/igpt")//載入圖片
                                .input(catchProductImg)
                                .async((e3,next3)=>
                                { 
                                    e3.forEach((val3,nu3)=>
                                    {
                                        $t.pcarList.forEach((val:pub.productCar,nu:number)=>
                                        {
                                            if(val.imgAry.length>0)
                                            {
                                                if(val3==val.imgAry[0])
                                                {
                                                    val.imgAry = [val3];
                                                    $t.$an.loadImg('serproductCityExsit'+val.key,1000);//動畫
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
                                                    

                                                    $t.pcarList.forEach((val:jDB.Product,nu:number)=>
                                                    {
                                                        if(val.imgAry.length>0)
                                                        {
                                                            if(val3==val.imgAry[0])
                                                            {
                                                                val.imgAry = [val3];
                                                                $t.$an.loadImg('serproductCityExsit'+val.key.split('.')[0],1000);//動畫
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
                        });
                    },200);
                }
            });
        }
    };
}
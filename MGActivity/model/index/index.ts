import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import * as pE from "../../model/pubExtendCtr";

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
/** main */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }
     /** 搜尋文章 data list
      * @param ser 搜尋關鍵字
      * @param init 是否初始化
      */
     serData=(init:boolean)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0 || init)
             {
                if(init)
                {//初始化搜尋
                    $t.list = [];
                }
                 Login((x)=>x.post("/ac/main/ser")
                 .input({ser:$t.ser,date:(($t.list.length>0)?$t.list[$t.list.length-1].date:0)}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         e.data.forEach((val2:pE.acCtr,nu2:number)=>
                         {//新增資料
                            val2.QR = null;
                             let insert:boolean=true;
                             ($t.list as Array<jDB.ActivityIn>).forEach((val1,nu1)=>
                             {//排除重覆
                                 if(val1.key==val2.key)
                                 {
                                     insert=false;
                                 }
                             });
 
                             if(insert)
                             {
                                val2.adrnow=false;
                                val2.langLoad = [];
                                val2.pdataAry =[];
                                val2.productImg = new (Jobj as any)();
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
                                    val2.objImg = new (Jobj as any)();
                                }

                                val2.objImg//緩儲圖片容器
                                 .loadimgjson("/ac/pdimg/"+val2.key)//載入圖片
                                 .input(val2.imgAry)
                                 .async((e3,next3)=>
                                 { 
                                     e3.forEach((val3,nu3)=>{
                                         $t.$an.loadImg("MGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
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
                                                     $t.$an.loadImg("MGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                                 });
                                                 reNext(next4);
                                             });
                                         }
                                     }
                                     reNext(next3);
                                 });
                                 $t.list.push(val2);
                             }
                         });
                     }
                     else
                     {
                        mt.viewAlert($t.main.pub.config.get("error").svbusy);
                     }
                 });
             }
         });
     }
};
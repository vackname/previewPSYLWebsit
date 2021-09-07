import pbM from "../../../models/pb";
import ajaxM from "../../../models/ajax";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** 文章容器 */
interface pdmCtr extends jDB.ProductDM
{
    /** 圖片儲存容器 */
    objImg:jObjM,
}

/** login */
let Login:pub.Login;
/** load file  */
let Jobj:jObjM;
/** psyl ajax api */
let ajax:ajaxM;
/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 入口點init project */
let mt:pub.mainTemp;
/** 商品文宣*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        ajax = $eObj.ajax;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 開起文章 */
    opeTag = (obj:jDB.ProductDM)=>
    {   
        $t.openDoc = true;
        $t.scrollTop = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
        pb.v($t,"docVue").async((e3)=>
        {
            e3.tag.path = obj.key;
            e3.tag.tp = jEnum.Enum_docType.Product;
            e3.tag.show = false;
            e3.tag.content = null;
            $t.$m.main.getLabel(e3.tag,'','',0);
            pb.v($t.mainTemp,'head_temp').async((e)=>{
                e.firstHome=true;
            });
        });
    }

    /** 搜尋文章 data list
     * @param init 是否初始化
     */
    serData=(init:boolean)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0 || init)
            {
                Login(x => x.post("/ma/main/dm")
                .input({date:(($t.pDM.list.length>0)?$t.pDM.list[$t.pDM.list.length-1].date:0)}),(obj:any)=>
                {
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        pb.v($t,"pdmVue").async(e2=>{
                            if(init)
                            {
                                //初始化搜尋
                                $t.pDM.list = [];
                            }

                            (obj.data as Array<pdmCtr>).forEach((val,nu)=>
                            {//新增資料
                                let insert:boolean=true;
                                ($t.pDM.list as Array<pdmCtr>).forEach((val1,nu1)=>{
                                    if(val1.key==val.key)
                                    {
                                        insert=false;
                                    }
                                });

                                if(insert)
                                {
                                    //唯一性list data
                                    if(val.objImg == null)
                                    {//建立圖片容器
                                        val.objImg = new (Jobj as any)();
                                    }

                                    if(val.imgAry.length>0){
                                        let getImg:Array<string> = [val.imgAry[0]];
                                        val.imgAry = [];
                                        val.objImg//緩儲圖片容器
                                        .loadimgjson("/ma/pdimg/"+val.key)//載入圖片
                                        .input(getImg)
                                        .async((e3:Array<string>,next3:(fun:nextImgLoad)=>void)=>
                                        { 
                                            /** 匹次載圖 */
                                            let reNext = (re:(fun:nextImgLoad)=>void)=>
                                            {       
                                                /** 重建圖層更新 get set謹顯示一張圖 */
                                                val.imgAry = getImg;
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
                                    $t.pDM.list.push(val);
                                }
                            });
                        });
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }
};
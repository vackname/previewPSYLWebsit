import ajaxM from "../../../../../models/ajax";
import pbM from "../../../../../models/pb";
import iLoad from "../../../../../models/importLoad";
import * as vue from "../../../../../models/vueComponent";
import {jObj as jObjM} from "../../../../../models/Jobj/interface";

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

/** 新聞媒體專案 */
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
     MGNewsLoad =(fun:(n:string)=>void)=>
     {
         importLoad.p.MGMBNews((re)=>
         {//載入專案
             /** project name*/
             let n:string="MGMBNews";
                 vueComponent($t)
                     .Name(n)
                     .Add((eval('MGMBNews.main') as vue.templateObj).exportVue({//create project temp 綁 index temp
                         main:$t.main,//init 專案 入口點
                         mainTemp:$t//init index temp
                     }));
                     if(fun!=null && fun!=undefined){
                         fun(n);
                     }
         });
     }
 
     /** 專案 MGMBNews-新聞文章
      * @param page 前往頁名 
      */
      private MGMBN(page:string)
      {
          HeadTemp.payCar = true;
          this.MGNewsLoad((n)=>{
              $t.$m.h.ChangePj(pE.enum_pag.news,n);
              pb.v($t,n).async(function(e){
                  if(e.VueName!=page)
                  {
                      e.VueName = page;//切換顯示頁
                  }
                  ($t.main as pub.main).page=page;
              });
              HeadTemp.firstHome = true;//是否顯示home鈕
              HeadTemp.headopen = false;
         });
      }
 
     /**
      * 新聞
     */
     GoInNewsIndex = ()=>
     {
         HeadTemp.targetPageName = "newsvue";
         self.MGMBN(HeadTemp.targetPageName);
     }
 
     /**
      * 新聞稿
     */
     GoInNewsMG = ()=>
     {
         HeadTemp.targetPageName = "mgvue";
         self.MGMBN(HeadTemp.targetPageName);
     }
}
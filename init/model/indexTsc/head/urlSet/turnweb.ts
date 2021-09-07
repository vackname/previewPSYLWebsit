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

/** 入口首頁 */
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
     * 專案 turnweb 轉頁設定  
     * @param ck 是否顯示home鈕
     * @param page 前往頁名
     * @param fun 等候取頁渲染後 運行function
     */
      turnwebPageSet=(ck:boolean,page:string,fun?:Function)=>
      {   
          $t.loadTurnWeb = true;
          HeadTemp.payCar = true;
          /** project name*/
          let n:string="turnweb";
          $t.$m.h.ChangePj(pE.enum_pag.first,n);
          HeadTemp.firstHome = ck;//是否顯示home鈕
          $t.VueName = n;//切換專案
          pb.v($t,n).async((e)=>{
              if(e.VueName=="index" && page == "index"){//已處於原頁
                  pb.v(e,'index').async((e2)=>{
                      e2.searchResult =[];//清空 結果陣列
                      e2.openDoc = false;
                  });
              }
              else
              {
                  e.VueName = page;//切換顯示頁
                  if(e.VueName == "PayHistory")
                  {//原已-停留於歷史頁-重新起動更新
                    setTimeout(()=>{
                      pb.v(e,e.VueName).async((e2)=>
                      {
                          if(e.VueName == "PayHistory")
                          {
                            e2.$m.historyInit();
                          }
                      });
                    },1000);
                  }
              }
              ($t.main as pub.main).page=page;//head title name
              if(fun!=null && fun!=undefined)
              {
                  fun();
              }
          });
          HeadTemp.headopen = false;
      }


    /** 前往修改資訊頁 */
    gombedit=()=>{
        HeadTemp.targetPageName = "mbedit";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

    /** 前往邀約 */
    goinvite=()=>{
        HeadTemp.targetPageName = "invite";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

    /** 前往禾氣合秝 */
    goaboutStory=()=>{
        HeadTemp.targetPageName = "aboutStory";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

    /** 服務款款 */
    goservice=()=>{
        HeadTemp.targetPageName = "service";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

    /** 隱私政策 */
    goprivate=()=>{
        HeadTemp.targetPageName = "private";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };
    
    /** 前往首頁 
     * @param fun 切換頁後執行
     * @param clear 清除搜尋資訊
    */
    gourlIndex=(fun:Function,clear?:boolean)=>{

        HeadTemp.targetPageName = "index";
        self.turnwebPageSet(false, HeadTemp.targetPageName,fun);
        pb.v($t,'turnweb').async((e)=>{
            pb.v(e,"index").async((e2)=>
            {

                e2.openBag=false;//標籤樣單獨關閉
                window.scroll(0, 0);//位移至定位畫面
                if(!clear)
                {
                    e2.searchResult =[];
                    e2.newsList=[];
                    e2.productList=[]; 
                    e2.storyList=[];
                    e2.acList=[];
                    e2.pcarList=[];
                }
            });
        });
    };
    
    /**
     * 前往注冊
    */
    turnREG=()=>{
        HeadTemp.targetPageName = "reg";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

    /**
     * 支付管理
    */
    gourlPay =()=>{
        HeadTemp.targetPageName = "PayHistory";
        this.turnwebPageSet(true, HeadTemp.targetPageName);
    };

     /** 搜尋 */
     GoInSearch = ()=>
     {
         HeadTemp.searchBox = false;
         pb.v($t,"head_temp").async((e2:pub.mainHeadTemp)=>
         {//關鍵字動畫
             e2.$an.searchBar();
         });
         if(pE.enum_pag.productcar==$t.NuView)
         {//商城
             pb.v($t,'pcview').async((e)=>
             {
                e.OutInto = false;
                e.showDetail=false;
                 pb.v(e,"productTemp").async((e2)=>
                 {
                     e2.InputSer = $t.searchTextBox;
                     e2.$m.main.productListSer(true);
                 });
             });
         }
         else
         {//入口網站
            $t.loadTurnWeb=true;
             pb.v($t,'pcview').async((e)=>
             {
                 pb.v(e,"productTemp").async((e2)=>
                 {//清除商品搜尋關鍵字
                     e2.InputSer = "";
                 });
             });
             pb.v($t,'turnweb').async((e)=>
             {
                 if( e.VueName!="index")
                 {//切換至首頁
                     self.gourlIndex(()=>
                     {
                         pb.v(e,"index").async((e2)=>{
                             e2.openDoc = false;
                             e2.openBag=false;//標籤樣單獨關閉
                             e2.searchTxt = $t.searchTextBox;
                             let wait = ()=>{
                                 if(e2.$m!=null){
                                    e2.$m.searchF();
                                 }else
                                 {
                                     setTimeout(()=>{ wait(); },100)
                                 }
                             }
                             wait();
                         });
                     },true);
                 }
                 else
                 {//直接搜尋不切換
                     $t.NuView = pE.enum_pag.first;
                     pb.v(e,"index").async((e2)=>
                     {
                         e2.openDoc = false;
                         e2.openBag=false;//標籤樣單獨關閉
                         e2.searchTxt = $t.searchTextBox;
                         let wait = ()=>{
                            if(e2.$m!=null){
                               e2.$m.searchF();
                            }else
                            {
                                setTimeout(()=>{ wait(); },100)
                            }
                        }
                        wait();
                     });
                 }
             });
         }
     };
}
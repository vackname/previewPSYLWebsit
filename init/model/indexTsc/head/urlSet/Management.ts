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

/** 後台管理 */
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
     * 載入 ManagementPJ 取樣版us
     * @param fun async function
     */
     MGLoad =(fun:(n:string)=>void)=>
     {
         importLoad.p.Management((re)=>
         {//載入專案
             /** project name*/
             let n:string='Management';
                 vueComponent($t)
                     .Name(n)
                     .Add((eval('Management.main') as vue.templateObj).exportVue({//create project temp 綁 index temp
                         main:$t.main,//init 專案 入口點
                         mainTemp:$t//init index temp
                     }));
                     if(fun!=null && fun!=undefined){
                         fun(n);
                     }
 
         });
     }
 
     /** 專案 Management
      * @param page 前往頁名 
      */
     private MG=(page:string)=>
     {
         HeadTemp.payCar = true;
         self.MGLoad((n:string)=>{
            $t.$m.h.ChangePj(pE.enum_pag.Management,n);
             pb.v($t,n).async(function(e)
             {
                 if(e.VueName == "MgWatch" && HeadTemp.chiefSysLevel() && $t.NuView==pE.enum_pag.Management)
                 {//原已-停留於監控頁-重新起動更新
                     pb.v(e,e.VueName).async((e2)=>
                     {
                         e2.$m.s.loadApp(false);
                     });
                 }
                 
                 if(e.VueName == "MgWatch" && $t.NuView==pE.enum_pag.Management)
                 {//ip 重新自動更新
                     pb.v(e,e.VueName).async((e2)=>
                     {
                         e2.$m.ip.ipListfun();
                     });
                 }

                 e.turnLog = false;//取消反回Log審核
                 if(page=="MgLog")
                 {//前往log 頁(獨立緩存)
                    e.logedit = true;
                    e.logodownload = true;//載入動作
                    pb.v(e,"MgLog").async(function(eLog)
                    {//定位
                        window.scroll(0, eLog.scrolltop);//位移至定位畫面
                    });
                 }
                 else
                 {//其它分頁
                    e.logedit = false;//關閉log審核page
                    if(e.VueName!=page)
                    {
                        e.VueName = page;//切換顯示頁
                        e.logedit = false;
                    }
                 }
                 ($t.main as pub.main).page=page;
             });
             HeadTemp.firstHome = true;//是否顯示home鈕
             HeadTemp.headopen = false;
         });
     }


    /**
     * 新聞發佈
    */
    gourlNewsMG=()=>
    {
        HeadTemp.targetPageName = "MgNews";
        this.MG( HeadTemp.targetPageName);
    };

    /**
     * 採踩發佈
     */
    gourlNewsMGcc=()=>
    {
        HeadTemp.targetPageName = "MgNewscc";
        this.MG( HeadTemp.targetPageName);
    };

    /** 監控系統管理 */
    gourlMgWatch=()=>
    {
        HeadTemp.targetPageName = "MgWatch";
        this.MG( HeadTemp.targetPageName );
    };

    /** 首頁文宣管理 */
    gourlMgPT=()=>
    {
        HeadTemp.targetPageName = "MgPT";
        this.MG( HeadTemp.targetPageName );
    };

    /** 會員管理 */
    gourlMBMG=()=>
    {
        HeadTemp.targetPageName = "MgMb";
        this.MG( HeadTemp.targetPageName );
    };

    /** 單據管理 */
    gourlMGPD=()=>{
        HeadTemp.targetPageName = "MgPd";
        this.MG( HeadTemp.targetPageName );
    };

    /** 商品管理 */
    gourlMGProduct=()=>{
        HeadTemp.targetPageName = "MgPs";
        this.MG( HeadTemp.targetPageName );
    };

    /** log審核 */
    gourlMGLog =()=>{
        HeadTemp.targetPageName = "MgLog";
        this.MG( HeadTemp.targetPageName );
    };

    /** 伴空間管理 */
    gourlMgAc =()=>{
        HeadTemp.targetPageName = "MgAc";
        this.MG( HeadTemp.targetPageName );
    };
    
}
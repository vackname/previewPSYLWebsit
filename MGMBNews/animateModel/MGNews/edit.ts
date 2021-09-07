
import * as pub from "../../../JsonInterface/pub";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";


/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** 編緝 model */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** insert 文章 異常提示 */
    insertDocError = ()=>
    {
        pb.el.id("newsPJPanel")
        .id("newsMBMGPanel")
        .id("NewsEditPanel")
        .id("selectPanel")
        .frame((e)=>{ 
            e.class("NewsEditselectInput").animate({"duration":0.6,"delay":0,"count":2},
            {//閃耀動畫
                "0%":{"color":"#FF3300"},
                "66%":{"color":"#AAA"},
                "100%":{"color":"#FF3300"}
            }).remove();//類別控項

            e.animate({"duration":0.6,"delay":0,"count":2},
                {//閃耀動畫
                    "0%":{"opacity": "1","border":"1px solid #FF3300"},
                    "66%":{"opacity": "0.5","border":"1px solid #FF8800"},
                    "100%":{"opacity": "1","border":"1px solid #FF3300"},
                }).remove();//移除動畫
        });
    }

    /**
     * 移除全部上傳預覽圖片動畫
     * @param key 刪除 段落列號+文章key
     * @param fun 運行結果function
    */
   removeAllUpload=(key:string,fun:Function)=>
   {
        pb.el.id('IUtakephotoAll'+key)
        .animate({"duration":0.3,"delay":0,"count":1},
        {//漸淡動畫
            "0%":{"opacity": "1"},
            "100%":{"opacity": "0.3"},
        }).remove();
        
        pb.el.id('IUtakephoto'+key)
       .animate({"duration":0.3,"delay":0,"count":1},
               {//漸淡動畫
                   "0%":{"opacity": "1"},
                   "100%":{"opacity": "0.3"},
               }).frame((e)=>{
                   fun();
               }).remove();//移除動畫

   }

    /**
     * 移除上傳 預覽圖片動畫
     * @param key 刪除 段落列號+文章key+img row number
     * @param fun 運行結果function
     */
    removeUpload=(key:string,fun:Function)=>
    {
        if(pb.el.id("newsUPimg"+key).exist)
        {//編緝視窗
            pb.el.id("newsUPimg"+key)
            .animate({"duration":0.3,"delay":0,"count":1},
            {//漸淡動畫
                "0%":{"opacity": "1"},
                "100%":{"opacity": "0.3"},
            }).frame((e)=>{
                fun();
            }).remove();//移除動畫
         }
    }
   
    /**
     * 移除文章動畫
     * @param nu 列號
     * @param fun 運行結果function
     */
    delDoc =(nu:number,fun:Function)=>
    {
        pb.el.id("newsDLP"+nu)
        .animate({"duration":0.3,"delay":0,"count":1},
                {//漸淡動畫
                    "0%":{"opacity": "1"},
                    "100%":{"opacity": "0.3"},
                }).frame((e)=>{
                    fun();
                }).remove();//移除動畫
 
    }

    /** 移除文章段落
     * @param key 文章key
     * @param nu 段落號
     */
    delDocAry = (key:string,nu:number,fun:Function)=>
    {
        pb.el.id("docConnection"+key+nu).animate({"duration":1,"delay":0,"count":1},
        {//漸淡動畫
            "0%":{"opacity":"0.3"},
            "100%":{"opacity":"1"}
        }).frame(e=>{
            fun();
        }).remove();
    }

     /** data 異動(save 提示 icon)
     * @param key key
     */
    dataRefrsh = (key:string)=>
    {
        setTimeout(()=>{
            pb.el.id(key).animate({"duration":0.1,"delay":0,"count":1},
            {//漸淡動畫
                "0%":{"padding-top":"5px"},
                "66%":{"padding-top":"0px"},
                "100%":{"padding-top":"5px"}
            }).remove();
        },50);
    }
};

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

    /** saveOK */
    save = (fun:Function)=>
    {
        pb.el.id("mgNewsUplad").id("savePg").animate({"duration":1,"delay":0,"count":1},
        {//閃耀動畫
            "0%":{"opacity": "0.7"},
            "30%":{"opacity": "0.0.3"},
            "100%":{"opacity": "0.3"},
        }).remove();

        pb.el.id("uploadSaveOKmessaveOKPanel").animate({"duration":0.5,"delay":0,"count":1},
        {//閃耀動畫
            "0%":{"opacity": "0.5","margin-top":"0px;"},
            "50%":{"opacity": "0.7","margin-top":"20px;"},
            "100%":{"opacity": "0.9","margin-top":"0px;"},
        }).frame((e)=>
        {

            pb.el.id("mgNewsUplad").animate({"duration":2,"delay":0,"count":1},
            {//顯退動畫-主要樣版
                "0%":{"opacity": "1"},
                "90%":{"opacity": "1"},
                "100%":{"opacity": "0.6"},
            }).remove();

            e.animate({"duration":2,"delay":0,"count":1},
            {//顯退動畫
                "0%":{"opacity": "1"},
                "80%":{"opacity": "1"},
                "90%":{"opacity": "0.5"},
                "100%":{"opacity": "0.5"},
            }).frame((e2)=>{
                fun();
            });
        }).delay(2).remove();//移除動畫
    }
};
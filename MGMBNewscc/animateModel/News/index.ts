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
/** 顯示文章提示 連接動畫 model */
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

    /** 更多文章鈕動畫 */
    serPage = ()=>
    {
        pb.el.id('SeRmoreDocccPage').animate({"duration":0.3,"delay":0,"count":1},
        {//click 閃耀
            "0%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "30%":{ "position": "relative","opacity":"1"},
            "62%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "70%":{"position": "relative","opacity":"1" },
            "80%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "100%":{"position": "relative","opacity":"1"},
        });
    }
}
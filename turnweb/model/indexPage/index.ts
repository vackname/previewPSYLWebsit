import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import doc from "../../../JsonInterface/doc";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
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
/** 系統共用 */
let main:pub.main;
/** 文章載入內容共用 */
let docload:doc;
/** 入口首頁 page */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
        docload = new doc($tObj,$eObj);
    }

    /** 開起page 形式 */
    toPage=(key:string,tp:number)=>
    //前往開另外頁面形態
        docload.getLabel({  
            path: key,
            tp : tp,
            show:false,
            content:null
        } as pub.markPathCtr,'','',0);
    

    /** 標籤前往 */
    getLabel=(val:pub.markPathCtr,animateName:string,tagAnimateName:string,colorTag:number)=>docload.getLabel(val,animateName,tagAnimateName,colorTag);
    /** show temp 文章 */
    showTemp=(tp:jEnum.Enum_docType):string=> docload.showTemp(tp);
    /**
     * 新聞more
     * @param val 
     * @param animateName image載入動畫名
     */
    NewsLabelMoreData=(val:pub.NewsCtr,animateName:string)=> docload.NEWSmoreData(val,"",animateName);
}
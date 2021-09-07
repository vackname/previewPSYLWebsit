import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import doc from "../../../JsonInterface/doc";

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
/** 文章載入內容共用 */
let docload:doc;
/** 標籤新增工具 model */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
        docload = new doc($tObj,$eObj);
    }

    /**
     * 新增標籤
     * @param key 路徑
     * @param tp doctype enum
     * @param title 標籤名
     */
    insertBt=(key:string,tp:number,title:string)=>
    {
        pb.v($t,"Newsvue/takLabelvue").async(tl$t=>
        {
            /** 標籤名 */
            let nameAry:Array<string> = [((title.replace(/ /g,'')!='')?title:"Label Name")];
            for(let a=1;a< main.pub.langAry.length;a++)
            {
                nameAry.push("Label Name");//補語系位置
            }

            if(tp==jEnum.Enum_docType.url)
            {
                if(key.toLocaleLowerCase().indexOf('http')==-1)
                {//超連結加入http
                    key="http://"+key;
                }
            }

            tl$t.insertFun({tp:tp,path:key,nameAry:nameAry,
                update:true,
                show:false,
                content:null} as pub.markPathCtr);
    
            tl$t.close();
        });
    }
}
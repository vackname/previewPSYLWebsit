import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";
import * as pub from "../../../../JsonInterface/pub";
import * as jEnum from "../../../../JsonInterface/enum";

/** temp this */
let $t:pub.mainTemp;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** 登入系統 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
    }

    /**
     * @param fu 完成登入驗證再載入 專案
    */
    Login=(fu:Function)=>
    {
        let spUrl:Array<string> = window.location.href.split('/');//取網址
        /** 取fb api */
        let nowCatchData:Array<string> = spUrl[spUrl.length-1].split('?');
        if(nowCatchData[0]=="fb" && pb.LogingetCookie("mbidtoken")==null)
        {/* fb 取回驗證資料 login */
            try
            {
                let toToken:Array<string> = nowCatchData[1].split("&");
                let token:string="";
                /** server 驗證號 */
                let state:string="";
                toToken.forEach((val,nu)=>
                {//取驗證值
                    let valcode:Array<string> = val.split('=');
                    if(valcode[0].toLowerCase()=='state')
                    {//psyl server ver code
                        state=valcode[1].split("#")[0];
                    }

                    if(valcode[0].toLowerCase()=='code')
                    {//facebook server get token code
                        token=valcode[1];
                    }
                });
                $t.$m.l.FBLoginOauto(token,state,fu);
            }
            catch(e)
            {

            }
            return false;
        }
        else
        {
            return true;
        }

    }

    toLogin=()=>
    {//前往fb 登入
        ajax.postToken("/jsonapi/fbcode")
        .async((e)=>{
            var obj = JSON.parse(e);
            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
            {
                let client_id:string = '358467735701531';
                let redirect_uri:string = 'https%3A%2F%2Fpsyltw.com%2Ffb';
                let link:string = 'https://www.facebook.com/v11.0/dialog/oauth?';
                link += 'response_type=code';
                link += '&client_id=' + client_id;
                link += '&redirect_uri=' + redirect_uri;
                link += '&state='+ obj.data;
                window.location.href = link;
            }
            else
            {
                ($t as pub.mainTemp).viewAlert($t.main.pub.config.get("error").svbusy);
            }
        });
    }

    /** 登出 */
    LogOut=(fu:Function)=>{
        if(fu!=null)
        {
            fu();
        }
        else
        {
            $t.$m.l.singOut();
        }
    }

}
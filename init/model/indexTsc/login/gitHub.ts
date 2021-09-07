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
        /** 取github api */
        let nowCatchData:Array<string> = spUrl[spUrl.length-1].split('?');
        if(nowCatchData[0]=="github" && pb.LogingetCookie("mbidtoken")==null)
        {/* github 取回驗證資料 login */
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
                        state=valcode[1];
                    }

                    if(valcode[0].toLowerCase()=='code')
                    {//github server get token code
                        token=valcode[1];
                    }
                });
                $t.$m.l.gitHubLoginOauto(token,state,fu);
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
        ajax.postToken("/jsonapi/githubcode")
        .async((e)=>{
            var obj = JSON.parse(e);
            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
            {
                let client_id:string = '1d8c938fc3572ce6b9fb';
                let redirect_uri:string = 'https%3A%2F%2Fpsyltw.com%2Fgithub';
                let link:string = 'https://github.com/login/oauth/authorize?';
                link += 'scope=user:email';
                link += '&client_id=' + client_id;
                link += '&redirect_uri=' + redirect_uri;
                link += '&state=' + obj.data;
                window.location.href = link;
                //https://github.com/login/oauth/authorize?&client_id=1d8c938fc3572ce6b9fb&redirect_uri=https%3A%2F%2Fpsyltw.com%2Fgithub&state=dfafsd&scope=user:email
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
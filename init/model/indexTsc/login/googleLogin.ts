import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";
import * as pub from "../../../../JsonInterface/pub";

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
        self.Init();//初始化
    }

    private Init=()=>
    {
        try
        {
            eval("gapi").load('client', ()=>{
                eval("gapi").client.init({
                    //client_id 和 scope 兩者參數必填
                    clientId: "155504784559-r83cr0n30t6bh39bo1kpq2g8atamjglu.apps.googleusercontent.com",
                    scope: "profile",//"https://www.googleapis.com/auth/userinfo.profile",
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"]
                });
            });
        }
        catch(e)
        {
            console.log("Google Login stop!!");
        }
    }

    Login=()=>{
        let auth2 = eval("gapi").auth2.getAuthInstance();//取得GoogleAuth物件
        auth2.signIn().then((GoogleUser:any)=>{
            let AuthResponse = GoogleUser.getAuthResponse(true) ;//true會回傳包含access token ，false則不會string
            /** 驗證證用Id Token */
            let id_token:string = AuthResponse.id_token;//取得id_token
            $t.$m.l.GLoginOauto(id_token);
        },
        (error:string)=>{

        });
    }//end function GoogleLogin

    /** 登出 */
    LogOut=(fu:Function)=>{
        let auth2 = eval("gapi").auth2.getAuthInstance(); //取得GoogleAuth物件
        auth2.disconnect().then(()=>{
            //console.log('User disconnect.');
            if(fu!=null)
            {
                fu();
            }
            else
            {
                $t.$m.l.singOut();
            }
            
        });
    }
}
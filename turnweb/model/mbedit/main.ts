import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import *  as mbeditPE from "./pubExtendCtr";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

/** 驗證 code */
enum regEX
{
    /** 未驗證 */
    NotCK=-1,
    /** 驗證通過 */
    ok=1,
    /** 錯誤 */
    fail=0,
}

/** login */
let Login:pub.Login;
/** temp this */
let $t:mbeditPE.mbditTemp;
/** 入口點init project */
let mt:pub.mainTemp;
/** class this */
let self:main;
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};

import peM from "./per";
import bkM from "./bankInfo";
import mbM from "./mbdata";
import qrM from "./QR";
export default class main{
    /** 會員申請權限 model */
    pe:peM | undefined;
    bank:bkM | undefined;
    mb:mbM | undefined;
    qr:qrM| undefined;
    constructor($tObj:any) {
        $t = $tObj;
        mt = $t.mainTemp;
        self = this;
        Login = (mt.$m.h.Login as pub.Login);
        this.pe = new peM($tObj,$e);
        this.bank = new bkM($tObj,$e);
        this.mb = new mbM($tObj,$e);
        this.qr = new qrM($tObj,$e);
    }
    
    /** 密碼更動 */
    editpassword =()=>
    {
        self.ckfunpw();
        if($t.AllCKpw){
            $t.load = false;
            Login((x)=> x.post("/mb/ac/pwedit").input({repassword:$t.input.repassword,pw:$t.input.pw,pwsign:$t.pw2}),(obj)=>{
                if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null){
                    $t.input.repassword ="";
                    $t.input.pw ="";
                    $t.pw2 = "";
                    mt.viewAlert($t.lang.get("alert").password,()=>{},$t.main.pub.lib.src('mbOn.png'));
                }else if(Number(obj.error)  == jEnum.Enum_SystemErrorCode.fail){
                    mt.viewAlert($t.lang.get("alert").passworderror,()=>{},$t.main.pub.lib.src('mbOff.png'));
                }
                else
                {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
                $t.load = true;
            });
        }
    };
    
    /** 密碼更動驗證 */
    ckfunpw=()=>{
        let regExpStr2:RegExp = /[a-zA-Z0-9]+[\d{1,}]+|[\d{1,}]+[a-zA-Z0-9]+$/;
        $t.ckType.pw3 = (($t.pw2!="" && $t.pw2.length>=5)?regEX.ok:regEX.fail);
        $t.ckType.pw = ((regExpStr2.test($t.input.pw) && $t.input.pw.length>=5)?regEX.ok:regEX.fail);
        $t.ckType.repassword = (($t.input.repassword == $t.input.pw && $t.input.pw.length>=5)?regEX.ok:regEX.fail);
        self.ALLCKfuncPw();
    };
    
    /** 全部驗證通過 */
    ALLCKfuncPw=()=>{
        $t.AllCKpw=true;
        $t.AllCKpw =(($t.ckType.pw3 == regEX.ok)? $t.AllCKpw:false);
        $t.AllCKpw =(($t.ckType.pw == regEX.ok)? $t.AllCKpw:false);
        $t.AllCKpw =(($t.ckType.repassword == regEX.ok)? $t.AllCKpw:false);
    };
    
    /** 編緝資訊 */
   editdata =()=>{
        self.ckfun();
        if($t.AllCK){
            $t.load = false;
            Login((x)=>x.post("/mb/ac/regedit").input({mail:$t.input.mail,pw:$t.pw}), (obj)=>{
                $t.pw = "";
                if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    mt.viewAlert($t.lang.get("alert").modify,()=>{},$t.main.pub.lib.src('mbOn.png'));
                }
                else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.fail){
                    mt.viewAlert($t.lang.get("alert").passworderror,()=>{},$t.main.pub.lib.src('mbOn.png'));
                } else {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
                $t.load = true;
            });
        }
    };
    
    /** 取消綁定定戶 */
    cancelBind = ()=>
    {
        mt.viewConfirm($t.lang.get("confirm").cancelbind,()=>{
            Login((x)=> x.post("mb/ac/client/bindcancel"),(e2)=>{
                    if(e2.error*1==1)
                    {
                        $t.input.mg = $e.pb.tokenToJson($e.pb.LogingetCookie("mbidtoken")).mb.mg;
                        mt.viewAlert($t.lang.get("alert").passworderror,()=>{},$t.main.pub.lib.src('mbOn.png'));
                    }else{

                        mt.viewAlert($t.lang.get("alert").cancelinvite,()=>{},$t.main.pub.lib.src('mbOn.png'));
                    }
                });
        },null);
    }

    /** 資訊修改-驗證 */
   ckfun=()=>
   {
       /** 驗證e-mainl */
        let regExpStr4:RegExp =/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        $t.ckType.mail = ((regExpStr4.test($t.input.mail) && $t.input.mail.length>=7)?1:0);
       
        $t.ckType.pw2 = (($t.pw!="" && $t.pw.length>=5)?1:0);
     
        self.ALLCKfunc();
    };
    
    /** 全部驗證通過 */
    ALLCKfunc=()=>{
        $t.AllCK=true;
        $t.AllCK =(($t.ckType.mail ==1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.pw2 ==1)? $t.AllCK:false);
    };
};
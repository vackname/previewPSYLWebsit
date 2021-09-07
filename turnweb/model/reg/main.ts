import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
}

/** 註冊輸入欄位 */
interface regInput
{
    /** 匿名 */
    name:string,
    /** 密碼 */
    pw:string,
    /** 密碼輸入驗證 */
    repassword:string,
    /** 帳戶 */
    mbid:string,
    /** e-mainl */
    mail:"",
}

/** view 錯誤提示 */
interface inputError
{
    /** 同意書錯誤提示 */
    priv:number|-1,
    /** 匿名錯誤提示 */
    name:number|-1,
    /** 密碼錯誤提示 */
    pw:number|-1,
    /** 密碼輸入驗證錯誤提示 */
    repassword:number|-1,
    /** 帳戶 錯誤提示 */
    mbid:number|-1,
    /** e-main 錯誤提示 */
    mail:number|-1,
}

/** 註冊樣版 */
interface regTemp
{
    /** 註冊欄位 */
    input:regInput,
    /** 處理中 提示(完成=false) */
    load:boolean,
    /** 同意書 */
    priv:boolean,
    /** 是否驗證無誤 有誤=false */
    AllCK:boolean,
    /** 錯誤提示 */
    ckType:inputError
    mainTemp:pub.mainTemp,
    main:pub.main,
    /** 載入語系 */
    lang:jObjM,
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

/** temp this */
let $t:regTemp;
/** 入口點init project */
let mt:pub.mainTemp;
/** class this */
let self:main;
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    constructor($tObj:any) {
        $t = $tObj;
        mt = $t.mainTemp;
        self = this;
    }

    /** 註冊 */
    regInsert=()=>
    {
        self.ckfun();
        
        if($t.AllCK){
            $t.load =true;
            $e.ajax.postToken("/mb/ac/reg")
            .input($t.input)
            .async(function(e){
                var obj = JSON.parse(e);
                if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null){
                    $t.input={
                        name:"",
                        pw:"",
                        repassword:"",
                        mbid:"",
                        mail:"",
                    };
    
                    mt.ViewAlertAtClose($t.lang.get("alert").sinup,()=>
                    {
                            mt.$m.h.tur.gourlIndex();//回首頁
                    },3,$t.main.pub.lib.src('mbOn.png'));
                    
                }else{
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode. ExistData){
                        mt.ViewAlertAtClose($t.lang.get("alert").singupfail,null,3,$t.main.pub.lib.src('mbOff.png'));
                    }else{
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                }
                $t.load = false;
            });
        }
    };
    
    /** 驗證錯誤 */
    ckfun=()=>{
      
        /** 帳戶驗證 */
        let regExpStr1:RegExp = /[a-zA-Z0-9]+[\d{1,}]+|[\d{1,}]+[a-zA-Z0-9]+$/;
        $t.ckType.mbid = ((regExpStr1.test($t.input.mbid) && $t.input.mbid.length>=5)?regEX.ok:regEX.fail);
        /** 密碼驗證 */
        let regExpStr2:RegExp = /[a-zA-Z0-9]+[\d{1,}]+|[\d{1,}]+[a-zA-Z0-9]+$/;
        $t.ckType.pw = ((regExpStr2.test($t.input.pw) && $t.input.pw.length>=5)?regEX.ok:regEX.fail);
        $t.ckType.repassword = (($t.input.repassword == $t.input.pw && $t.input.pw.length>=5)?regEX.ok:regEX.fail);
      
        $t.ckType.name = (( $t.input.name.length>=3)?regEX.ok:regEX.fail);
         /** mail 格式驗證 */
        let regExpStr4:RegExp  =/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        $t.ckType.mail=((regExpStr4.test($t.input.mail) && $t.input.mail.length>=7)?regEX.ok:regEX.fail);
     
        $t.ckType.priv =(($t.priv)?regEX.ok:regEX.fail);
        self.ALLCKfunc();
    }

    /** 全部驗證通過 */
    ALLCKfunc=()=>{
        $t.AllCK = true;
        $t.AllCK =(($t.ckType.mbid == 1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.pw == 1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.repassword == 1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.name ==1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.mail ==1)? $t.AllCK:false);
        $t.AllCK =(($t.ckType.priv==1)? $t.AllCK:false);
    };
};
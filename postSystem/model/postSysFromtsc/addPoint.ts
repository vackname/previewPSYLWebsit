import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** post 選入商品 */
export interface poPostCtr extends jDB.PayOptions
{
    /** 套餐項目設定 object pE.pSetFormat to string json*/
    setdata:string,
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** QR code 收現 充值 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }


    /**
     * 取消立單
     * @param uidToken 客戶 uid
     * @param allowances 讓
     * @param cash 購買點數金額
     */
     cancelFPay=(uidToken:string,cash:number,allowances:number,callback:Function)=>
     {
         /** 讓利總額 */
         let TotalAllowAnces = Number((cash*(allowances/100)).toFixed(3));
         mt.viewConfirm($t.getLang("Recharge")+"?"+$t.getLang('checkout')+"?",()=>{

            Login((x)=>x.post("/mpay/mg/ptaccountdate/postsyspay").input({token:uidToken,
                payoption:JSON.stringify([{pkey:'a',cash:Number(cash)+TotalAllowAnces,allowances:TotalAllowAnces}] as Array<jDB.PayOptions>)
            
            }),(e2:any)=>{
                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    callback();
                    mt.viewAlert($t.getLang("Recharge")+"!OK！",()=>{},$t.main.pub.lib.src('coin.png'));
                }
                else if(Number(e2.error) == jEnum.Enum_SystemErrorCode.VerifyError)
                {//token 驗證錯誤
                    mt.viewAlert($t.getLang("error").verToken,()=>{},$t.main.pub.lib.src('coin.png'));
                }
                else if(Number(e2.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                {//商品不存在
                    mt.viewAlert($t.getLang("error").enablePD,()=>{},$t.main.pub.lib.src('coin.png'));
                }
                else
                {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
                
            });

         },()=>{},$t.main.pub.lib.src('coin.png'));
     }
}
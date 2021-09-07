import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
/** loading blance server */
interface lbCtr
{
    /** server host */
    host:string,
    /** loading blance 區號 */
    nu:number,
    /** 已承載 使用者 */
    count:number
}

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
/** Loading Blance */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }
    /** 初始化 */
    init=()=>
    {
        Login((x)=>x.post("/mg/mb/chief/loadinglist"),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                $t.LBServer =e.data as Array<lbCtr>;//server負載狀況取得
                Login((x)=>x.post("/mg/mb/chief/stoploadinglist"),(e2:any)=>
                {//server負載狀況取得
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {//取得各站台名稱
                        $t.stopLB= e2.data as Array<string>;//server負載停用
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中！(init)");
                    }
                });
            }
            else
            {
                mt.viewAlert("伺服器忙線中！(init)");
            }
        });
    }

    /** 開關使用 負載 
     * @param nu 負載區號
    */
    OpenClose=(val:lbCtr)=>
    {
        mt.viewConfirm("是否確認"+val.host+(($t.stopLB.indexOf(val.host)>-1)?"起用":"終止"),()=>
        {
            Login((x)=>x.post("/mg/mb/chief/loadingopenclose").input({nu:val.nu}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    $t.stopLB= e.data;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！(init)");
                }
            });
        },null);
    }
}
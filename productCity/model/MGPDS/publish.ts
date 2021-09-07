import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as MGPSpE from "./pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** login */
let Login:pub.Login;
/** 系統共用 */
let main:pub.main;
/** 入口點init project */
let mt:pub.mainTemp;
/** 商品發佈 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 發佈 */
    papprove = ()=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {
                pb.v($t,"editview").async((e:any)=>
                {
                    mt.viewConfirm($t.langM("confirm")+"?"+$t.langM("publish")+"-"+main.pub.catchLangName((e.val as MGPSpE.pCtr).nameAry),()=>
                    {
                        Login((x)=>x.post("/pc/mg/mb/papprove").input({key:e.val.key}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                (e.val as MGPSpE.pCtr).codekey = e3.data;
                                (e.obj as MGPSpE.pCtr).codekey   = e3.data;
                            }
                            else
                            {
                                mt.viewAlert(main.pub.config.get("error").svbusy);
                            }
                        });
                    },null,main.pub.lib.src('publish.png'));
                });
            }
        });
    }

    /** 取消發佈 */
    CancelPapprove = ()=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {
                pb.v($t,"editview").async((e:any)=>{
                    mt.viewConfirm($t.langM("confirm")+"?"+$t.langM("cpublish")+"-"+main.pub.catchLangName((e.val as MGPSpE.pCtr).nameAry),()=>
                    {
                        Login((x)=>x.post("/pc/mg/mb/cacelpapprove").input({key:e.val.key}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                (e.val as MGPSpE.pCtr).codekey = e3.data;
                                (e.obj as MGPSpE.pCtr).codekey   = e3.data;
                            }
                            else
                            {
                                mt.viewAlert(main.pub.config.get("error").svbusy);
                            }
                        });
                    },null,main.pub.lib.src('errorMes.png'));
                });
            }
        });
    }
}
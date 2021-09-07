import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

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
/** 入口點init project */
let mt:pub.mainTemp;
/** 商品審核 設定 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /**
     * 審核合格
     * @param val 
     */
    appck =(val:pE.pCtr)=>
    {
        mt.viewConfirm("是否確認審核通過？",()=>{
            Login((x)=>x.post("/pc/mg/sys/papprove").input({key:val.key}),(e:any)=>{
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    val.codekey = (e.data as jDB.Product).codekey;
                    val.approve="";//清除錯諤訊息
                    val.mark = (e.data as jDB.Product).mark;
                    val.appck = (e.data as jDB.Product).appck;
                    pb.v($t,"editview").async((ed:any)=>{
                        ed.obj.codekey = (e.data as jDB.Product).codekey;
                        ed.obj.approve="";//清除錯諤訊息
                        ed.obj.mark = (e.data as jDB.Product).mark;
                        ed.obj.appck = (e.data as jDB.Product).appck;
                        ed.val.codekey = (e.data as jDB.Product).codekey;
                        ed.val.approve="";//清除錯諤訊息
                        ed.val.mark = (e.data as jDB.Product).mark;
                        ed.val.appck = (e.data as jDB.Product).appck;
                    });
                }
                else
                {
                    mt.viewAlert("伺服器忙線中");
                }
            });
        },null,$t.main.pub.lib.src('publish.png'));

    }

    /**
     * 審核失格
     * @param val 
     */
    appfail=(val:pE.pCtr)=>
    {
        mt.ViewConfirmInput("是否確認審核失格？",(e:string)=>
        {
            Login((x)=>x.post("/pc/mg/sys/papprovefail").input({key:val.key,mark:e.replace(/\/n/g,"<br/>")}),(e:any)=>{
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    val.codekey = (e.data as jDB.Product).codekey;
                    val.approve = (e.data as jDB.Product).approve;
                    val.mark = (e.data as jDB.Product).mark;
                    val.appck = (e.data as jDB.Product).appck;
                    pb.v($t,"editview").async((ed:any)=>{
                        ed.obj.codekey = (e.data as jDB.Product).codekey;
                        ed.obj.approve = (e.data as jDB.Product).approve;
                        ed.obj.mark = (e.data as jDB.Product).mark;
                        ed.obj.appck = (e.data as jDB.Product).appck;
                        ed.val.codekey = (e.data as jDB.Product).codekey;
                        ed.val.approve = (e.data as jDB.Product).approve;
                        ed.val.mark = (e.data as jDB.Product).mark;
                        ed.val.appck = (e.data as jDB.Product).appck;
                    });
                }
                else
                {
                    mt.viewAlert("伺服器忙線中");
                }
            });
        },null,$t.main.pub.lib.src('publish.png'));
    }
}
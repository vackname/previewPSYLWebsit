import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

/** 自動審核文章 設定容器 */
interface mbCtr extends jDB.Member
{
    /* 自動審核取值 */
    auto:jDB.AutoCK|null
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
/** 審核文章 自動設定 */
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

    /** 成員 list
     * @param serck 是否初始化 true = 是
     */
    MBList = (serck:boolean)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            pb.v($t, "autoeditvue").async((e:any)=>{//Page Number bar
                pb.v(e, "pagetool").async((e2:pub.pageTool)=>{//Page Number bar
                    if(he.load==0)
                    {
                        if(serck)
                        {//搜尋鈕起動-還原
                            e.RecodeInputSer = e.InputSer;
                            e2.pageNu = 0;
                        }
    
                        Login((x)=>x.post("mg/mb/mblistdoc")
                        .input({ser:e.RecodeInputSer,page:e2.pageNu}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 已搜尋結果會員帳戶 */
                                let mblist:Array<mbCtr> = e3.data;
                                /** 取得目前 uid 需被設定資料 */
                                let uidList:Array<string> =[];
                                mblist.forEach((val:mbCtr,nu:number)=>
                                {
                                    uidList.push(val.uid);
                                });

                                if(uidList.length>0)
                                {//有帳戶才進化檢測
                                    Login((x)=>x.post("ns/mg/ad/autolist")//取得審核資料
                                    .input({"uidAry":JSON.stringify(uidList)}),(e4:any)=>
                                    {
                                        if(Number(e4.error) == jEnum.Enum_SystemErrorCode.Null)
                                        {
                                            /** 已曾設定審核帳戶資料 */
                                            let autockAry:Array<jDB.AutoCK>=e4.data;
                                            e2.runAction = ()=>{ 
                                                self.MBList(false);
                                            };
                                            e.pageTagetNu=e2.pageNu;//取得當前頁碼 flag
                                            mblist.forEach((val:mbCtr,nu:number)=>{
                                                /** 是否存在設定資料 */
                                                let dataExist:boolean=false;
                                                autockAry.forEach((val2:jDB.AutoCK,nu2:number)=>
                                                {
                                                    if(val2.uid==val.uid)
                                                    {
                                                        val.auto = val2;//create 欄位
                                                        dataExist = true;
                                                    }
                                                });

                                                if(!dataExist)
                                                {//不在設定資料
                                                    val.auto = {mguid:"",ck:false,uid:""} as jDB.AutoCK;
                                                }
                                            });
                                            e.mbList = mblist;
                                            e2.pageCount = e3.pageCount;4  
                                        }
                                        else
                                        {
                                            mt.viewAlert("伺服器忙線中！");
                                        }
                                    });
                                }
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中！");
                            }
                        });
                    }
                    else
                    {//防止多點
                        e2.pageNu=e.pageTagetNu;//變動回去原頁碼
                    }
                });
            });
        });
    }

    /**
     * 開關自動審核
     * @param val 帳戶
    */
    setAuto=(val:mbCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                Login((x)=>x.post("ns/mg/ad/autoset")
                .input({uid:val.uid}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.auto = e.data;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中！");
                    }
                });
            }
        });
    }
};

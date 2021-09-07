import pbM from "../../../models/pb";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** load file  */
let Jobj:jObjM;
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
/** 會員 編緝 list page */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        Jobj = $eObj.Jobj;
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 載入個資 */
    loadPer = (val:pE.mbCtr)=>
    {
        Login((x)=> x.post("/ma/mg/sysmg/myper").input({uid:val.uid}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                val.per.key = obj.data.key;
                val.per.id = obj.data.id;
                val.per.gender = obj.data.gender;
                val.per.name = obj.data.name;
                val.per.birthday = obj.data.birthday;
                val.per.phone  = obj.data.phone;
                val.per.tel  = obj.data.tel;
            }

            Login((x)=> x.post("/ma/mg/sysmg/photobank").input({uid:val.uid}), (obj2)=> 
            {//取圖片
                if (Number(obj2.error) == jEnum.Enum_SystemErrorCode.Null) 
                {
                    if(obj2.img.length>0)
                    {
                        val.per.objImg
                        .loadimgjson("/ma/mgmbbankimg/"+val.uid)//載入銀行ifo圖片
                        .input(obj2.img)
                        .async((e3,next3)=>
                        {   
                            val.per.BankPhoto = e3;
                            /** 匹次載圖 */
                            let reNext = (re:(fun:nextImgLoad)=>void)=>
                            {//圖片載入完成 imglist
                                if(re!=null)
                                {
                                    re((e4,next4)=>
                                    {
                                        reNext(next4);
                                    });
                                }
                            }
                            reNext(next3);
                        });
                    }
                }
                val.openPer = true;
            });
        });
    }

    /** 取得 會員等級 level list(enum) */
    MBLevelContainer=()=> {
        $t.mblevelList=pub.leveNameDataCT();
    };

    /** 成員 list
     * @param serck 是否初始化 true = 是
     * @param fun 緩action function
     */
    MBList = (serck:boolean,fun?:Function)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
            pb.v($t, "pagetool").async((e2:pub.pageTool)=>{//Page Number bar
                if(e.load==0 || serck)
                {
                    if(serck)
                    {//搜尋鈕起動-還原
                        $t.RecodeInputSer = $t.InputSer;
                        e2.pageNu = 0;
                    }
                    Login((x)=>x.post("mg/mb/mblist"+(($t.headPortal.SysLevel())?"app":""))//app 搜尋異動帳戶
                    .input((($t.headPortal.SysLevel())?{ser:$t.RecodeInputSer,page:e2.pageNu,appck:$t.appckser}:{ser:$t.RecodeInputSer,page:e2.pageNu})),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            e2.runAction = ()=>{ 
                                self.MBList(false);
                             };
                             $t.pageTagetNu=e2.pageNu;//取得當前頁碼 flag

                             (e3.data as Array<pE.mbCtr>).forEach((val,nu)=>{
                                val.openPer = false;//注入get set 序列
                                val.per = {
                                        key:"",
                                        id:"",
                                        gender:1,
                                        name:"",
                                        birthday:0,
                                        phone:"",
                                        tel:"",
                                        objImg:new (Jobj as any)(),
                                        BankPhoto:[]
                                    };
                            });

                            $t.mbList = e3.data;
                            e2.pageCount = e3.pageCount;
                            if(fun!=null && fun !=undefined)
                            {
                                fun($t.mbList[0]);
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
                    e2.pageNu=$t.pageTagetNu;//變動回去原頁碼
                }
            });
        });
    };

    /**
     * 設定帳號-view
     * @param obj 帳戶 object json
     */
    MBSet=(obj:jDB.Member)=>
    {
        //取得現在需定位畫面位置
        $t.scrolltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        pb.v($t,"AccountSet").async((e:any)=>
        {// init
            e.mb = obj;//更動資料
            e.mb["pw"] = "";
            e.InputEditLimit="--";
            e.ViewOpen();
        });
    };
    /** 會員權限設定
     * @param getID mbid
    */
    editMB = (getID:string)=>
    {
        Login((x)=>x.post("mg/mb/mbedit/mblimit").input({mbid:getID}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        mt.viewAlert("設定成功！");
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
    };
}
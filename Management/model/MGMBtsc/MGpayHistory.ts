import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/**  pay 支付記錄 */
interface prCtr extends jDB.payRecord
{
    /** 活動 */
    ac:jDB.ActivityIn,
    acimg:string,//活動base 64 圖片
    /** 改變單據狀態 input container */
    dealType:string | "--",
    /** 改變單據狀態 備註 input container */
    dealMark:string | "",
    /** 廢單備註 */
    displayMark:string | "",
    /** 開關明細(us view) */
    open:boolean | false,
    /** 個資 */
    perInfo:jDB.Personal,
    /** 聯絡人 */
    amesInfo:jDB.AMes,
    /** 住址 */
    adrInfo:jDB.Address
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
let Jobj:jObjM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 支付管理 */
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
    /** 支付銀行圖片 */
    bankImg=(bank:number)=>pub.bankImg($t.img,bank);
    /** 支付銀行 */
    bankSu = ()=>pub.bankCT();

    /** 運送狀態 */
    shStatus = ()=>pub.shtpStatusCT();

    /** 取寄送時段 */
    getDtime=()=>pub.dTimeCT();

    /** 取消(已處理單獎狀態) */
    cancelMark = (val:prCtr)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                mt.viewConfirm("是否確認標示為處理中？",()=>
                {
                    Login((x)=>x.post("/mpay/mg/mb/pay/sendparcelwait").input({key:val.key}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            val.ck = false;
                            val.sttype = jEnum.Enum_sttype.wait;
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中！");
                        }
                    });
                },null);
            }
        });
    }

    /** 載入單據資訊個資/聯絡人/寄件地址 */
    private payinfo=(keyAry:Array<string>)=>
    {
        if(keyAry.length>0)
        {
            Login((x)=>x.post("/mpay/mg/mb/pay/perinfo").input({keyary:JSON.stringify(keyAry)}),(e)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    pb.v($t,"payHY").async((ehy:any)=>{
                        ehy.history.forEach((val:prCtr,nu:number)=>
                        {
                            (e.per as Array<jDB.Personal>).forEach((val1,nu)=>{
                                if(val1.key==val.key){
                                    val.perInfo=val1;
                                }
                            });

                            (e.pames as Array<jDB.AMes>).forEach((val1,nu)=>{
                                if(val1.key==val.key){
                                    val.amesInfo=val1;
                                }
                            });

                            (e.adr as Array<jDB.Address>).forEach((val1,nu)=>{
                                if(val1.key==val.key){
                                    val.adrInfo=val1;
                                }
                            });
                        });
                    });
                }
                else
                {
                    mt.viewAlert($t.main.pub.config.get("error").svbusy);
                }
            });
        }
    }

    /** 單據 管理者作發 
     * @param data 單據 json object
    */
   payDisplayEdit=(data:prCtr)=>
   {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
            if(e.load==0)
            {
                if(data.display==1)
                {
                    mt.viewConfirm("是否確認廢棄單據？",()=>
                    {
                            Login((x)=>x.post("/mpay/mg/mb/pay/paydisplay")
                            .input({uid:data.uid,key:data.key,mark:data.displayMark}),(e2:any)=>{
                            var obj = e2;
                            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                            {
                                data.display = obj.display*1;
                                data.mark = obj.mark;
                                mt.viewAlert("已作廢！");
                            }else{
                                mt.viewAlert("伺服器忙線中！");
                            }
                        });
                    },null);
                }
                else
                {
                    if(data.displayMark.replace(/ /g,'')!="")
                    {
                        Login((x)=>x.post("/mpay/mg/mb/pay/paydisplay")
                        .input({uid:data.uid,key:data.key,mark:data.displayMark}),(e2:any)=>
                        {
                            var obj = e2;
                            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                            {
                                data.mark = obj.mark;
                                mt.viewAlert("作廢單已填入備註！！");
                            }else{
                                mt.viewAlert("伺服器忙線中！");
                            }
                        });
                    }
                }
            }
        });
    }

    /** 驗證 手動改狀態(完成交易/申請退款/完成退款) */
    payStatusLimit = (val:jDB.payRecord):boolean=>{
        /** 驗證(604800=7天秒數-已完成交易狀) */
        let ck:boolean=[jEnum.Enum_payStatus.complete,jEnum.Enum_payStatus.Return,jEnum.Enum_payStatus.create].indexOf(val.status)>-1 && (val.status==jEnum.Enum_payStatus.complete && val.payDate + 604800>= pb.unixReNow() || val.status!=jEnum.Enum_payStatus.complete);
        return ((val.appck && !mt.SysLevel()) || mt.SysLevel()) && ck;
    }
    

    /** 支付狀態控制器-container */
    payStatusSelect=(pr:jDB.payRecord)=>{
        /** 輸出 */
        let getPayStatus:Array<pub.payStatusContainer> = [];
        /** 取參數 */
        let getdata:Array<pub.payStatusContainer> = pub.payStatusCT();
        getdata.forEach((val,nu)=>{
            if([jEnum.Enum_payStatus.complete,jEnum.Enum_payStatus.fail].indexOf(val.val)>-1 && pr.status==jEnum.Enum_payStatus.create
            || pr.status==jEnum.Enum_payStatus.complete && [jEnum.Enum_payStatus.Return,jEnum.Enum_payStatus.complete].indexOf(val.val)>-1 
            || pr.status==jEnum.Enum_payStatus.Return && [jEnum.Enum_payStatus.Return,jEnum.Enum_payStatus.ReturnComplete].indexOf(val.val)>-1 
            )
            {
                getPayStatus.push(val);
            }
        });
        return getPayStatus;
    };


    /** 單據狀態修改 
     * @param data 單據 json object
    */
    payStatusEdit=(data:prCtr)=>
    {
        if(data.dealType !="--")
        {
            mt.viewConfirm("是否確認修改交易狀態？",()=>
            {
                pb.v($t,"payHY").async((e:any)=>{
                    Login((x)=>x.post("/mpay/mg/mb/pay/paydisstatus")
                    .input({uid:data.uid,status:data.dealType,key:data.key,mark:data.dealMark}),(e3:any)=>{
                    var obj = e3;
                    if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                    {
                        if(mt.head.mbdata.level==jEnum.Enum_MBLevel.systemMG)
                        {
                            data.status = obj.status*1;
                            data.mark = obj.mark;
                            if(obj.obj!=null)
                            {//完成交易帳戶資訊更新
                                data.appck = obj.obj.obj.appck;
                                let mb:jDB.Member = e.mb;
                                mb.pay = obj.obj.obj.pay;
                                mb.MBCount = obj.obj.obj.MBCount;
                                mb.level=  obj.obj.obj.level;
                                mb.autoAry = obj.obj.obj.autoAry;
                                mb.ck = obj.obj.obj.ck;
                                mb.mg = obj.obj.obj.mg;
                                mb.mark = obj.obj.obj.mark;
                            }
                            mt.viewAlert("編緝成功！");
                        }
                        else
                        {
                            data.appck= false;
                            data.mark = obj.mark;
                            mt.viewAlert("已送審");
                        }
                    }else{
                        mt.viewAlert("伺服器忙線中！");
                    }
                });
                });
            },null);
        }
        else
        {
            mt.viewAlert("請選擇交易狀態！");
        }
    }

    /** 歷史資訊 container載入 */
    historyInit=()=>pb.v($t,"payHY").async((e:any)=>
    {
        e.statusfilter = pub.payStatusCT();
        e.typefilter = pub.payTypeCT();
    });


    /** 歷史明細 
     * @param 訂單資訊 uid校對用、key 訂單號
    */
    detail=(val:prCtr,fun:Function)=>
    {
        Login((x)=>x.post("/mpay/mg/mb/pay/historydetail")
                .input({uid:val.uid,prkey:val.key}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            fun(e2.data as jDB.PayOptions);
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
        });
    };

    /** 支付明細-list 
     * @param init 初始化 是=true
     * @param obj member object json
     * @param key 訂單號查詢
    */
    payhistory=(obj:jDB.Member,init:boolean,key:string)=>
    {
        //取得現在需定位畫面位置
        $t.scrolltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        pb.v($t,"payHY").async((e:any)=>{
            e.mb = obj;//preview資料
        
            pb.v(e, "pagetool").async((e2:pub.pageTool)=>{//Page Number bar
                if(e.load)
                {
                    if(init){//初始化
                        e.history = [];//清空
                        e.pageTagetNu = 0;
                        e2.pageNu = e.pageTagetNu;
                    }

                    e.load=false;
                    Login((x)=>x.post("/mpay/mg/mb/pay/history")
                            .input({uid:e.mb.uid,page:e2.pageNu,key:key}),(e4:any)=>{
                                    if(Number(e4.error) == jEnum.Enum_SystemErrorCode.Null)
                                    {
                                        /** get key 取 info 個資/聯絡人/寄件住址 */
                                        let getKeyAry:Array<string> = [];
                                        e2.runAction = ()=>{
                                            self.payhistory(obj,false,key); 
                                            };
                                        e.pageTagetNu=e2.pageNu;//取得當前頁碼 flag
                                        e4.data.forEach((val:prCtr,nu:number)=>{
                                            getKeyAry.push(val.key);
                                            val.perInfo ={
                                                id:"",
                                                gender:1,
                                                name:"",
                                                birthday:0,
                                                phone:"",
                                                tel:"",
                                            } as jDB.Personal;//註冊getset
            
                                            val.amesInfo={
                                                gender:1,
                                                title:"",
                                                name:"",
                                                phone:"",
                                                tel:"",
                                            } as jDB.AMes;//註冊getset
            
                                            val.adrInfo=
                                            {
                                                name:"",
                                                gender:1,
                                                phone:"",
                                                tel:"",
                                                city:"",
                                                country:"",
                                                area:"",
                                                zip:"",
                                                address:"",
                                                dtime:jEnum.Enum_DeliveryTime.not,
                                            } as jDB.Address;//註冊getset
                                            val.open=false;
                                            val.dealType="--";
                                            val.dealMark="";
                                            val.displayMark ="";
                                            val.acimg = "";
                                            val.ac = ({ "titleAry":[] }) as any;
                                            if(val.akey!=null)
                                            {
                                                Login((x)=>x.post("ac/mg/doc/docread").input({key:val.akey}),(e3)=>{
                                                    if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                                    {
                                                        val.ac=e3.data;
                                                        for(let a=val.ac.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                                        {//填空語系 位置
                                                            val.ac.titleAry.push("");
                                                        }
                                                        if(e3.data.imgAry.length>0){
                                                            /** load 活動Img */
                                                            let img:jObjM =  new (Jobj as any)();//宣告img容器
                                                            img.loadimgjson("/ac/mgpdimg/"+val.akey)//載入圖片
                                                            .input([e3.data.imgAry[0]])
                                                            .async((e4)=>
                                                            {//圖片載入完成再載入 imglist
                                                                val.acimg=img.src(e3.data.imgAry[0]);
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                        self.payinfo(getKeyAry);
                                        e.history=e4.data as Array<prCtr>;
                                        e2.pageCount = e4.pageCount;
                                        e.ViewOpen();
                                    }
                                    else
                                    {
                                        mt.viewAlert("伺服器忙線中");
                                    }
                                    e.load=true;
                            });
                }
                else
                {//防止多點
                    e2.pageNu=e.pageTagetNu;//變動回去原頁碼
                }
            });
        });
    };
}
import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
interface prTB extends jDB.payRecord
{
    /** 個資 */
    perInfo:pE.perCtr,
    /** 聯絡人 */
    amesInfo:jDB.AMes,
    /** 住址 */
    adrInfo:jDB.Address,
    /** 載入銀行資訊button */
    bankImgBt:Function
}
interface prCtr
{
    recode:prTB,
    /** 帳戶 */
    account:string,
    /** 帳戶持有者 */
    name:string,
    /** 活動 */
    ac:jDB.ActivityIn,
    acimg:string,//活動base 64 圖片
    /** 開關明細(us view) */
    open:boolean | false,
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
/** main */
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

    /** Tag 伴空間 活動模式 */
    insertTag = (mark:pub.markPathCtr)=>
    {
        $t.connectionAC={name:mark.nameAry[0],key:mark.path};
    }

    /**
     * 新增標籤-活動
     * @param key 路徑
     * @param tp doctype enum
     * @param title 標籤名
     */
    insertBt=(key:string,tp:number,title:string)=>
    {
        pb.v($t,"takLabelvue").async(tl$t=>
        {
            /** 標籤名 */
            let nameAry:Array<string> = [((title.replace(/ /g,'')!='')?title:"Label Name")];

            for(let a=1;a< $t.main.pub.langAry.length;a++)
            {
                nameAry.push("Label Name");//補語系位置
            }
            
            tl$t.insertFun({tp:tp,path:key,nameAry:nameAry,
                update:true,
                show:false,
                content:null} as pub.markPathCtr,$t);
            tl$t.close();
        });
    }

    /** 取消(已處理單獎狀態) */
    cancelMark = (val:prTB)=>
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
                        else{
                            mt.viewAlert("伺服器忙線中！");
                        }
                    });
                },null);
            }
        });
    }
    /** 
     * 歷史資訊 container載入 
    */
    historyInit=()=>
    {
        $t.statusfilter = pub.payStatusCT();
        $t.typefilter = pub.payTypeCT();
        setTimeout(()=>{
            Login((x)=>x.post("/mpay/mg/mb/sys/paysetstatus"),(e3:any)=>{
                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    $t.closeDay = e3.data.closeDay;
                    $t.year = e3.data.year;

                    $t.YearInput = new Date().getFullYear();//初始化載入這個月結帳單
                    $t.MonthInput = new Date().getMonth()+1;
                    self.ser(true);
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },200);
    };
  
    /**
     * 歷史明細
     * @param val 訂單資訊 key訂單 uid使用者uid
     * @param fun function 依賴性注入
     */
    detail=(val:jDB.payRecord,fun:Function)=>
    {
        Login((x)=>x.post("/mpay/mg/mb/pay/historydetail").input({uid:val.uid,prkey:val.key}),(e2:any)=>{
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        fun(e2.data as jDB.PayOptions);
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中！");
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
                    let newHistory:Array<prCtr> = [];
                    $t.history.forEach((val:prCtr,nu:number)=>
                    {
                        (e.per as Array<pE.perCtr>).forEach((val1,nu1)=>{
                            if(val1.key==val.recode.key)
                            {
                                val.open=false;
                                val1.objImg = new (Jobj as any)();
                                val1.BankPhoto =[];
                                val.recode.perInfo=val1;
                            }

                        });

                        (e.pames as Array<jDB.AMes>).forEach((val1,nu1)=>{
                            if(val1.key==val.recode.key){
                                val.open=false;
                                val.recode.amesInfo=val1;
                            }
                        });

                        (e.adr as Array<jDB.Address>).forEach((val1,nu1)=>{
                            if(val1.key==val.recode.key){
                                val.open=false;
                                val.recode.adrInfo=val1;
                            }
                        });
                        newHistory.push(val);
                    });
                    $t.history = [];
                    $t.history = newHistory;
                }
                else
                {
                    mt.viewAlert($t.main.pub.config.get("error").svbusy);
                }
            });
        }
    }
 
    /**
     * 搜尋
     * @param startInit 是否初始化
     */
    ser = (startInit:boolean)=>
    {//搜尋帳單
        if(startInit){//初始化
            $t.input.YearInput = $t.YearInput;
            $t.input.MonthInput = $t.MonthInput;
            $t.input.InputSer = $t.InputSer;
            $t.input.statusInput = $t.statusInput;
            $t.input.typeInput = $t.typeInput;
            $t.history=[];
        }
    
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0 || startInit)
            {
                /** 最後一筆時間點 */
                let pageTime:number=(($t.history.length>0)?($t.history[$t.history.length-1] as prCtr).recode.date:0);
                /** 取得同時間已存在資料key */
                let fkey:Array<string> = [];
                ($t.history as Array<prCtr>).forEach((val,nu)=>{
                    if(pageTime==val.recode.date)
                    {
                        fkey.push(val.recode.key)
                    }
                });

                Login((x)=>x.post("/mpay/mg/mb/sys/payday")
                .input({year:$t.input.YearInput,month:$t.input.MonthInput,
                    ackey:$t.connectionAC.key,//活動模式key
                    pagetime:pageTime,
                    fkey:JSON.stringify(fkey),
                    ser:$t.input.InputSer,status: $t.input.statusInput,type: $t.input.typeInput,
                    shtp:$t.shtp
                }),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            $t.sumCash = 0;//還原
                            $t.SHSumCash = 0;//還原
                            $t.NotSHSumCash =0;
                            /** get key 取 info 個資/聯絡人/寄件住址 */
                            let getKeyAry:Array<string> = [];
                            (e2.data as Array<prCtr>).forEach((val,nu)=>
                            {
                                getKeyAry.push(val.recode.key);
                                val.recode.bankImgBt=()=>
                                Login((x)=> x.post("/ma/mg/sysmg/photobank").input({uid:val.recode.uid}), (obj2)=> 
                                {//取圖片-bankinfo
                                    if (Number(obj2.error) == jEnum.Enum_SystemErrorCode.Null) 
                                    {
                                        if(obj2.img.length>0)
                                        {
                                            val.recode.perInfo.objImg
                                            .loadimgjson("/ma/mgmbbankimg/"+val.recode.uid)//載入銀行ifo圖片
                                            .input(obj2.img)
                                            .async((e3,next3)=>
                                            {   
                                                val.recode.perInfo.BankPhoto = e3;
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
                                        else
                                        {
                                            mt.viewAlert("客戶尚未設定銀行資訊！",()=>{}, $t.main.pub.lib.src('bankCar.png'));
                                        }
                                    }
                                    else
                                    {
                                        mt.viewAlert("伺服器忙線中！");
                                    }
                                });
                                val.recode.perInfo ={
                                    id:"",
                                    gender:1,
                                    name:"",
                                    birthday:0,
                                    phone:"",
                                    tel:"",
                                    objImg:new (Jobj as any)(),
                                    BankPhoto:[] as Array<string>
                                } as pE.perCtr;//註冊getset

                                val.recode.amesInfo={
                                    gender:1,
                                    title:"",
                                    name:"",
                                    phone:"",
                                    tel:"",
                                } as jDB.AMes;//註冊getset

                                val.recode.adrInfo=
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
                                
                                val.open=false;//開關明細(us view)
                                val.acimg = "";
                                val.ac = ({ "titleAry":[] }) as any;
                                if(val.recode.akey!=null && val.recode.akey!="")
                                {
                                    Login((x)=>x.post("ac/mg/doc/docread").input({key:val.recode.akey}),(e3)=>{
                                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                        {
                                            val.ac=e3.data;
                                            for(let a=val.ac.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                            {//填空語系 位置
                                                val.ac.titleAry.push("");
                                            }
                                            if(e3.data.imgAry.length>0){
                                                /** load 活動Img */
                                                let img:jObjM =  new (Jobj as any)();//宣告img容器.
                                                img.loadimgjson("/ac/mgpdimg/"+val.recode.akey)//載入圖片
                                                .input([e3.data.imgAry[0]])
                                                .async((e4)=>
                                                {//圖片載入完成再載入 imglist
                                                    val.acimg=img.src(e3.data.imgAry[0]);
                                                });
                                            }
                                        }
                                    });
                                }
                                $t.history.push(val);
                            });
                            self.payinfo(getKeyAry);
                            $t.pageCount = e2.pageCount;
                            $t.dealCount = e2.deal;
                            $t.sumObjCash = e2.sumObjCash;
                            $t.sumObjCash.forEach((val:any,nu:Number)=>{//結帳總額運算
                                $t.sumCash+=val.cash*1;
                            });
                            /**
                             * 統計單據狀態
                             */
                            let getTypeCount:Array<any>=[];
                            e2.getTypeCount.forEach((val:any,nu:Number)=>{
                                /** 是否存在目前單據 */
                                let ckExist:boolean=false;
                                getTypeCount.forEach((val2:any,nu2:Number)=>{
                                    if(val2.status*1==val.status*1){
                                        ckExist=true;
                                        if(val.display*1==1)
                                        {
                                            val2.c += val.c*1;
                                        }
                                        else
                                        {//後台廢單
                                            val2.dc += val.c*1;
                                        }
                                    }
                                });
                                if(!ckExist){
                                    getTypeCount.push({status:val.status,dc:((val.display*1==0)?val.c*1:0),c:((val.display*1==1)?val.c*1:0)});
                                }
                            });
                            $t.getTypeCount = getTypeCount;
   
                            //-----進貨總額運算
                            $t.NotShmentSumObjCash = e2.NotShmentSumObjCash;
                            $t.NotShmentSumObjCash.forEach((val:any,nu:Number)=>{//進貨-未結帳總額運算
                                $t.NotSHSumCash+=val.cash*1;
                            });

                            $t.ShmentSumObjCash = e2.ShmentSumObjCash;
                            $t.ShmentSumObjCash.forEach((val:any,nu:Number)=>{//進貨-結帳總額運算
                                $t.SHSumCash+=val.cash*1;
                            });
                            /**
                             * 進貨統計單據狀態
                             */
                            let getSHTypeCount:Array<any>=[];
                            e2.getTypeSHCount.forEach((val:any,nu:Number)=>{
                                /** 是否存在目前單據 */
                                let ckExist:boolean=false;
                                getSHTypeCount.forEach((val2:any,nu2:Number)=>{
                                    if(val2.status*1==val.status*1){
                                        ckExist=true;
                                        if(val.display*1==1)
                                        {
                                            val2.c += val.c*1;
                                        }
                                        else
                                        {//後台廢單
                                            val2.dc += val.c*1;
                                        }
                                    }
                                });
                                if(!ckExist){
                                    getSHTypeCount.push({status:val.status,dc:((val.display*1==0)?val.c*1:0),c:((val.display*1==1)?val.c*1:0)});
                                }
                            });
                            $t.getSHTypeCount = getSHTypeCount;

                            $t.pageNu++;
                            $t.$m.antc.calculatePayDay();
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


import * as jDB from "../../../JsonInterface/db";
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
    Jobj?:jObjM,
}

/** 單據記錄 */
interface prCtr extends jDB.payRecord
{
    /** 開關明細(us view) false=未打開 */
    open:boolean,
    /** 活動 */
    ac:jDB.ActivityIn,
    /** 活動base 64 圖片 */
    acimg:string,
    /** 改變單據狀態 input container */
    dealType:string|"--",
    /** 改變單據狀態 備註 input container */
    dealMark:string|"",
    /** 廢單備註 */
    displayMark:string|"",
    /** 個資 */
    perInfo:jDB.Personal,
    /** 聯絡人 */
    amesInfo:jDB.AMes,
    /** 住址 */
    adrInfo:jDB.Address
}

/** login */
let Login:pub.Login;
/** temp this */
let $t:any;
/** 入口點init project */
let mt:pub.mainTemp;
/** class this */
let self:main;
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    constructor($tObj:any) {
        $t = $tObj;
        mt = $t.mainTemp;
        self = this;
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

    /** 歷史資訊 container載入 */
    historyInit=()=>
    {
        $t.statusfilter = pub.payStatusCT();
        $t.typefilter = pub.payTypeCT();
        self.payhistory(true);
    }
    
    /**
     * 歷史明細
    */
    detail=(val:jDB.payRecord,fun:Function)=>
    {
        Login((x)=>x.post("/mpay/mb/pay/historydetail").input({prkey:val.key}),(e2:any)=>{
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                fun(e2.data);
            }
            else
            {
                mt.viewAlert($t.main.pub.config.get("error").svbusy);
            }
        });
    }

    /** 載入單據資訊個資/聯絡人/寄件地址 */
    private payinfo=(keyAry:Array<string>)=>
    {
        if(keyAry.length>0)
        {
            Login((x)=>x.post("/mpay/mb/pay/perinfo").input({keyary:JSON.stringify(keyAry)}),(e)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    $t.history.forEach((val:prCtr,nu:number)=>
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
                }
                else
                {
                    mt.viewAlert($t.main.pub.config.get("error").svbusy);
                }
            });
        }
    }

    /**
     * 支付明細-list 
     * @param init 是否初始化(true=初始化)
    */
    payhistory=(init:boolean)=>
    {  
        $e.pb.v($t, "pagetool").async((e:pub.pageTool)=>{//Page Number bar
            if($t.load && e.pageNu>-1 || init)
            {
                if(init){//初始化
                    $t.history = [] as Array<prCtr>;//清空
                    $t.pageTagetNu = -1;
                    e.pageNu = 0;
                }

                $t.load=false;

                Login((x)=>x.post("/mpay/mb/pay/history").input({page:e.pageNu}),(e3)=>{
                    if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        e.runAction = ()=>{
                            self.payhistory(false); 
                        };

                        if($t.pageTagetNu != e.pageNu ||  e.pageCount != e3.pageCount)
                        {//insert
                            /** get key 取 info 個資/聯絡人/寄件住址 */
                            let getKeyAry:Array<string> = [];
                            e3.data.forEach((val:prCtr,nu:number)=>
                            {
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

                                val.open=false;//開關明細(us view)
                                val.dealType="--";//改變單據狀態 input container
                                val.dealMark="";////改變單據狀態 備註 input container
                                val.displayMark ="";//廢單備註
                                val.acimg = "";
                                val.ac = ({ "titleAry":[] }) as any;
                                if(val.akey!=null)
                                {
                                    Login((x)=>x.post("/ac/main/doc").input({key:val.akey}),(e3)=>{
                                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                        {
                                            val.ac=e3.data;
                                            for(let a=val.ac.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                            {//填空語系 位置
                                                val.ac.titleAry.push("");
                                            }
                                            if(e3.data.imgAry.length>0){
                                                /** load 活動Img */
                                                let img:jObjM =  new ($e.Jobj as any)();//宣告img容器
                                                img.loadimgjson("/ac/pdimg/"+val.akey)//載入圖片
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
                            $t.history=e3.data as Array<prCtr>;
                        }
                        else
                        {//update
                            $t.history.forEach((val:prCtr,nu:number)=>{
                                e3.data.forEach((val2:prCtr,nu2:number)=>{
                                    if(val.key == val2.key){
                                        val.display = val2.display;
                                        val.status = val2.status;
                                        val.type = val2.type;
                                        val.payDate = val2.payDate;
                                        val.mark = val2.mark;
                                    }
                                });
                            });
                        }

                        $t.pageTagetNu = e.pageNu;//取得當前頁碼 flag
                        e.pageCount = e3.pageCount;
                    }
                    else
                    {
                        mt.viewAlert($t.main.pub.config.get("error").svbusy);
                    }
                    $t.load=true;
                });
            }
            else
            {//防止多點
                e.pageNu = $t.pageTagetNu;//變動回去原頁碼
            }
        });
    };
};


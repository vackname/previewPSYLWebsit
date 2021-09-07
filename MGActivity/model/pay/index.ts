import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import * as pE from "../../model/pubExtendCtr";
import doc from "../../../JsonInterface/doc";
/** Qrcode model */
import QRCodeM from "../../../models/qrcode/interface";

/** post 選入商品 */
interface poPostCtr extends jDB.PayOptions
{
    /** 套餐項目設定 object pE.pSetFormat to string json*/
    setdata:string,
}

/** temp this */
let $t:any | undefined;
/** load file  */
let Jobj:jObjM;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 文章載入內容共用 */
let docload:doc;
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
        docload = new doc($tObj,$eObj);
    }

    /** create qr Code */
    getQurCode=(val:pE.acCtr)=>
    {
        if(val.QR==null)
        {
            let qr:QRCodeM = new (eval("QRCode") as QRCodeM)(pb.el.id("acqr"+val.key).get,{
                width:200,
                height:200,
            });
            qr.makeCode(this.getUrl(val));
            val.QR = qr;
        }
    }

    /** 取出網址 */
    getUrl=(val:pE.acCtr)=>window.location.protocol.split(':')[0]+"://"+window.location.host+"/u/"+jEnum.Enum_docType.Ativity+"/"+val.key;

    /** 載入寄件運費計算 */
    adrFee = ()=>
    {
        $t.getShFormat ="";
        $t.shFee = 0;
        Login((x)=> x.post(((mt.SysLevel() || mt.editLevel())?"/mpay/mg/mb/pay/shser":"/mpay/mb/pay/shser")).input({country:$t.adr.country,city:$t.adr.city}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.getAdrfeeList = obj.data as Array<jDB.shipingAddressFee>;
            }
        });
    }

    /** 取寄送時段 */
    getDtime=()=>pub.dTimeCT();

        /** 開起page 形式 */
    toPage=(key:string,tp:number)=>
    //前往開另外頁面形態
        docload.getLabel({  
            path: key,
            tp : tp,
            show:false,
            content:null
        } as pub.markPathCtr,'','',0);

    /** 支付銀行圖片 */
    bankImg=(img:jObjM,bank:number)=>pub.bankImg(img,bank);

    /** 前往支付 
     * @param payOK 繼承 init pay之取結帳訊息或轉至支付端
    */
    pay=(bank:string,payOK:(e:jDB.payRecord,repoint:number,toUrl:string,)=>void)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                if(bank!="")
                {
                    let objGet:pE.acCtr = $t.data;
                    let per:pE.perCtr = $t.perData;
                    let ames:jDB.AMes = $t.ames;
                    let adr:jDB.Address = $t.adr;
                    $t.inLoad = false;

                    /** 加購 送單集合 */
                    let option:Array<jDB.PayOptions> =[];
                    objGet.pdataAry.forEach((val,nu)=>
                    {//加購重組清單
                        if(val.count>0)
                        {
                            option.push({pkey:val.key,count:val.count ,setdata:JSON.stringify({add:[] as Array<Array<jDB.payItem>>,del:[] as Array<Array<jDB.payItem>>})  as string} as poPostCtr);
                        }
                    });

                    let postData = {akey:objGet.key,umark:objGet.usermark,bank:bank,
                        payoption:JSON.stringify(option)};
                    if(objGet.peCK)
                    {
                        pb.AddPrototype(postData,{"getper":JSON.stringify(per)});
                    }

                    if(objGet.amCK)
                    {
                        pb.AddPrototype(postData,{"getames":JSON.stringify(ames)});
                    }

                    if(objGet.adrCk && !objGet.adrnow)
                    {
                        pb.AddPrototype(postData,{"getadr":JSON.stringify(adr)});
                        pb.AddPrototype(postData,{"adrnow":false});
                    }
                    else
                    {//現場取貨
                        pb.AddPrototype(postData,{"adrnow":true});
                    }

                    pb.AddPrototype(postData,{"atvimg":((objGet.imgAry.length>0)?objGet.imgAry[0]:"")});//圖片名
                
                    
                    Login((x)=> x.post("/mpay/mb/pay/from").input(postData), (obj)=> 
                    {
                        if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                        {
                            $t.returnList();//反回報名頁
                            payOK(obj.data,obj.repoint,obj.topage);
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.ExistData)
                        {//已報名
                            mt.ViewAlertAtClose($t.getLang('error').re,null,3,((objGet.objImg!=null)?objGet.objImg.src(((objGet.imgAry.length>0)?objGet.imgAry[0]:null) as any):null) as any);
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                        {//已額滿
                            mt.ViewAlertAtClose($t.getLang('error').full,null,3,((objGet.objImg!=null)?objGet.objImg.src(((objGet.imgAry.length>0)?objGet.imgAry[0]:null) as any):null) as any);
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.notpointError)
                        {//點數不足
                            mt.ViewAlertAtClose($t.main.pub.config.get("error").notpoint,null,3,$t.main.pub.lib.src('coin.png'));
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.prdocutSizeError)
                        {//運費異常
                            mt.viewAlert("error!(code:-125)",()=>{},$t.main.pub.lib.src('sh.png'));
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                        {//加購商品數量不足禁用
                            /** 庫存限制 */
                            if(obj.datacount!=undefined)
                            {
                                ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                {
                                    (obj.datacount as Array<jDB.PayOptions>).forEach((val1,nu1)=>{
                                        if(val1.pkey==val.key)
                                        {
                                            val.errorCount = true;
                                        }
                                    });
                                });
                            }

                            /** 狀態限制 */
                            if(obj.typeLimit!=undefined)
                            {
                                ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                {
                                    (obj.datacount as Array<jDB.PayOptions>).forEach((val1,nu1)=>{
                                        if(val1.pkey==val.key)
                                        {
                                            val.error = true;
                                        }
                                    });
                                });
                            }

                            mt.viewAlert($t.getLangPay("cannot"),()=>{},$t.main.pub.lib.src('cancel.png'));
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        $t.inLoad = true;
                    });
                }
                else
                {//未選支付方式
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").choosepay,()=>{},$t.main.pub.lib.src('cancel.png'));
                }
            }
        });
    }

    /** 年齡限制運算 */
    ageLimit =()=>
    {
        let obj:pE.acCtr = $t.data;
        let per:pE.perCtr = $t.perData;
        if(per.inputY>0&&per.inputM>0&& per.inputD>0 && obj.peCK)
        {
            per.birthday = ((per.inputY>0&&per.inputM>0&& per.inputD>0)?pb.unixRe(((Number(per.inputY)+100)+"-"+per.inputM+"-"+per.inputD+" 00:00:00")):0);
            //年齡 +100年 防止 1970異常
            var time = pb.reunixDate(pb.unixReNow()).split('/');
            /** 現在年齡 */
            let nowAge:number= Math.ceil(Number(time[0])-Number(per.inputY));
        
            return ((obj.ageM>0 && obj.ageX>0)?obj.ageM<=nowAge && obj.ageX>=nowAge:((obj.ageM>0 && obj.ageX==0)?obj.ageM<=nowAge:((obj.ageM=0 && obj.ageX>0)?obj.ageX>=nowAge:true)));
        }
        else
        {
            return ((!obj.peCK)?true:false);
        }
    }

    /** 個資驗證通過 */
    perCk=()=>
    {
        let obj:pE.acCtr = $t.data;
        let per:pE.perCtr = $t.perData;
        return (!obj.peCK || (obj.peCK && per.inputY!=0 && per.inputM!=0 && per.inputD!=0 && per.name!='' && per.id!=''&& ( per.phone.length>5 || per.tel.length>5)));
    }
    /** 聯絡人驗證通過 */
    amesCk=()=>
    {
        let obj:pE.acCtr = $t.data;
        let ames:jDB.AMes = $t.ames;
        return (!obj.amCK || (obj.amCK && ames.name !='' && ames.title!='' && ( ames.phone.length>5 || ames.tel.length>5)));
    }

    /** 寄件人驗證通過 */
    adrCk=()=>
    {
        let obj:pE.acCtr = $t.data;
        let adr:jDB.Address = $t.adr;
        return (!obj.adrCk  || obj.adrCk && (adr.name!='' && adr.city !='-' && adr.area!='-' && adr.address.length>5 && (adr.phone.length>5 || adr.tel.length>5))) || obj.adrnow;
    }

    /** 載入個資 */
    loadPer = ()=>
    {
        Login((x)=> x.post("/ma/mg/mbinfo/myper"), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.$an.main.sysYearDate(obj.data);//載入生日選擇器
                $t.perData = obj.data as pE.perCtr;

            }else
            {
                $t.$an.main.sysYearDate($t.perData);//載入生日選擇器
            }
            
        });
    }

    /** 載入聯絡人 */
    loadAmes = ()=>
    {
        Login((x)=> x.post("/ma/mg/mbinfo/myames"), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.ames = obj.data as jDB.AMes;
            }
        });
    }    

    /** 載入寄件資料 */
    loadAdr = ()=>
    {
        Login((x)=> x.post("/ma/mg/mbinfo/myadr"), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.adr = obj.data as jDB.Address;
            }
        });
    }    

    /** 載入簡章/初始化
     * @param init 初始化
     */
    catchDoc = (acObj:pE.acCtr,init:boolean)=>
    {
        if(mt.NormalLevel() || mt.SysLevel() || mt.editLevel())
        {//載入權限
            acObj.langLoad.push(($t.main as pub.main).pub.langNu);
            Login((x)=> x.post(((mt.SysLevel() || mt.editLevel())?"/ac/mg/doc/content":"/ac/main/docread")).input({key:acObj.key,nu:($t.main as pub.main).pub.langNu}), (obj)=> 
            {//取圖片
                if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                {
                    acObj.descriptionAry[($t.main as pub.main).pub.langNu] = obj.data;
                    if(init)
                    {
                        $t.stepMark=[];//初始化註冊step
                        if(obj.data!="")
                        {//簡章內容確認
                            $t.stepMark.push('ck');//簡章step
                            $t.ckAgree=false;
                        }
                        else
                        {
                            $t.ckAgree=true;
                        }

                        if(acObj.peCK)
                        {//取個資
                            $t.stepMark.push('info');//個資 step
                        }
            
                        if(acObj.amCK)
                        {//取聯絡人
                            $t.stepMark.push('cinfo');//關系人step
                        }
            
                        if(acObj.adrCk)
                        {//取寄件地址
                            $t.stepMark.push('addr');//寄件住址step
                        }
            
                        acObj.pdataAry=[];
                        $t.stepMark.push('pay');//支付step
                    }

                    /** 重建艒章 */
                    let getNewAry:Array<string> = [];
                    acObj.descriptionAry.forEach((val,nu)=>
                    {
                        getNewAry.push(val);
                    });

                    acObj.descriptionAry = [];
                    acObj.descriptionAry = getNewAry;
                }
                else
                {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
                
            });
        }
    }
    

    /** 單載 */
    readDoc = ()=>
    {
        Login((x)=>x.post(((mt.SysLevel() || mt.editLevel())?"/ac/mg/doc/docread":"/ac/main/doc"))
        .input({key:$t.pj.key}),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                e.data.langLoad =[];
                e.data.adrnow=false;
                e.data.pdataAry=[];
                if(e.data.titleAry.length < ($t.main as pub.main).pub.langAry.length)
                {//補語系位置
                    for(let a=e.data.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                    {
                        e.data.titleAry.push("");
                    }
                }
        
                if(e.data.descriptionAry.length < ($t.main as pub.main).pub.langAry.length)
                {//補語系位置
                    for(let a=e.data.descriptionAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                    {
                        e.data.descriptionAry.push("");
                    }
                }

                e.data.objImg = new (Jobj as any)();
                (e.data as pE.acCtr).objImg//緩儲圖片容器
                .loadimgjson("/ac/pdimg/"+(e.data as pE.acCtr).key)//載入圖片
                .input((e.data as pE.acCtr).imgAry)
                .async((e3,next3)=>
                { 
                    e3.forEach((val3,nu3)=>{
                        $t.$an.loadImg("payMGACInPhoto"+(val3.split('.')[0])+(e.data as pE.acCtr).key,1000);//動畫
                    });
                    self.catchDoc($t.data,true);//載入簡章/初始化
                    /** 匹次載圖 */
                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                    {       
                        /** 重建圖層更新 get set */
                        let reImgAry:Array<string> = [];
                        (e.data as pE.acCtr).imgAry.forEach((val3,nu2)=>{
                            reImgAry.push(val3);
                        });
                        (e.data as pE.acCtr).imgAry = reImgAry;
                        //圖片載入完成 imglist
                        if(re!=null)
                        {
                            re((e4,next4)=>
                            {
                                e4.forEach((val3,nu3)=>{
                                    $t.$an.loadImg("payMGACInPhoto"+(val3.split('.')[0])+(e.data as pE.acCtr).key,1000);//動畫
                                });
                                reNext(next4);
                            });
                        }
                    }
                    reNext(next3);
                });
                e.data.QR = null;
                $t.data = e.data;
            }
            else
            {
                if($t.pj.OutInto || mt.gotoTagBag)
                {//透過 tag 進入
                    $t.returnList();
                    mt.viewAlert( $t.main.pub.config.get("error").stopdoc,()=>{},$t.main.pub.lib.src('mbOff.png'));
                }
                else
                {
                    mt.viewAlert($t.main.pub.config.get("error").svbusy);
                }
            }
        });
    }

};
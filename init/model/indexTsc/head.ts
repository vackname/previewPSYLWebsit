import ajaxM from "../../../models/ajax";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import doc from "../../../JsonInterface/doc";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** load file、document */
let Jobj:jObjM;
/** class this */
let self:model;
/** 文章載入內容共用 */
let docload:doc;
/** headTemp */
let HeadTemp:pub.mainHeadTemp;
import urlsetM from "./head/urlSet";
/** head banner temp */
export default class model
{
    /** post system roject連接路徑 */
    psys:any|undefined;
    /** 採踩Project連接路徑 */
    ncc:any|undefined;
    /** 新聞媒體Project連接路徑 */
    ns:any|undefined;
    /** 商城Project連接路徑 */
    pc:any|undefined;
    /** 入口首頁Project連接路徑 */
    tur:any|undefined;
    /** 活動報名 */
    ac:any|undefined;
    /** 後台管理Project連接路徑 */
    MG:any|undefined;
    /** 設定連結路徑 */
    urlset:urlsetM|undefined;
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        self = this;
        $t.login.img = new (Jobj as any)();//宣告img容器
    }

    toInit =($eObj:any)=>{
        pb.v($t,"head_temp").async((e:pub.mainHeadTemp)=>
        {//初始化載入
            HeadTemp = e;
            HeadTemp.mbLevelNameList = pub.leveNameDataCT();//注入會員等級level
            ($t.login.img as jObjM).loadlib("login",(eimg)=>
            {//載入login img
                if(pb.LogingetCookie("mbidtoken")!=null)
                {//cookie 重登
                    $t.loginopen = true;
                    self.Login(x=>x.post("/mb/ac/mbdata"), (obj)=>
                    {//重取登入資訊
                        if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null && (HeadTemp.NormalLevel() ||  HeadTemp.SysLevel() ||  HeadTemp.editLevel() ) )
                        {
                            (HeadTemp as any).mainTemp.$m.t.serList();//讀取標籤內容
                        }
                        $t.loadPJVue = true;//登入後載入專案
                    });
                }
                else
                {
                    if($t.$m.line.Login(()=>{//line 驗證登入
                        $t.loadPJVue = true;//登入後載入專案
                    }))
                    {
                        if($t.$m.fb.Login(()=>{//facebook
                            $t.loadPJVue = true;//登入後載入專案
                        }))
                        {
                            if($t.$m.github.Login(()=>{//github
                                $t.loadPJVue = true;//登入後載入專案
                            }))
                            {
                                $t.loadPJVue = true;//登入後載入專案
                            }
                        }
                    }
                }
            });
            
            self. urlset = new  urlsetM($t,$eObj,e);
            self.psys = self.urlset.psys;
            self.ncc = self.urlset.ncc;
            self.ns = self.urlset.ns;
            self.pc = self.urlset.pc;
            self.ac = self.urlset.ac;
            self.tur = self.urlset.tur;
            self.MG = self.urlset.MG;
            self.urlset?.setPath();


            let spUrl:Array<string> = window.location.pathname.split('/');//取網址
            switch(spUrl[1]){
                case "u"://前往URL
                $t.loadTurnWeb =false;
                pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                {
                    docload = new doc({
                        main:$t.main,
                        mainTemp:(eh as any).mainTemp
                    },$eObj);
                    self.gotoURL();
                });
                break;
            }

            /** 取fb api */
            let nowCatchData:Array<string> = spUrl[spUrl.length-1].split('?');
            let wait = ()=>{
                if($t.loadPJVue)
                {
                    //設定網址式指定Page
                    switch(nowCatchData[0].toLowerCase())
                    {
                        case "author"://作者
                            self.urlset?.openAuthor();
                        break;
                        case "about"://關於我
                            self.tur.goabout();
                        break;
                        case "mys"://服務條款
                            //self.tur.goservice();
                        //break;
                        case "myp"://隱私政策
                            self.tur.goprivate();
                        break;
                        case "linepay"://line pay
                            self.payok(jEnum.Enum_bankSuport.linePay,nowCatchData[1]);
                        break;
                        case "cancelline"://取消line pay
                            self.payCancel(jEnum.Enum_bankSuport.linePay,nowCatchData[1]);
                        break;
                    }
                }
                else
                {
                    setTimeout(()=>{
                        wait();
                    },100);
                }
            }
            wait();
        });
        setTimeout(()=>
        {//未載入首頁重新再次載入
            pb.v($t,"head_temp").async((headObj:pub.mainHeadTemp)=>
            {
                if(headObj.MenuList.length==0)
                {
                    console.log("reload system");
                    self.toInit($eObj);
                }
            });
        },3000);
    }

    /** 前往URL */
    private gotoURL=()=>
    {
        let wait = ()=>{
            if($t.loadPJVue){
                let spUrl:Array<string> = window.location.pathname.split('/');//取網址
                if(spUrl.length>=3)
                {
                    try
                    {
                        let tp:number = Number(spUrl[2]);
                        let path:string = spUrl[3];
                        if(tp== jEnum.Enum_docType.Ativity)
                        {//進入活動 搜尋
                            self.ac.GoIndex();
                            pb.v($t,"MGActivity").async((toObj)=>
                            {
                                pb.v(toObj,"AcVue").async((toObj2)=>{
                                    toObj2.ser = path;
                                    let wait = ()=>{
                                        if( toObj2.$m!=null){
                                            toObj2.$m.main.serData(true);//搜尋
                                        }else
                                        {
                                            setTimeout(()=>{ wait(); },100)
                                        }
                                    }
                                    wait();
                                });
                            });
                        }
                        
                        if(tp == jEnum.Enum_docType.pcar)
                        {//直接開分頁
                            docload.getLabel({  
                                path: path,
                                tp : tp,
                                show:false,
                                content:null
                            } as pub.markPathCtr,'','',0);
                        }
                        else
                        {
                            $t.loadTurnWeb =true;
                            $t.NuView = pE.enum_pag.first;
                            pb.v($t,'turnweb').async((e)=>
                            {
                                e.VueName = "index";
                                pb.v($t,"head_temp").async((he:pub.mainHeadTemp)=>
                                {
                                    he.targetPageName = "doctag";
                                    he.firstHome = true;//是否顯示home鈕
                                    ($t.main as pub.main).page= he.targetPageName;//head title name
                                });
                                pb.v(e,"index").async((e2)=>
                                {
                                    e2.openDoc = true;
                                    pb.v(e2,"docVue").async((e3)=>
                                    {
                                        if(e3.tag.path != path || e3.tag.tp != tp)
                                        {
                         
                                            e3.tag.path = path;
                                            e3.tag.tp = tp;
                                            e3.tag.show = false;
                                            e3.tag.content = null;
                                            e3.main$m.$m.main.getLabel(e3.tag,'','',0);
                                        }
                                    });
                                });
                            });
                        }
                    }catch(e)
                    {
                        
                    }
                }
            }
            else
            {
                setTimeout(()=>{
                    wait();
                },100);
            }
        }
        wait();
    }

    /** 支付成功
      * @param 銀行
     * @param 帳單序號
     */
    private payok=(payTp:jEnum.Enum_bankSuport,oder:string)=>
    {
        let getObj:Array<string> = oder.split('&');
        let getOder:string="";//取訂單號
        getObj.forEach((val,nu)=>{
            let getSp:Array<string> = val.split('=');
            if(getSp[0]=="oder")
            {
                getOder = getSp[1];
            }
        });

        if(getOder!="")
        {
            let img:jObjM =  new (Jobj as any)();//宣告img容器
            img.loadlib("bank",function(e){//載入img
                ($t as pub.mainTemp).viewAlert("Verification/驗證中...",()=>{},pub.bankImg(img,payTp));
                self.Login(aj=> aj.post("/mpay/mb/linepay/"+getOder),(obj)=>
                {
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        let getPR:jDB.payRecord = (obj.data as jDB.payRecord);
                        let getMes:string="";
                        switch(getPR.status)
                        {
                            case jEnum.Enum_payStatus.complete:
                                getMes+="Oder No.:"+getOder+"<br/>OK/支付成功!!";
                                break;
                            case jEnum.Enum_payStatus.fail:
                                getMes+="Oder No.:"+getOder+"<br/>Fail/支付失敗!!";
                                break;
                            case jEnum.Enum_payStatus.cancel:
                                getMes+="Oder No.:"+getOder+"<br/>Cancel of payment/終止支付!!";
                                break;
                        }
                        ($t as pub.mainTemp).ViewAlertAtClose(getMes,()=>
                        {
                            if($t.head.singCK)
                            {//登入狀態轉至歷史頁
                                $t.$m.h.tur.gourlPay();
                            }
                        },8,pub.bankImg(img,payTp));
                    }
                    else
                    {
                        ($t as pub.mainTemp).viewAlert($t.main.pub.config.get("error").svbusy,()=>{},pub.bankImg(img,payTp));
                    }
                });
            });
        }
        else
        {//異常進入
            ($t as pub.mainTemp).viewAlert("fail!!Verification/驗證失敗",()=>{},($t.main as pub.main).pub.lib.src("mbOff.png"));
        }
    }

    /** 支付取消
     * @param 銀行
     * @param 帳單序號
    */
    private payCancel=(payTp:jEnum.Enum_bankSuport,oder:string)=>
    {
        let img:jObjM =  new (Jobj as any)();//宣告img容器
        img.loadlib("bank",function(e){//載入img
            ($t as pub.mainTemp).ViewAlertAtClose("Pay:"+((oder.indexOf("oder=")==0)?oder.split("=")[1]:"-")+"<br/>Cancel/取消!!",()=>
            {
                eval("document").location.href = "http://"+window.location.host;//重整頁面
            },8,pub.bankImg(img,payTp));
        });
    }


    /** page頁Change
     * @param page pE.enum_pag
     * @param pj pj name
     */
    ChangePj=(page:pE.enum_pag,pj:string)=>
    {
        $t.showTagBag = false;//關閉背包

        /** 等候temp create 
         * //透過 loadMark get set data bind 觸發更新
        */
        let waitPJ:Function=()=>
        {
            if($t.v[pj]==pj){
                if($t.loadMark.indexOf(pj)==-1)
                {
                    $t.loadMark.push(pj);//已緩存mark
                }
            }
            else
            {
                setTimeout(()=>{
                    waitPJ();
                },10);
            }
        }
         waitPJ();
        
        $t.NuView = page;
    }

    /** ogin AJAX (API core)
     * @param e ajax set type
     * @param funobj ajax wait action function(ajax catch response)
     */
    Login=(gx:(e:pub.ajax)=>any,funobj:(e:any)=>void)=>
    {
        /** 組建 閉包Login ajax */
        let getAjax:()=> pub.asyncGet = ()=> gx({
                post:(url:string)=>ajax.postToken(url)
                ,
                file:(url:string)=>ajax.fileToken(url)
                ,
            } as pub.ajax);
        
        $t.loginopen=true;
        pb.v($t,"login").async((e)=>{
            if(!e.catchload)
            {//等後 login temp load complete
                let runAjax:pub.ajaxFun = {ajax: getAjax,fun:funobj};
                $t.$m.l.ajaxAry.push(runAjax);//排程ajax add
                pb.v($t,"head_temp").async((e:pub.mainHeadTemp)=>{
                    if(e.load==0)
                    {
                        $t.$m.l.waitLogin();
                        setTimeout(()=>{
                            e.$an.headInit();//初始化for載入動畫
                        },100);
                    }
                });
            }
            else
            {
                setTimeout(()=>{             
                    self.Login(getAjax,funobj);
                },20);
            }
        });
    }

    /** 檔頭取登入資料(token)
     * @param token psyl token
     * @param r 是否更新token
     */
    getMBData=(token:string,r:boolean)=>
    {
        if(r==null || r == undefined)
        {
            r=false;
        }
        var tokenMB = pb.tokenToJson(token);
        HeadTemp.mbdata.iat = tokenMB.iat;
        HeadTemp.mbdata.name = tokenMB.mb.name;
        HeadTemp.mbdata.account = tokenMB.mb.mbid;
        HeadTemp.mbdata.uid = tokenMB.mb.uid;
        HeadTemp.mbdata.get = tokenMB.get;
        HeadTemp.mbdata.level = tokenMB.mb.level;
        HeadTemp.mbdata.tp = tokenMB.mb.tp;
        HeadTemp.mbdata.profit = tokenMB.mb.profit;

        $t.head.singCK=true;//同步
        $t.head.mbdatad=HeadTemp.mbdata;
        
        if(HeadTemp.NormalLevel())
        {//僅管理者額度 期數
            if(!r)
            {//first 欄位 get set 建置
                HeadTemp.mbdata.status = "";
            }

            if(HeadTemp.nowIncon ==-0.00369 || r )
            {
                if(HeadTemp.nowIncon == -0.00369)
                {//初始化才檢查取 localStorage
                    try
                    {//暫存
                        if(localStorage.getItem("psylpoint")!=null)
                        {//直接注入

                            HeadTemp.nowIncon = Number(localStorage.getItem("psylpoint"));
                            HeadTemp.oldIncon = HeadTemp.nowIncon;
                            let getStatus:Array<string> = tokenMB.status.split("#");
                            tokenMB.status = HeadTemp.nowIncon;
                            getStatus.forEach((val,nu)=>{
                                if(nu!=0)
                                {
                                    tokenMB.status += "#"+val;
                                }
                            });
                            HeadTemp.mbdata.status = tokenMB.status;
                        }
                        else
                        {
                            HeadTemp.nowIncon = Number(tokenMB.status.split("#")[0]);
                            HeadTemp.oldIncon = HeadTemp.nowIncon;
                            HeadTemp.mbdata.status = tokenMB.status;
                        }
                    }
                    catch(e)
                    {
                        HeadTemp.nowIncon = Number(tokenMB.status.split("#")[0]);
                        HeadTemp.oldIncon = HeadTemp.nowIncon;
                        HeadTemp.mbdata.status = tokenMB.status;
                    }
                }
                else
                {//token 資訊完成同步
                    pb.v($t,"head_temp").async((e:pub.mainHeadTemp)=>
                    {
                        e.$an.pointAddDes(HeadTemp.nowIncon-HeadTemp.oldIncon,()=>
                        {
                            HeadTemp.oldIncon = HeadTemp.nowIncon;
                            let getStatus:Array<string> = tokenMB.status.split("#");
                            tokenMB.status = HeadTemp.nowIncon;
                            getStatus.forEach((val,nu)=>{
                                if(nu!=0)
                                {
                                    tokenMB.status += "#"+val;
                                }
                            });
                            HeadTemp.mbdata.status = tokenMB.status;
                        });//point 動畫
                    });
                }
            }
            else
            {//重取值(不理會token 資訊)
                let getStatus:Array<string> = tokenMB.status.split("#");
                tokenMB.status = HeadTemp.nowIncon;
                getStatus.forEach((val,nu)=>{
                    if(nu!=0)
                    {
                        tokenMB.status += "#"+val;
                    }
                });
                HeadTemp.mbdata.status = tokenMB.status;

                pb.v($t,"head_temp").async((e:pub.mainHeadTemp)=>
                {
                    e.$an.pointAddDes(HeadTemp.nowIncon-HeadTemp.oldIncon,()=>{
                        HeadTemp.oldIncon = Number(tokenMB.status.split("#")[0]);
                        HeadTemp.mbdata.status = tokenMB.status;//後更新
                    });//point 動畫
                });
            }
        }
        else
        {
            HeadTemp.mbdata.status = tokenMB.status;
        }

        if(tokenMB.mb.mg!="" && !tokenMB.mb.ck)
        {
            $t.viewConfirm(tokenMB.mb.mg+" 分享資源給您！是否同意與此帳號綁定？",()=>
            {
                self.Login(x=>x.post("/mb/ac/client/bind"),(e2)=>{
                    if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                        $t.ViewAlertAtClose("已成功綁定！",null,3);
                    }
                });
            },()=>{
                self.Login(x=>x.post("/mb/ac/client/bindcancel"),(e2)=>{
                    if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                        $t.ViewAlertAtClose("取消邀請失敗！",null,3);
                    }
                });
            });
        }
    };
};
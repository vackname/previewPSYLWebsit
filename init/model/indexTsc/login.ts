import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/** temp this */
let $t:pub.mainTemp;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** 登入系統 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
    }

    /** 登出倒數 */
    private timeoutSin=0;
    openView= ()=>{
        pb.v($t,"login").async((le)=>
        {
            le.open = !le.open;
            le.indPwd =false;//圍原為登入模式
            if(le.open){
                self.catchCode();
            }
            le.meLogin = false;//關閉ME登入模式
        });
    };
    
    /** 驗證碼 */
    catchCode = ()=>{
        pb.v($t,"login").async((le)=>
        {
            ajax.postToken("/login")
            .input({
                g: 369
            })
            .async(function (e) {
                le.code = e;
            });
        });
    };
    
    /** 倒數登出-init */
    private countdownLogout:boolean=false;
    /** 開始計算登出時間 */
    private startTimeout = ()=>
    {
        if(!this.countdownLogout)
        {
            this.countdownLogout=true;
            setTimeout(()=>
            {//緩偵聽
                this.startTimeout_run();
            },300);
        }
    }
    /* 倒數登出-countdown start */
    private startTimeout_run = ()=>
    {
        if( self.timeoutSin>=pb.unixReNow() || self.timeoutSin==0)
        {    
            setTimeout(function(){
                self.startTimeout_run();
            },999);
        }
        else
        {
            self.countdownLogout=false;
            if($t.head.mbdata.tp==jEnum.Enum_LoginTp.sys)
            {
                self.singOutMember(-9999);
            }
            else
            {
                /** 目前登入所屬 */
                switch(Number($t.head.mbdata.tp))
                {
                    case jEnum.Enum_LoginTp.gid://gmail
                        $t.$m.g.LogOut(()=>{
                            self.singOutMember(-9999);
                        });
                    break;
                    case jEnum.Enum_LoginTp.fbid://facebook
                        $t.$m.fb.LogOut(()=>{
                            self.singOutMember(-9999);
                        });
                    break;
                    case jEnum.Enum_LoginTp.github://github
                        $t.$m.github.LogOut(()=>{
                            self.singOutMember(-9999);
                        });
                    break;
                    case jEnum.Enum_LoginTp.lineid://line
                        $t.$m.line.LogOut(()=>{
                            self.singOutMember(-9999);
                        });
                    break;
                }
            }
        }
    }
    
    /** 找回密碼 */
    findPassword=()=>
    {
        pb.v($t,"login").async((le)=>{
            let input:pub.loginInput = le.input;
            if(le.input.id!="" && le.input.code != "" )
            {
                le.load=true;
                le.$an.LoginRun();//動畫特效
                le.mailfun = true;
                ajax
                .postToken("/jsonapi/repassword").input({mbid:input.id,code:input.code})
                .async((e)=>{
                    var obj = JSON.parse(e);
                    if(Number(obj.error)==jEnum.Enum_SystemErrorCode.VerifyError){
                        $t.ViewAlertAtClose($t.main.pub.config.get("error").Verification);
                    }else if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null){
                        le.findPwd = false;
                        $t.ViewAlertAtClose($t.main.pub.config.get("error").sendmail+"("+obj.mail+")");
                    }else{
                        $t.ViewAlertAtClose($t.main.pub.config.get("error").svbusy);
                    }
                    self.catchCode();//重取驗證碼
                    input.code = "";
                    le.mailfun = false;
                    le.load=false;
                });
            }else{
                $t.ViewAlertAtClose($t.main.pub.config.get("error").errorInputLogin);
            }
        });
    }

    /** Line登入(server) */
    LineLoginOauto = (code:string,state:string,fu:Function)=>
    {
        $t.loginopen = true;
        pb.v($t,"login").async((le)=>
        {
            le.load=true;
            if(le.$an!=null)
            {
                le.$an.LoginRun();//動畫特效
                ajax.postToken("/jsonapi/linesingin")
                .input({code:code,state:state})
                .async((e)=>{
                    let obj:any = JSON.parse(e);
    
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                        {
                            $t.$m.h.getMBData(obj.token);
                           // $t.$m.h.tur.gourlIndex();
                            eh.singCK = true;
                            eh.headopen = false;
                            if(self.timeoutSin==0){
                                self.startTimeout();
                            };
                            self.timeoutSin= (eh.mbdata as pub.loginMB).iat + 20 * 60;//設定登出時間

                        
                            pb.LogindoCookieSetup("mbidtoken",obj.token,20 * 60);
                            pb.LogindoCookieSetup("jwtheadtype", "0",20 * 60);//目前cookie 屬於誰之狀態
                            le.open = false;

                            if([jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.normal].indexOf(eh.mbdata.level)>-1)
                            {
                                (eh as any).mainTemp.$m.t.serList();//讀取標籤內容
                            }
                            fu();
                        });
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.MGError)
                    {//驗證帳戶權限
                        $t.viewAlert($t.main.pub.config.get("error").waitLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mb.png"));
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.NotLevel)
                    {//帳戶停權
                        $t.viewAlert($t.main.pub.config.get("error").StopLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mbOff.png"));
                    }
                    else
                    {
                        $t.viewAlert( $t.main.pub.config.get("error").loginFail,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("logout.png"));
                    }
                    le.load=false;
                });
            }
            else
            {
                setTimeout(()=>{
                    self.LineLoginOauto(code,state,fu);
                },100);
            }
        });
    }

    /** gitHub登入(server) */
    gitHubLoginOauto = (code:string,state:string,fu:Function)=>
    {
        $t.loginopen = true;
        pb.v($t,"login").async((le)=>
        {
            le.load=true;
            if(le.$an!=null)
            {
                le.$an.LoginRun();//動畫特效
                ajax.postToken("/jsonapi/githubsingin")
                .input({code:code,state:state})
                .async((e)=>{
                    let obj:any = JSON.parse(e);
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                        {
                            $t.$m.h.getMBData(obj.token);
                           // $t.$m.h.tur.gourlIndex();
                            eh.singCK = true;
                            eh.headopen = false;
                            if(self.timeoutSin==0){
                                self.startTimeout();
                            };
                            self.timeoutSin= (eh.mbdata as pub.loginMB).iat + 20 * 60;//設定登出時間

                            pb.LogindoCookieSetup("mbidtoken",obj.token,20 * 60);
                            pb.LogindoCookieSetup("jwtheadtype", "0",20 * 60);//目前cookie 屬於誰之狀態
                            le.open = false;

                            if([jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.normal].indexOf(eh.mbdata.level)>-1)
                            {
                                (eh as any).mainTemp.$m.t.serList();//讀取標籤內容
                            }
                            fu();
                        });
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.MGError)
                    {//驗證帳戶權限
                        $t.viewAlert($t.main.pub.config.get("error").waitLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mb.png"));
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.NotLevel)
                    {//帳戶停權
                        $t.viewAlert($t.main.pub.config.get("error").StopLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mbOff.png"));
                    }
                    else
                    {
                        $t.viewAlert($t.main.pub.config.get("error").loginFail,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("logout.png"));
                    }
                    le.load=false;
                });
            }
            else
            {
                setTimeout(()=>{
                    self.gitHubLoginOauto(code,state,fu);
                },100);
            }
        });
    }

    /** facebook登入(server) */
    FBLoginOauto = (code:string,state:string,fu:Function)=>
    {
        $t.loginopen = true;
        pb.v($t,"login").async((le)=>
        {
            le.load=true;
            if(le.$an!=null)
            {
                le.$an.LoginRun();//動畫特效
                ajax.postToken("/jsonapi/fbsingin")
                .input({code:code,state:state})
                .async((e)=>{
                    let obj:any = JSON.parse(e);
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                        {
                            $t.$m.h.getMBData(obj.token);
                           // $t.$m.h.tur.gourlIndex();
                            eh.singCK = true;
                            eh.headopen = false;
                            if(self.timeoutSin==0){
                                self.startTimeout();
                            };
                            self.timeoutSin= (eh.mbdata as pub.loginMB).iat + 20 * 60;//設定登出時間

                            pb.LogindoCookieSetup("mbidtoken",obj.token,20 * 60);
                            pb.LogindoCookieSetup("jwtheadtype", "0",20 * 60);//目前cookie 屬於誰之狀態
                            le.open = false;

                            if([jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.normal].indexOf(eh.mbdata.level)>-1)
                            {
                                (eh as any).mainTemp.$m.t.serList();//讀取標籤內容
                            }
                            fu();
                        });
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.MGError)
                    {//驗證帳戶權限
                        $t.viewAlert($t.main.pub.config.get("error").waitLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mb.png"));
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.NotLevel)
                    {//帳戶停權
                        $t.viewAlert($t.main.pub.config.get("error").StopLogin,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("mbOff.png"));
                    }
                    else
                    {
                        $t.viewAlert($t.main.pub.config.get("error").loginFail,function()
                        {
                            self.singOut();
                        },($t.main as pub.main).pub.lib.src("logout.png"));
                    }
                    le.load=false;
                });
            }
            else
            {
                setTimeout(()=>{
                    self.FBLoginOauto(code,state,fu);
                },100);
            }
        });
    }

    /** gmail 登入(server) */
    GLoginOauto = (idtoken:string)=>
    {
        pb.v($t,"login").async((le)=>
        {
            le.load=true;
            le.$an.LoginRun();//動畫特效
            ajax.postToken("/jsonapi/gsingin")
            .input({idtoken:idtoken})
            .async((e)=>{
                let obj:any = JSON.parse(e);
                if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                    {
                        $t.$m.h.getMBData(obj.token);
                       // $t.$m.h.tur.gourlIndex();
                        eh.singCK = true;
                        eh.headopen = false;
                        if(self.timeoutSin==0){
                            self.startTimeout();
                        };
                        self.timeoutSin= (eh.mbdata as pub.loginMB).iat + 20 * 60;//設定登出時間

                        pb.LogindoCookieSetup("mbidtoken",obj.token,20 * 60);
                        pb.LogindoCookieSetup("jwtheadtype", "0",20 * 60);//目前cookie 屬於誰之狀態
                        le.open = false;

                        if([jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.normal].indexOf(eh.mbdata.level)>-1)
                        {
                            (eh as any).mainTemp.$m.t.serList();//讀取標籤內容
                        }
                    });
                    
                }
                else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.MGError)
                {//驗證帳戶權限
                    $t.viewAlert($t.main.pub.config.get("error").waitLogin,function()
                    {
                        self.singOut();
                    },($t.main as pub.main).pub.lib.src("mb.png"));
                }
                else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.NotLevel)
                {//帳戶停權
                    $t.viewAlert($t.main.pub.config.get("error").StopLogin,function()
                    {
                        self.singOut();
                    },($t.main as pub.main).pub.lib.src("mbOff.png"));
                }
                else
                {
                    $t.viewAlert($t.main.pub.config.get("error").loginFail,function()
                    {
                        self.singOut();
                    },($t.main as pub.main).pub.lib.src("logout.png"));
                }
                le.load=false;
            });
        });
    }

    /** 登入 */
    singIn=()=>
    {
        pb.v($t,"login").async((le)=>
        {
            let input:pub.loginInput = le.input;
            if(input.id!="" && input.pw!="" && input.code != "" ){
                
                le.load=true;
                le.$an.LoginRun();//動畫特效
                /** 帳戶 */
                let inID:string = input.id;
                ajax.postToken("/jsonapi/singin")
                .input(input)
                .async((e)=>{
                    var obj = JSON.parse(e);
                    if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                        {
                            $t.$m.h.getMBData(obj.token);
                            //$t.$m.h.tur.gourlIndex();
                            eh.singCK = true;
                            eh.headopen = false;
                            if(self.timeoutSin==0){
                                self.startTimeout();
                            }
                            self.timeoutSin= (eh.mbdata as pub.loginMB).iat + 20 * 60;//設定登出時間

                            pb.LogindoCookieSetup("mbidtoken",obj.token,20);
                            pb.LogindoCookieSetup("jwtheadtype", "0",20);//目前cookie 屬於誰之狀態
                            le.open = false;

                            if([jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.normal,jEnum.Enum_MBLevel.systemMG,jEnum.Enum_MBLevel.Edit].indexOf(eh.mbdata.level)>-1)
                            {
                                (eh as any).mainTemp.$m.t.serList();//讀取標籤內容
                            }
                        });

                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.MGError)
                    {//帳戶權限驗證中
                        le.open=false;
                        $t.viewAlert($t.main.pub.config.get("error").waitLogin,function()
                        {
                            self.catchCode();
                            le.open=true;
                        },($t.main as pub.main).pub.lib.src("mb.png"));
                    }
                    else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.NotLevel)
                    {//帳戶停權
                        $t.viewAlert($t.main.pub.config.get("error").StopLogin,function()
                        {
                            self.catchCode();
                            le.open=true;
                        },($t.main as pub.main).pub.lib.src("mbOff.png"));
                    }
                    else
                    {
                        le.open=false;
                        $t.viewAlert($t.main.pub.config.get("error").loginFail+"<br/>"+$t.main.pub.config.get("error").errorInputLogin,function()
                        {
                            self.catchCode();
                            le.open=true;
                        },($t.main as pub.main).pub.lib.src("logout.png"));
                    }
                    le.load=false;
                });
            
                le.input = {
                    id:inID,
                    pw:"",
                    code:""
                } as pub.loginInput;
                
            }else{
                $t.ViewAlertAtClose($t.main.pub.config.get("error").errorInputLogin);
            }
        });
    }

    /** 記錄已發現維護 api */
    private maintainRecoe=()=>{
        pb.v($t,"head_temp").async((headObj:pub.mainHeadTemp)=>
        {
            if(headObj.maintainList.indexOf(headObj.targetPageName)==-1)
            {
                headObj.maintainList.push(headObj.targetPageName);
            }
        });
    }
    
    /** 防止重覆性登出 */
    private ckLogout:boolean=true;
    /** 登出Vue 資訊 refresh */
    private singOutMember = (error:jEnum.Enum_SystemErrorCode)=>
    {
        if(self.ckLogout)
        {
            /** 驗證 */
            class getOutRuning
            { 
                error:number;
                constructor(er:number) {
                    this.error = er;
                }
                
                fun = ()=>{
                    if(Number(this.error)!=jEnum.Enum_SystemErrorCode.Null)
                    {//已被登出
                        self.ckLogout=false;
                        pb.LogindelCookie("mbidtoken");
                        pb.LogindelCookie("jwtheadtype");
                        eval("document").location.href = "http://"+window.location.host;//重整頁面
                    }
                };
            };

            try
            {//清除暫存 點數
                localStorage.removeItem("psylpoint");
            }
            catch(e)
            {

            }

            if($t.head.mbdata.tp == jEnum.Enum_LoginTp.sys)
            {
                switch(Number(error)){
                    case jEnum.Enum_SystemErrorCode.repairError:
                        self.maintainRecoe();
                        $t.maintain = true;
                        break;
                    case jEnum.Enum_SystemErrorCode.existlogin:
                    case jEnum.Enum_SystemErrorCode.timeout:
                        $t.ViewAlertAtClose("登出/Logout!<br/>(System Check)",new getOutRuning(error).fun,3,($t.main as pub.main).pub.lib.src("logout.png"));
                    break;
                    case jEnum.Enum_SystemErrorCode.Verify:
                    case jEnum.Enum_SystemErrorCode.webNotCookies:
                        $t.ViewAlertAtClose("登出/Logout!<br/>(System Check)",new getOutRuning(error).fun,3,($t.main as pub.main).pub.lib.src("logout.png"));
                    break;
                    case -9999://for 前端代號(vue)
                        $t.ViewAlertAtClose("Time Over 20 Minutes of standby<br/>登出/Logout!",new getOutRuning(error).fun,3,($t.main as pub.main).pub.lib.src("logout.png"));
                        break;
                    default:
                        if(error<jEnum.Enum_SystemErrorCode.fail)
                        {
                            $t.ViewAlertAtClose($t.main.pub.config.get("error").svbusy,new getOutRuning(error).fun);
                        }
                        else
                        {
                            new getOutRuning(error).fun();
                        }
                    break;
                }
            }else if(Number(error)==jEnum.Enum_SystemErrorCode.fail)
            {
                new getOutRuning(error).fun();
            }
            else
            {//自動重登
                switch(Number($t.head.mbdata.tp))
                {//自動重登
                    case jEnum.Enum_LoginTp.gid://gmail
                        $t.$m.g.Login();
                    break;
                    case jEnum.Enum_LoginTp.fbid://facebook
                        $t.$m.fb.Login(()=>{});
                    break;
                    case jEnum.Enum_LoginTp.github://github
                        $t.$m.github.Login(()=>{});
                    break;
                    case jEnum.Enum_LoginTp.lineid://line
                        $t.$m.line.Login(()=>{});
                    break;
                }
                $t.ViewAlertAtClose($t.main.pub.config.get("error").svbusy,null);
            }
        }
    }
    
    /** 登出 */
    singOut=()=>
    {

        ($t.$m.h.Login as pub.Login)(x=>x.post("/jsonapi/singout"),(obj)=>
        {
            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.webNotCookies)
            {//jEnum.Enum_SystemErrorCode.fail 如成功能出則轉fail 登出
                if($t.head.mbdata.tp==jEnum.Enum_LoginTp.sys)
                {
                    self.singOutMember(jEnum.Enum_SystemErrorCode.fail);  
                }
                else
                {
                    /** 目前登入所屬 */
                    switch(Number($t.head.mbdata.tp))
                    {
                        case jEnum.Enum_LoginTp.gid:
                            $t.$m.g.LogOut(()=>{
                                self.singOutMember(jEnum.Enum_SystemErrorCode.fail);
                            });
                        break;
                        case jEnum.Enum_LoginTp.fbid:
                            $t.$m.fb.LogOut(()=>{
                                self.singOutMember(jEnum.Enum_SystemErrorCode.fail);
                            });
                        break;
                        case jEnum.Enum_LoginTp.github:
                            $t.$m.github.LogOut(()=>{
                                self.singOutMember(jEnum.Enum_SystemErrorCode.fail);
                            });
                        break;
                        case jEnum.Enum_LoginTp.lineid:
                            $t.$m.line.LogOut(()=>{
                                self.singOutMember(jEnum.Enum_SystemErrorCode.fail);
                            });
                        break;
                    }
                }
            }
            else
            {
                self.singOutMember(jEnum.Enum_SystemErrorCode.fail);  
            }
        });
    };
    
    /** cookie 錯誤計數 */
    private countErrorCatchCookie:number = 0;
    
    /**
     * 排程ajax
    */
    public ajaxAry:Array<pub.ajaxFun> =[];

    /** 取得 token 排程 異步(API core) 
    */
    waitLogin=()=>{
        pb.v($t,"head_temp").async((headObj:pub.mainHeadTemp)=>
        {
            let goAjaxObj = self.ajaxAry[headObj.load];
            /** undefind Ajax listen */
            let undefindAjax:boolean=true;
            try
            {//temp 切換 memory 被移除
                undefindAjax=  goAjaxObj.ajax!=undefined;
            }
            catch(e)
            {// 退閃undefind ajax
                undefindAjax=false;
            }

            if(undefindAjax)
            {
                headObj.load++;
                /** 是否為 singout error */
                let systemErrorSingOut:boolean = false;
                /** 存活時間 */
                let existTime:number = ((((pb.LogingetCookie("jwtheadtype")!=null)?Number(pb.LogingetCookie("jwtheadtype")):jEnum.Enum_mbidTokenType.mobile)==jEnum.Enum_mbidTokenType.mobile)?(20*60):(60*24*60));
                pb.LogindoCookieSetup("jwtheadtype", String(((pb.LogingetCookie("jwtheadtype")!=null)?Number(pb.LogingetCookie("jwtheadtype")):jEnum.Enum_mbidTokenType.web)),existTime);//目前cookie 屬於誰之狀態
                goAjaxObj.ajax().async((e:any)=>
                {
                    /** respoonse */
                    let obj:any = null;
                    try
                    {
                        obj = JSON.parse(e);
                    }
                    catch(e1)
                    {
                        obj = e;
                    }

                    /** 是否往下一個ajax action */
                    let goRunNextAjax:boolean=false;
                    if(pb.LogingetCookie("mbidtoken")!=null)
                    {//登入狀況
                        /** 通過驗證後 function response function */
                        let catchObj:any = null;

                        if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                        {
                            self.countErrorCatchCookie = 0;
                            try
                            {
                                obj.def.mes = JSON.parse(obj.def.mes);
                            }
                            catch(e)
                            {

                            }
                            catchObj = obj.def;

                            try
                            {
                                if(catchObj.point!=null && catchObj.point!=undefined)
                                {//注入當前操作 point 資訊
                                
                                    headObj.nowIncon = catchObj.point;
                                    try
                                    {//暫存
                                        localStorage.setItem("psylpoint",String(headObj.nowIncon));//已存在時間
                                    }
                                    catch(e)
                                    {

                                    }
                                }
                            }
                            catch(e)
                            {

                            }

                            $t.$m.h.getMBData(obj.token,obj.r);//重新注入會員資訊
                            headObj.singCK = true;
                            if(self.timeoutSin==0){
                                self.startTimeout();
                            }
                            self.timeoutSin=headObj.mbdata.iat + existTime * 60;//設定登出時間

                        }
                        else
                        {
                            switch(Number(obj.error))
                            {
                                case jEnum.Enum_SystemErrorCode.existlogin:
                                case jEnum.Enum_SystemErrorCode.timeout:
                                case jEnum.Enum_SystemErrorCode.Verify:
                                case jEnum.Enum_SystemErrorCode.webNotCookies:
                                case jEnum.Enum_SystemErrorCode.repairError:
                                   self.singOutMember(obj.error);
                                    systemErrorSingOut=true;
                                break;
                            }
                        }

                        if(pb.LogingetCookie("mbidtoken")!=null)
                        {
                            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.VerifyError)
                            {//驗簽重驗證
                                if(self.countErrorCatchCookie>3)
                                {//wait 最後時間 us
                                    self.singOutMember(jEnum.Enum_SystemErrorCode.Verify);
                                }
                                else
                                {
                                    self.countErrorCatchCookie++;
                                    goRunNextAjax=true;
                                    headObj.load--;
                                    setTimeout(function(){
                                        self.waitLogin();
                                    },1000);
                                }
                            }
                            else if(obj.error *1==jEnum.Enum_SystemErrorCode.limit)
                            {//權限不足不進入function 運行
                                $t.viewAlert($t.main.pub.config.get("error").limitAccount);
                            }
                            else if(!systemErrorSingOut)
                            {//sinout error not run
                                if(Number(obj.error)!=jEnum.Enum_SystemErrorCode.repairError)
                                {
                                    if(Number(obj.error) >= jEnum.Enum_SystemErrorCode.Null)
                                    {
                                        goAjaxObj.fun(catchObj);
                                    }
                                    else
                                    {//未知錯誤
                                        $t.viewAlert("unknow error:code-"+obj.error);
                                    }
                                }
                                else
                                {
                                    self.maintainRecoe();
                                    $t.maintain = true;
                                }
                            }
       
                        }
                        else
                        {//cookie 自瀏覽器遺失
                            self.singOutMember(obj.error);
                        }
                    }
                    else
                    {/* 非登入悄況取API */
                        if(Number(obj.error)==jEnum.Enum_SystemErrorCode.repairError)
                        {
                            self.maintainRecoe();
                            $t.maintain = true;
                        }
                        else
                        {
                            goAjaxObj.fun(obj);
                        }
                    }

                    if(headObj.load >= self.ajaxAry.length)
                    {
                        setTimeout(()=>{
                            if(headObj.load >= self.ajaxAry.length)
                            {/** 偵聽是否-完成ajax */
                                self.ajaxAry=[];//清空所有排程
                                headObj.load = 0;
                            }
                            else
                            {
                                if(!goRunNextAjax)
                                {//往下一個 ajax
                                    self.waitLogin();
                                }
                            }
                        },100);
                    }
                    else
                    {
                        if(!goRunNextAjax)
                        {//往下一個 ajax
                            self.waitLogin();
                        }
                    }
                    
                });
            }
            else
            {//往下一個 ajax
                if(headObj.load >= self.ajaxAry.length)
                {/** 偵聽是否-完成ajax */
                    setTimeout(()=>{
                        if(headObj.load >= self.ajaxAry.length)
                        {/** 偵聽是否-完成ajax */
                            self.ajaxAry=[];//清空所有排程
                            headObj.load = 0;
                        }
                        else
                        {
                            self.waitLogin();
                        }
                    },100);
                }
            }
        });
    };
};
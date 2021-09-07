import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";


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
/** headTemp */
let HeadTemp:pub.mainHeadTemp;
/** 會員編緝、狀態設定(帳戶管理)*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
        
            
    }
    
    /** 減少營業占成 */
    deProfit=(mb:pE.mbCtr)=>
    {
        if(mb.profit<0.8)
        {
            mt.viewConfirm("是否確認減少占成？",()=>{
                pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
                    if(e.load==0){
                        Login((x)=>x.post("/ma/mg/sysmg/deprofit").input({uid:mb.uid}),(e2:any)=>{
                            if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                                mb.profit = e2.data.profit;
                                mb.mark = e2.data.mark;
                                mb.appck = e2.data.appck;
                            }else{
                                mt.viewAlert("伺服器忙錄中！");
                            }
                        });
                    }
                });
            },null,$t.main.pub.lib.src('cashout.png'));
        }
    } 

    /** 增加營業占成 */
    inProfit =(mb:pE.mbCtr)=>
    {
        if(mb.profit>0.6)
        {
            mt.viewConfirm("是否確認增加占成？",()=>{
                pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
                    if(e.load==0){
                        Login((x)=>x.post("/ma/mg/sysmg/inprofit").input({uid:mb.uid}),(e2:any)=>{
                            if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                                mb.profit = e2.data.profit;
                                mb.mark = e2.data.mark;
                                mb.appck = e2.data.appck;
                            }else{
                                mt.viewAlert("伺服器忙錄中！");
                            }
                        });
                    }
                });
            },null,$t.main.pub.lib.src('cashout.png'));
        }
    }

    /** 初始化head繼承 */
    initHead =()=>
    {
        HeadTemp = $t.headPortal;
    }

    /** 使用權限時間單位-pay商品 */
    getDateData = (fun:Function)=> {
        Login((x)=>x.post("/mpay/mg/ptaccountdate/inputdate"),(e2:any)=>{
            if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                fun(e2.mes);
            }else{
                mt.viewAlert("伺服器忙錄中！");
            }
        });
    };
    
    /** 帳戶個數單位-pay商品 */
    getCountData = (fun:Function) => {
        Login((x)=>x.post("/mpay/mg/ptaccountdate/inputcount"),(e2:any)=>{
                if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                    fun(e2.mes);
                }else{
                    mt.viewAlert("伺服器忙錄中！");
                }
            });
        
    };

    /** 權限設定 
     * @param mb member object json
    */
    changeLimit = (mb: pE.mbCtr)=>{
        mt.viewConfirm("是否確認修改？",()=>{
            Login((x)=>x.post("/mg/mb/sysandchief/mblimit").input({mbid:mb.mbid}),(e2:any)=>{
                    if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                        mb.level=e2.data*1;
                        mt.viewAlert("權限設定成功！");
                    }else{
                        mt.viewAlert("權限設定失敗！");
                    }
                });
        },null);
    };

    /** 防連點 */
    private payWait:boolean=true;
    /** 管理者功能支付 
     * @param get$t 時間選擇器
     * @param mb 會員 帳戶 json object
    */
    pay = (get$t:any,mb: pE.mbCtr)=>
    {//使用權限時間單位、帳戶個數單位-pay商品
        if(this.payWait){
            this.payWait=false;
            if((get$t.paystatus as jEnum.Enum_payStatus) !=  jEnum.Enum_payStatus.fail)
            {
                if(get$t.chooseDate !="empty" || get$t.chooseCount != "empty")
                {
                    var notAllowancesAndRefundCash = true;
                    (get$t.options as Array<jDB.PayOptions>).forEach((val,nu)=>
                    {//檢測 讓 欄位是否為數字
                        if(!val.gifts){
                            let getFilterAllowances:string = ("0"+val.allowances).replace(/ /g,'');
                            if(isNaN(Number(getFilterAllowances)) && getFilterAllowances!="")
                            {//輸入其它符號 讓-金額
                                notAllowancesAndRefundCash = false;
                            }
                            else if(getFilterAllowances=="")
                            {//設定為 0
                                val.allowances = 0;
                            }else{
                                val.allowances = Number(getFilterAllowances);//filter 為數字
                            }
                        }

                        let getFilterrefundCash:string = ("0"+val.refundCash).replace(/ /g,'');
                        if(isNaN(Number(getFilterrefundCash)) && getFilterrefundCash!="")
                        {//輸入其它符號 退款-金額
                            notAllowancesAndRefundCash = false;
                        }
                        else if(getFilterrefundCash=="")
                        {//設定為 0
                            val.refundCash = 0;
                        }else{
                            val.refundCash= Number(getFilterrefundCash);//filter 為數字
                        }
                    });

                    if(notAllowancesAndRefundCash)
                    {
                        Login((x)=>x.post("/mpay/mg/ptaccountdate/pay")
                            .input({uid:mb.uid,date:get$t.chooseDate ,count:get$t.chooseCount,status:get$t.paystatus as jEnum.Enum_payStatus})
                            .input({payoption:JSON.stringify(get$t.options)})
                            ,(e:any)=>
                            {
                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    let mbObj:jDB.Member = e.obj;
                                    mb.pay = mbObj.pay;
                                    mb.MBCount = mbObj.MBCount;
                                    mb.level=  mbObj.level;
                                    mb.autoAry = mbObj.autoAry;
                                    mb.ck = mbObj.ck;
                                    mb.mg = mbObj.mg;
                                    mb.mark = mbObj.mark;

                                    get$t.chooseDate = "empty";//清空
                                    get$t.chooseCount = "empty";

                                    get$t.options=[//讓 贈 設定 -格式初始化
                                        {pkey:"a", gifts:false, allowances:0,refundCash:0},//帳戶count數
                                        {pkey:"b", gifts:false, allowances:0,refundCash:0}//期限
                                    ];
                                    get$t.paystatus = -1;

                                    if(e.data!=null){
                                        mt.viewAlert("立單成功！(編號:"+(e.data as jDB.payRecord).key+")");
                                    }else{
                                        mt.viewAlert("無法立單！");
                                    }
                                }
                                else if(Number(e.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                                {
                                    /** 已關閉之application */
                                    let NameAry:Array<String>=[];
                                    e.datatype.forEach((val:any,nu:Number)=>{
                                        NameAry.push(($t.main as pub.main).pub.catchLangName(val.nameAry));
                                    });
                                    if(NameAry.length)
                                    {
                                        mt.viewAlert("無法立單！目前無法購入商品("+NameAry.join(",")+")");
                                    }
                                    else
                                    {
                                        mt.viewAlert("無法確立單據(無法滿足帳戶條件)！");
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                self.payWait=true;
                            });
                    }
                    else
                    {
                        this.payWait=true;
                        mt.viewAlert("輸入錯誤-欄位需為數字！");
                    }
                }else
                {
                    this.payWait=true;
                    mt.viewAlert("請選擇加值功能");
                }
            }else{
                this.payWait=true;
                mt.viewAlert("請選擇單據狀態");
            }
        }
    };

    /** 繳請for綁定帳戶 payLevel mgLevel 權限
     * @param mb member json object
     */
    sendBind=(mb: pE.mbCtr)=>
    {
        mt.viewConfirm("是否確認繳請("+mb.mbid+")？",()=>{
            Login((x)=>x.post("/mg/mb/mglevel/sendbind")
                .input({mbid:mb.mbid}),(e2:any)=>{
                    if(Number(e2.error)== jEnum.Enum_SystemErrorCode.Null){
                        mb.mg = e2.data;
                        mt.viewAlert("已發送邀請！");
                    }else{
                        mt.viewAlert("發送失敗！");
                    }

                });
        },null);
    };

    /** 取消綁定 帳戶
     * @param mb member json object
    */
    cancelBind=(mb:pE.mbCtr)=>
    {
        mt.viewConfirm("是否確認確消綁定？",()=>{
            Login((x)=>x.post("/mg/mb/mglevel/bindcancel")
                .input({mbid:mb.mbid}),(e2:any)=>{
                    if(Number(e2.error)== jEnum.Enum_SystemErrorCode.Null){
                        mb.mg = e2.data.mg;
                        mb.ck = e2.ck;;
                        mb.mark = e2.mark;
                        mt.viewAlert("已取消綁定！");
                    }else{
                        mt.viewAlert("取消邀請失敗！");
                    }
                });
        },null);
    };

    //-----權限設定
    /** 權限設定容器
    * level 登入帳權限,editMBlevel 編緝MB level
    * @param level 編緝 管理者 level
    * @param editMB 被編緝會員 json object 
    */
    containerLimit = (level:jEnum.Enum_MBLevel,editMB:pE.mbCtr):any[]=>
    {
        /** 被編緝帳戶等級 */
        let editlevel = Number(editMB.level) as jEnum.Enum_MBLevel
        /** 會員 重建 list */
        let mb:any[]=[];
        $t.mblevelList.forEach((val:any,nu:number)=>{
            if(editlevel != val.val*1){
                if(Number(level)==jEnum.Enum_MBLevel.superSystemMG)
                {//主系統管理者
                    if([jEnum.Enum_MBLevel.systemMG,jEnum.Enum_MBLevel.normal].indexOf(val.val*1)>-1){
                        mb.push(val);
                    }
                }
                else if(Number(level)== jEnum.Enum_MBLevel.systemMG || Number(level)== jEnum.Enum_MBLevel.Edit)
                {//系統管理者
                    if([jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.normal].indexOf(Number(val.val))>-1 ||
                    (Number(level) == jEnum.Enum_MBLevel.systemMG && [jEnum.Enum_MBLevel.Edit,jEnum.Enum_MBLevel.pay].indexOf(Number(val.val))>-1)
                    )
                    {
                        mb.push(val);
                    }
                }
            }
        });
        return mb;
    };

    /** 更動權限 
     * @param mb 會員 josn obejct
     * @param input 會員權限資料
    */
    limitEdit = (mb:pE.mbCtr,input:string)=>{
        if(input!="--"){
            if(HeadTemp.chiefSysLevel())
            {
                switch(Number(input)){//chief sys
                        case jEnum.Enum_MBLevel.normal:
                        this.changeLimitGet(mb,"/mg/mb/chief/setnormal");
                        break;
                        case jEnum.Enum_MBLevel.systemMG:
                        this.changeLimitGet(mb,"/mg/mb/chief/setsysmg");
                        break;
                }
            }
            else if(HeadTemp.SysLevel())
            {
                switch(Number(input)){//sys
                    case jEnum.Enum_MBLevel.normal:
                        this.changeLimitGet(mb,"/mg/mb/sys/setnormal");
                    break;
                    case jEnum.Enum_MBLevel.MG:
                    this.changeLimitGet(mb,"/mg/mb/sys/setMG");
                    break;
                    case jEnum.Enum_MBLevel.pay:
                    this.changeLimitGet(mb,"/mg/mb/sys/setpay");
                    break;
                    case jEnum.Enum_MBLevel.RG:
                    this.changeLimitGet(mb,"/mg/mb/sys/setrg");
                    break;
                    case jEnum.Enum_MBLevel.Edit:
                    this.changeLimitGet(mb,"/mg/mb/sys/setedit");
                    break;
                }
            }
            else if(HeadTemp.editLevel())
            {
                switch(Number(input)){//edit
                    case jEnum.Enum_MBLevel.normal:
                        this.changeLimitGet(mb,"/mg/mb/sys/setnormal");
                    break;
                    case jEnum.Enum_MBLevel.MG:
                    this.changeLimitGet(mb,"/mg/mb/sys/setMG");
                    break;
                    case jEnum.Enum_MBLevel.RG:
                        this.changeLimitGet(mb,"/mg/mb/sys/setrg");
                    break;
                }
            }
        }else{
            mt.viewAlert("請選擇更動權限！");
        }
    };

    /** 設定為系統管理者
     * 
     * @param mb 會員 json object
     * @param url into 後端API
     */
    private changeLimitGet=(mb:pE.mbCtr,url:string)=>{//設定為系統管理者
        mt.viewConfirm("是否確認修改？",()=>{
            Login((x)=>x.post(url).input({mbid:mb.mbid}),(e2:any)=>{
                    if(Number(e2.error)== jEnum.Enum_SystemErrorCode.Null){
                        mb.level = Number(e2.data);
                        mb.mark = e2.mark;
                        mt.viewAlert("權限設定成功！");
                    }else if(Number(e2.error)== jEnum.Enum_SystemErrorCode.prdocutNotExist){
                        mt.viewAlert("無法設定權限！");
                    }else{
                        mt.viewAlert("權限設定失敗！");
                    }

            });
        },null);
    };
    //------------end 權限設定

    //-------share libary url start 權限設定
    /** 取得資源設定
     * @param main 目前正在被設定帳戶 json object
     */
    ShareUrlList = (main:any)=>
    {
        main.ShareUrlListdata = [];
        Login((x)=>x.post("/mg/mb/mglevel/shareurl").input({uid:main.mb.uid}),(e2:any)=>{
                if(Number(e2.error)==jEnum.Enum_SystemErrorCode.Null){
                    main.ShareUrlListdata = e2.data;
                }else{
                    mt.viewAlert("伺服器忙錄中！");
                }

            });
    };

    /** 起用或停用權限
     * @param bindurlObj 被分享url權限使用者
     */
    ShareUrlEdit = (bindurlObj:any)=>
    {
        Login((x)=>x.post("/mg/mb/mglevel/shareurlLimit").input({uid:bindurlObj.data.uid,key:bindurlObj.data.key}),(e2:any)=>{
                if(Number(e2.error)== jEnum.Enum_SystemErrorCode.Null){
                    bindurlObj.data.ck = e2.ck;
                    bindurlObj.data.mark = e2.mark;
                }else{
                    mt.viewAlert("伺服器忙錄中！");
                }

            });
    };
    //------------share libary url start -- end 權限設定
    /** 更動會員密碼 
     * @param mb 被設定帳戶 json object
     * @param mailtype mail type
    */
    pwdChange = (mb:pE.mbCtr)=>{
        mt.viewConfirm("是否確認，更動此帳號密碼？",()=>
        {
            pb.v($t,"AccountSet").async((e:any)=>{
                e.changePwd.sendmail= true;
                Login((x)=>x.post("/mg/mb/sysandchief/pwedit")
                    .input(mb),(e3:any)=>{
                        if(e3.error*1== jEnum.Enum_SystemErrorCode.Null){
                            mb.pw = "";
                            mt.viewAlert("已更動密碼！");
                            setTimeout(function()
                            {
                                e.changePwd.sendmail = false;
                            },3000);
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙錄中！");
                            e.changePwd.sendmail = false;
                        }

                    });
            });
        },null);
    }
}
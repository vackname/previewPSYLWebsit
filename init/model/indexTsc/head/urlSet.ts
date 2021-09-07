import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";
import iLoad from "../../../../models/importLoad";
import * as vue from "../../../../models/vueComponent";
import {jObj as jObjM} from "../../../../models/Jobj/interface";

import * as pub from "../../../../JsonInterface/pub";
import * as pE from "../../pubExtendCtr";

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
/** 注入 psyl vue template */
let vueComponent:vue.vueComponent;
/** psyl oad system */
let importLoad:iLoad;
/** headTemp */
let HeadTemp:pub.mainHeadTemp;
import postsysM from "./urlSet/postsys";
import newsM from "./urlSet/News";
import newsccM from "./urlSet/Newscc";
import pcarM from "./urlSet/PCar";
import turM from "./urlSet/turnweb";
import acM from "./urlSet/MGActivity";
import mgM from "./urlSet/Management";
/** 各專案連接路徑 */
export default class model{
    /** post system roject連接路徑 */
    psys:postsysM|undefined;
    /** 採踩Project連接路徑 */
    ncc:newsccM|undefined;
    /** 新聞媒體Project連接路徑 */
    ns:newsM|undefined;
    /** 商城Project連接路徑 */
    pc:pcarM|undefined;
    /** 活動報名 */
    ac:acM|undefined;
    /** 入口首頁Project連接路徑 */
    tur:turM|undefined;
    /** 後台管理Project連接路徑 */
    MG:mgM|undefined;
    constructor($tObj:any,$eObj:any,head:pub.mainHeadTemp) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        vueComponent = $eObj.vueComponent;
        importLoad = $eObj.importLoad;
        self = this;
        HeadTemp = head;
        self.psys = new postsysM($tObj,$eObj,HeadTemp);
        self.ncc = new newsccM($tObj,$eObj,HeadTemp);
        self.ns = new newsM($tObj,$eObj,HeadTemp);
        self.pc = new pcarM($tObj,$eObj,HeadTemp);
        self.tur = new turM($tObj,$eObj,HeadTemp);
        self.ac = new acM($tObj,$eObj,HeadTemp);
        self.MG = new mgM($tObj,$eObj,HeadTemp);
    }

    /** 設定連結路經 */
    setPath = ()=>
    {
        /** 超連結 換頁 清單Add 陣列 - 第一層 */
        let ary:Array<pub.MenuList> = HeadTemp.MenuList;

        ary.push({key:"aboutStory",addName:()=>{ return "";},//合氣禾秝
        logInfun:()=>{ return HeadTemp.NormalLevel() || HeadTemp.SysLevel()|| HeadTemp.editLevel(); },
        notLoginFun:()=>{ return true;},
        clickfun:self.tur?.goaboutStory,
            FinalAry:false,
            head:false
        });

        ary.push({key:"productTemp",addName:()=>{ return "";},//購物商城
            logInfun:()=>{ return HeadTemp.NormalLevel() || HeadTemp.SysLevel()|| HeadTemp.editLevel(); },
            notLoginFun:()=>{ return true;},
            clickfun:self.pc?.goProductTemp,
            FinalAry:false,
            head:false
        });

        ary.push({key:"newsccvue",addName:()=>{ return "";},//採踩新聞首頁
            logInfun:()=>{ return HeadTemp.NormalLevel() || HeadTemp.SysLevel() || HeadTemp.editLevel(); },
            notLoginFun:()=>{ return true;},
            clickfun:self.ncc?.GoInNewsccIndex,
            FinalAry:false,
            head:false,
        });


        ary.push({key:"AcVue",addName:()=>{ return "";},//伴空間
        logInfun:()=>{ return HeadTemp.NormalLevel() || HeadTemp.SysLevel()|| HeadTemp.editLevel(); },
        notLoginFun:()=>{ return true;},
        clickfun:self.ac?.GoIndex,
            FinalAry:false,
            head:false
        });


        ary.push({key:"newsvue",addName:()=>{ return "";},//新聞首頁
            logInfun:()=>{ return HeadTemp.NormalLevel() || HeadTemp.SysLevel()|| HeadTemp.editLevel(); },
            notLoginFun:()=>{ return true;},
            clickfun:self.ns?.GoInNewsIndex,
            FinalAry:false,
            head:false,
        });


        ary.push({key:"PayHistory",addName:()=> { return "";},//購買歷史記錄
            logInfun:()=>{ return HeadTemp.NormalLevel(); },
            notLoginFun:()=>{ return false;},
            clickfun:self.tur?.gourlPay,
            FinalAry:false,
            head:true
        });

        ary.push({key:"mbedit",//設定個人帳戶
            addName:()=> { return HeadTemp.levelName(HeadTemp.mbdata.level);},
            logInfun:()=>{ return true; },
            notLoginFun:()=>{ return false;},
            clickfun:self.tur?.gombedit,
            FinalAry:false,
            head:true
        });

        ary.push({key:"invite",addName:()=> { return "";},//合作邀約
            logInfun:()=>{ return true; },
            notLoginFun:()=>{ return true;},
            clickfun:self.tur?.goinvite,
            FinalAry:true,
            head:false
        });

        ary.push({key:"logout",addName:()=> { return "";},//登出
            logInfun:()=>{ return true; },
            notLoginFun:()=>{ return false;},
            clickfun:self.singOut,
            FinalAry:true,
            head:true
        });
        ary.push({key:"login",addName:()=> { return "";},//登入
            logInfun:()=>{ return false; },
            notLoginFun:()=>{ return true;},
            clickfun:self.singupView,
            FinalAry:true,
            head:true
        });

        //第二層----------------- 店主/系統管理者/記者
        let ary2:Array<pub.MenuList> = HeadTemp.MenuList2;

        ary2.push({key:"MgPs",addName:()=>{ return "";},//購物商城-店主商品管理
            logInfun:()=>{ return (HeadTemp.MGLevel() || HeadTemp.PayLevel()); },
            notLoginFun:()=>{ return false;},
            clickfun:self.pc?.goProductEditTemp,
            FinalAry:false,
            head:true
        });

        ary2.push({key:"mgvue",addName:()=> { return "";},//新聞寫稿
            logInfun:()=>{ return (HeadTemp.editLevel() || HeadTemp.SysLevel()); },
            notLoginFun:()=>{ return false; },
            clickfun:self.ns?.GoInNewsMG,
            FinalAry:false,
            head:true
        });

        ary2.push({key:"mgccvue",addName:()=> { return "";},//新聞稿-採踩
            logInfun:()=>{ return (HeadTemp.RgLevel() || HeadTemp.PayLevel() || HeadTemp.SysLevel()); },
            notLoginFun:()=>{ return false; },
            clickfun:self.ncc?.GoInNewsccMG,
            FinalAry:false,
            head:true
        });

        ary2.push({key:"MgMb",addName:()=> { return "";},//會員管理
            logInfun:()=>{return (HeadTemp.SysLevel() || HeadTemp.editLevel()|| HeadTemp.chiefSysLevel()); },
            notLoginFun:()=>{ return false;},
            clickfun:self.MG?.gourlMBMG,
            FinalAry:false,
            head:true
        });

        ary2.push({key:"MgPd",addName:()=> { return "";},//總帳單據管理-結帳日
            logInfun:()=>{ return HeadTemp.SysLevel() || HeadTemp.editLevel()  },
            notLoginFun:()=>{ return false;  },
            clickfun:self.MG?.gourlMGPD,
            FinalAry:false,
            head:true
        });

        ary2.push({key:"MgWatch",addName:()=>{ return "";},//監控系統
            logInfun:()=>{ return HeadTemp.SysLevel() || HeadTemp.editLevel() || HeadTemp.chiefSysLevel(); },
            notLoginFun:()=>{ return false; },
            clickfun:self.MG?.gourlMgWatch,
            FinalAry:false,
            head:true
        });

        //----第二層 文章管理 謹系統管理者
        let ary3:Array<pub.MenuList> = HeadTemp.MenuList3;
        ary3.push({key:"MgNews",addName:()=>{ return "";},//審核新聞媒體文章
            logInfun:()=>{ return HeadTemp.SysLevel(); },//謹限系統管理者
            notLoginFun:()=>{ return false; },
            clickfun:self.MG?.gourlNewsMG,
            FinalAry:false,
            head:true
        });

        ary3.push({key:"MgNewscc",addName:()=>{ return "";},//審核採踩文章
            logInfun:()=>{ return true; },
            notLoginFun:()=>{ return false; },
            clickfun:self.MG?.gourlNewsMGcc,
            FinalAry:false,
            head:true
        });

        ary3.push({key:"MgPT",addName:()=> { return "";},//最新消息文宣管理
            logInfun:()=>{return true; },
            notLoginFun:()=>{ return false;},
            clickfun:self.MG?.gourlMgPT,
            FinalAry:false,
            head:true
        });

        //----第二層 營業活動管理 謹系統管理者

        let ary4:Array<pub.MenuList> = HeadTemp.MenuList4;
        ary4.push({key:"postFrom",addName:()=>{ return "";},//post system 首頁
            logInfun:()=>{ return HeadTemp.SysLevel() || HeadTemp.editLevel(); },
            notLoginFun:()=>{ return false; },
            clickfun:self.psys?.postsysIndex,
            FinalAry:false,
            head:true
        });

        ary4.push({key:"MgAc",addName:()=> { return "";},//伴空間文宣管理
        logInfun:()=>{return true;},
        notLoginFun:()=>{ return false;},
            clickfun:self.MG?.gourlMgAc,
            FinalAry:false,
            head:true
        });

        ary4.push({key:"MgPs",addName:()=> { return "";},//商品設定管理
            logInfun:()=>{ return HeadTemp.SysLevel() || HeadTemp.editLevel(); },
            notLoginFun:()=>{ return false;},
            clickfun:self.MG?.gourlMGProduct,
            FinalAry:false,
            head:true
        });

    }

    /**
     * (href)作者資訊
    */
    openAuthor = ()=>
    {
        HeadTemp.targetPageName = "author";
        $t.$m.h.ChangePj(pE.enum_pag.author,"author_temp");
        ($t.main as pub.main).page=HeadTemp.targetPageName;
        HeadTemp.headopen = false;
        HeadTemp.firstHome = true;//是否顯示home鈕
    };

    /** 登出 */
    singOut=()=>{
        $t.$m.l.singOut();
    };

    /**
     * 登入畫面
    */
    singupView=()=>
    {
        ($t.login.img as jObjM).loadlib("login",(eimg)=>
        {//載入login img
            $t.loginopen=true;
            $t.$m.l.openView();
            HeadTemp.headopen = false;
        });
    };

}
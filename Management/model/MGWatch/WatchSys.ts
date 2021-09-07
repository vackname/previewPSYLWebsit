import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/**
 * psyl vue bundle 記愔體緩存格式
 */
interface psylJs
{
    /** 取用統計 */
    count:number, 
    /** 緩存內容 */
    content:string,
    /** api 格式 */
    ct:string,
    /** api path */
    path:string,
}

/**
 *  站台資料格式
 */
interface watcApCtr extends jDB.PJEvn
{
    /** 所屬 server host */
    host:string,
    /** 隱藏server status */
    show:boolean,
    /**
     * 收合API list
     */
    apiDisplay:boolean,
    /**
     * 收合API js css Document list
     */
    apiDisplay1:boolean,
    /**
     * proxy API 使用 統計
    */
    api:Array<jDB.urlCaul>,
    /**
     * js css 用量統計
    */
    jsApi:Array<psylJs>,
}

/** app所屬 server */
interface App
{
    /** server ip */
    host:string,
    /** application name */
    ap:string,
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
/** 監控系統 */
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

    /**
     * 初始化
     */
    init=()=>
    {
        Login((x)=>x.post("/mg/mb/chief/app"),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {//取得各站台名稱
                $t.ApList = e.data as Array<App>;

                ($t.ApList as Array<App>).forEach((val,nu)=>
                {//注入選擇器
                    if($t.serverList.indexOf(val.host)==-1)
                    {//host ip
                        $t.serverList.push(val.host);
                    }
                });
                $t.server = ($t.ApList as Array<App>)[0].host;//目前偵聽server選擇
                self.loadApp(true);//first
            }
            else
            {
                mt.viewAlert("伺服器忙線中！(init)");
            }
        });
    }

    /** 載入站台 
     * @param init 是否為初始化載入
    */
    loadApp=(init:boolean)=>
    {
        if(init)
        {//初始化
            $t.watchList=[];
        }
        self.lockApp();
        Login((x)=>x.post("/mg/mb/chief/proxystatus"),(proxy:any)=>
        {
            if(Number(proxy.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                $t.proxlisten = (proxy.data as boolean);//api 是否開起偵聽
                /** 已取得APi 計算name */
                let APINameList:Array<string>=[];
                /** 目前已取得資料 */
                ($t.ApList as Array<App>).forEach((valAp:App,nu:number)=>
                {
                    if($t.server==valAp.host || init)
                    {
                        /**
                         * 是否偵聽站台
                         */
                        let apListen:boolean = true;
                        ($t.watchList as Array<watcApCtr>).forEach((val,nu)=>
                        {
                            if(val.host== valAp.host)
                            {
                                apListen= val.run || !val.run && !val.CloseComplete;
                                if(!apListen && (proxy.data as boolean) && val.same=="main")
                                {//更新API  
                                    ($t.watchList as Array<watcApCtr>).forEach((val2,nu2)=>
                                    {
                                        if(APINameList.indexOf(val2.same)==-1)
                                        {
                                            APINameList.push(val2.same);
                                            Login((x)=>x.post("/mg/mb/chief/proxycaulline").input({"app":val2.same}),(e:any)=>
                                            {
                                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                                {//取得各站台名稱
                                                    if(val2.same!="main")
                                                    {//api
                                                        (e.data as Array<jDB.urlCaul>).forEach((val3,nu3)=>{
                                                            /** 是否已存在 */
                                                            let inset:boolean=true;
                                                            val["api"].forEach((val4,nu4)=>{
                                                                if(val4.url==val3.url)
                                                                {
                                                                    inset=false;
                                                                    val4.error = val3.error;
                                                                    val4.date =val3.date;
                                                                    val4.count = val3.count;
                                                                    val4.PrevCount = val3.PrevCount;
                                                                }
                                                            });
                                                            if(inset)
                                                            {
                                                                val["api"].push(val3);
                                                            }
                                                        });
                                                    }
                                                    else
                                                    {//js css txt
                                                        val["jsApi"] = e.data as Array<psylJs>;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });

                        if(apListen)
                        {//偵聽
                            Login((x)=>x.post(((valAp.ap=="main")?"/mg/mb/chief/watchdata":"/"+valAp.ap+"/mg/chief/watchdata")).input({"host":valAp.host}),(e:any)=>
                            {
                            
                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    let dataObj:watcApCtr = e.data;
                                    dataObj["show"] = false;
                                    dataObj["host"] = valAp.host;
                                    dataObj["api"] = [];//create 容器
                                    dataObj["jsApi"] = [];
                                    dataObj["apiDisplay"]=false;
                                    dataObj["apiDisplay1"]=false;

                                    if((proxy.data as boolean) && dataObj.same=="main")
                                    {//更新API
                                        ($t.watchList as Array<watcApCtr>).forEach((val2,nu2)=>
                                        {
                                            if(APINameList.indexOf(val2.same)==-1)
                                            {
                                                APINameList.push(val2.same);
                                                Login((x)=>x.post("/mg/mb/chief/proxycaulline").input({"app":val2.same}),(e2:any)=>
                                                {
                                                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                                    {//取得各站台名稱
                                                        if(val2.same!="main")
                                                        {//api
                                                            (e2.data as Array<jDB.urlCaul>).forEach((val3,nu3)=>{
                                                                /** 是否已存在 */
                                                                let inset:boolean=true;
                                                                dataObj["api"].forEach((val4,nu4)=>{
                                                                    if(val4.url==val3.url)
                                                                    {
                                                                        inset=false;
                                                                        val4.error = val3.error;
                                                                        val4.date =val3.date;
                                                                        val4.count = val3.count;
                                                                        val4.PrevCount = val3.PrevCount;
                                                                    }
                                                                });
                                                                if(inset)
                                                                {
                                                                    dataObj["api"].push(val3);
                                                                }
                                                            });
                                                        }
                                                        else
                                                        {//js css txt
                                                            dataObj["jsApi"] = e2.data as Array<psylJs>;
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    if(!init)
                                    {//更新
                                        /** 重建-更新自己本身 refresh */
                                        let creatAry2:Array<watcApCtr> = [];
                                        ($t.watchList as Array<watcApCtr>).forEach((val,nu)=>
                                        {
                                            if(val.host== dataObj["host"] && val.same == dataObj.same)
                                            {
                                                dataObj.jsApi= val.jsApi;
                                                dataObj.api = val.api;
                                                dataObj.apiDisplay = val.apiDisplay;
                                                dataObj.apiDisplay1 = val.apiDisplay1;
                                                dataObj.host = val.host;
                                                dataObj.show = val.show;
                                                creatAry2.push(dataObj);
                                            }
                                            else
                                            {
                                                creatAry2.push(val);
                                            }
                                        });
                                        $t.watchList = creatAry2;
                                    }
                                    else
                                    {//初始化載入

                                        $t.$an.w.loadRuning(dataObj.same,dataObj.host);//loading 運行動畫開起
                                        $t.watchList.push(dataObj);
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中！(select-"+valAp.host+"-"+valAp.ap+")");
                                }
                            });
                            
                        }
                    }
                });
            }
            else
            {
                mt.viewAlert("伺服器忙線中！(proxy)");
            }
        });

        setTimeout(()=>
        {//自動更新
            self.refresh();
            pb.v($t.mainTemp,"head_temp").async((HeadTemp:pub.mainHeadTemp)=>
            {
                if(HeadTemp.targetPageName == "MgWatch")
                {
                    self.loadApp(false);
                }
            });
        },9639);
    }

    /**
     * 清除 前端緩存API
     * @param ap 伺服器
     * @param path 被清除之API
     */
    clearJs= (ap:watcApCtr,path:string)=>
    {
        mt.viewConfirm("是否移除API緩存?<br/>"+path,()=>
        {
            Login((x)=>x.post("/mg/mb/chief/jsfiledel").input({path:path}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    /** 重建API */
                    let createData:Array<psylJs>=[];
                    ap.jsApi.forEach((val,nu)=>{
                        if(val.path!=path)
                        {
                            createData.push(val);
                        }
                    });

                    ap.jsApi = createData;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }

    /**
     * 清除 前端全部緩存API
     * @param ap 伺服器
     */
    AllClearJs= (ap:watcApCtr)=>
    {
        mt.viewConfirm("是否移除全部緩存API?",()=>
        {
            Login((x)=>x.post("/mg/mb/chief/jsfiledelall"),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    ap.jsApi=[];
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }

    /**
     * 目前進入 維護API(client 端 View) data list
     */
    lockApp = ()=>
    {
        Login((x)=>x.post("/mg/mb/chief/lockap"),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                $t.lockAP = e.data;
            }
            else
            {
                mt.viewAlert("伺服器忙線中！");
            }
        });
       
    }

    /**
     * 目前進入 維護API 開/關(client 端 View)
     */
    lockAppEdit= (ap:watcApCtr)=>
    {
        mt.viewConfirm("是否"+(($t.lockAP.indexOf(ap.same)>-1)?"起用":"進入維護") +"?",()=>
        {
            Login((x)=>x.post("/mg/mb/chief/appedit").input({app:ap.same}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    $t.lockAP = e.data;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }

    /**
     * 偵聽API開關
     */
    proxylistenFun= ()=>
    {
        mt.viewConfirm("API是否"+(($t.proxlisten)?"停止":"起動") +"偵聽?",()=>
        {
            Login((x)=>x.post("/mg/mb/chief/proxylisten"),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    $t.proxlisten = e.data;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }

    /**
     * 起動監聽
     * @param valAp AP name
     */
    runWatch = (ap:watcApCtr)=>{
        mt.viewConfirm(ap.title+"是否起動偵聽?",()=>
        {
            Login((x)=>x.post(((ap.same=="main")?"/mg/mb/chief/watchsysrun":"/"+ap.same+"/mg/chief/watchsysrun")).input({host:ap.host}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    ap.run = true;
                    self.refresh();
                    setTimeout(()=>
                    {
                        $t.$an.w.loadRuning(ap.same,ap.host);//loading 運行動畫開起
                    },6000);
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }

    /**
     * 觸發 vue update
     */
    private refresh()
    {
        let creatAry:Array<watcApCtr> = [];//重建
        ($t.watchList as Array<watcApCtr>).forEach((val,nu)=>
        {
            creatAry.push(val);
        });
        $t.watchList = creatAry;
    }
    /**
     * 關閉監聽
     * @param valAp AP name
     */
    CloseWatch = (ap:watcApCtr)=>{
        mt.viewConfirm(ap.title+"是否關閉偵聽?",()=>
        {
            Login((x)=>x.post(((ap.same=="main")?"/mg/mb/chief/watchclose":"/"+ap.same+"/mg/chief/watchclose")).input({host:ap.host}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    ap.run = false;
                    self.refresh();
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null);
    }
};
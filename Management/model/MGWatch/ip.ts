import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/**
 * client browser
*/
interface browser
{//pub browser interface format
    /** 瀏覽器 */
    browser:string,
    /** 
     * 版本
    */
    version:string,
    /**
     * 系統name
     */
    OS:string,
    /**
     * browser 語系
    */
    lang:string
}

/** 解析後資訊 */
interface reProxyIp extends jDB.Proxy_mbIP
{
    /** 解析後資訊 */
    redata:browser
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
let Jobj:jObjM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** IP 設定 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
        
    }

    /**
     * 初始化
     */
    init=()=>
    {
        self.ipListfun();
        self.LockIPListfun();

    }
    /**
     * 當前進入IP
     */
     ipListfun= ()=>
     {

        Login((x)=>x.post("/mg/mb/sysandchief/ipcaul"),(e:any)=>
        {

            /**
             * browser img
            */
            let imgB:jObjM = new (Jobj as any)();
            /**
             * os img
            */
            let imgOS:jObjM = new (Jobj as any)();
            imgB.loadlib("browser",(img1)=>
            {//載入
                imgOS.loadlib("os",(img2)=>
                {//載入
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /**
                         *  取得browswer img
                        */
                        let nowBrimg:any = imgB.Jobj["browser" as any];
                        /**
                         *  取得OS img
                        */
                        let nowOSimg:any = imgOS.Jobj["os" as any];

                        (e.data as Array<reProxyIp>).forEach((val,nu)=>
                        {
                            let bObj:browser = pb.browserInfo({vendor:val.vendor,appVersion:val.appVersion,platform:val.platform, userAgent:val.useragent,lang:val.lang});
                            Object.keys(nowBrimg).map((k)=>
                            {//注入base 64 圖檔 browser
                                if(k.indexOf("/browser/"+bObj.browser+".")==0){
                                    bObj.browser = nowBrimg[k];
                                }
                            });

                            Object.keys(nowOSimg).map((k)=>
                            {//注入base 64 圖檔 os
                                if(k.indexOf("/os/"+((bObj.OS.toLowerCase().indexOf("iphone")>-1 || bObj.OS.toLowerCase().indexOf("ipod")>-1)?"iPhone:iPod":bObj.OS)+".")>-1){
                                    bObj.OS = nowOSimg[k];
                                }
                            });
                            val["redata"] =  bObj;
                        });

                        $t.ipList = e.data as Array<reProxyIp>;


                        $t.IPtotal = e.total as number;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中！");
                    }
                });
            });

            pb.v($t.mainTemp,"head_temp").async((HeadTemp:pub.mainHeadTemp)=>
            {
                if(HeadTemp.targetPageName == "MgWatch")
                {//refresh
                    setTimeout(()=>{
                        self.ipListfun();
                    },6000);
                }
            });
        });
     }

    /**
     * 當前已鎖定IP
     */
    private LockIPListfun = ()=>
    {
        Login((x)=>x.post("/mg/mb/sysandchief/iplock"),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                $t.ipLockList = e.data as Array<jDB.IPLock>;
            }
            else
            {
                mt.viewAlert("伺服器忙線中！");
            }
        });
    }

    /**
     * IP設定
     * @param ip ip
     */
    ipSet= (ip:string)=>
    {
        mt.viewConfirm("是否設定IP&nbsp;"+ip+"？",()=>
        {
            Login((x)=>x.post("/mg/mb/sysandchief/iplockedit").input({ip:ip}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    /** ip 是否已存在於陣列裡 */
                    let existIP:boolean = false;
                    ($t.ipLockList as Array<jDB.IPLock>).forEach((val,nu)=>{
                        if(val.ip==ip)
                        {
                            existIP=true;
                            val.lock = e.data.lock;
                        }
                    });

                    let createObj:Array<jDB.IPLock> = [];
                    if(!existIP)
                    {//add list
                        /**
                         * 重建 進入ip
                         */
                        let createObjIp:Array<jDB.Proxy_mbIP> =[];
                        ($t.ipList as Array<jDB.Proxy_mbIP>).forEach((val,nu)=>{
                            if(e.data.ip != val.ip)
                            {
                                createObjIp.push(val);
                            }
                        });
                        $t.ipList = createObjIp;
                        createObj.push(e.data);
                    }

                    ($t.ipLockList as Array<jDB.IPLock>).forEach((val,nu)=>{
                        createObj.push(val);
                    });
                    $t.ipLockList = createObj;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null,$t.main.pub.lib.src('lock.png'));
    }

    /**
     * 移除IP設定
     * @param ip ip
     */
     RemoveIpSet= (ip:string)=>
     {
        
        mt.viewConfirm("是否刪除IP設定&nbsp;"+ip+"？",()=>
        {
            Login((x)=>x.post("/mg/mb/sysandchief/iplockdel").input({ip:ip}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    /**
                     * 重建 lock ip
                     */
                    let createObj:Array<jDB.IPLock> =[];
                    ($t.ipLockList as Array<jDB.IPLock>).forEach((val,nu)=>{
                        if(val.ip!=ip)
                        {
                            createObj.push(val);
                        }
                    });

                    $t.ipLockList = createObj;
                }
                else
                {
                    mt.viewAlert("伺服器忙線中！");
                }
            });
        },null,$t.main.pub.lib.src('unlock.png'));
     }
    
};
import ajaxM from "../../../models/ajax";
import * as jEnum from "../../../JsonInterface/enum";
import * as jDB from "../../../JsonInterface/db";
import pbM from "../../../models/pb";
import iLoad from "../../../models/importLoad";
import * as vue from "../../../models/vueComponent";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import * as pE from "../pubExtendCtr";
import doc from "../../../JsonInterface/doc";
import * as pub from "../../../JsonInterface/pub";

/**
 * 標籤 bag
*/
interface LabelBagCtr extends jDB.LabelBag
{
    /** 是否編緝 */
    edit:boolean,
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** load file、document */
let Jobj:jObjM;
/** 文章載入內容共用 */
let docload:doc;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 系統共用 */
let main:pub.main;
/** 注入 psyl vue template */
let vueComponent:vue.vueComponent;
/** psyl oad system */
let importLoad:iLoad;

/** 書籤背包 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        vueComponent = $eObj.vueComponent;
        importLoad = $eObj.importLoad;
        self = this;
        main = $t.main;
        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(Login==null)
            {
                Login = ((eh as any).mainTemp.$m.h.Login as pub.Login);
                docload = new doc({
                    main:main,
                    mainTemp:(eh as any).mainTemp
                },$eObj);
            }
        });
    }

    /** 偵聽是否取得一次(資料陣列) */
    private catchFirst:boolean =false;
    /**
     * 取標籤
    */
     serList = ()=>{
        if(Login!=null)
        {
            pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
            {
                if(eh.load==0)
                {//防連點
                    Login((x)=>x.post("/ma/mg/lb/list"),(e:any)=>
                    {
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            (e.data as Array<LabelBagCtr>).forEach((val,nu)=>{
                                val.edit = false;
                            });
                            $t.tagbag = (e.data as Array<LabelBagCtr>); 
                        }
                        else
                        {
                            ($t as pub.mainTemp).viewAlert($t.main.pub.config.get("error").svbusy);
                        }
                        self.catchFirst=true;
                    });
                }
                else
                {
                    if(!self.catchFirst)
                    {
                        setTimeout(()=>{
                            self.serList();
                        },100);
                    }
                }
            });
        }
        else
        {
            setTimeout(()=>
            {
                self.serList();
            },300);
        }
    }

     /**
     * 標籤add
     * @param tp docType enum
     * @param path tag 內容
    */
    insert = (tp:number,path:string,title:string)=>{
        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if([jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.Edit,jEnum.Enum_MBLevel.systemMG ].indexOf(eh.mbdata.level)>-1
             || Number(eh.mbdata.status.split("#")[0])>=2000)
            {
                if(eh.load==0)
                {//防連點
                    let insertCK:boolean =true;
                    ($t.tagbag as Array<LabelBagCtr>).forEach((val,nu)=>{
                        if(path==val.path && val.tp==tp)
                        {
                            insertCK=false;
                        }
                    });

                    if(insertCK)
                    {
                        Login((x)=>x.post("/ma/mg/lb/insert").input({tp:tp,path:path,name:title.substr(0,9)}),(e:any)=>
                        {
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                e.data.edit=false;
                                let newData:Array<LabelBagCtr> = [e.data];
                                ($t.tagbag as Array<LabelBagCtr>).forEach((val,nu)=>
                                {
                                    newData.push(val);
                                });
                                $t.tagbag = newData; 
                            }
                            else
                            {
                                ($t as pub.mainTemp).viewAlert($t.main.pub.config.get("error").svbusy);
                            }
                        });
                    }
                }
                
            }
            else
            {//點數不夠
                ($t as pub.mainTemp).ViewAlertAtClose(main.pub.config.get("error").notpoint,null,3,main.pub.lib.src('coin.png'));
            }
        });
    }

    /**
     * 標籤刪除
     * @param obj 書籤
     * @param ckConfirm 顯示訪問移除
    */
    del = (obj:LabelBagCtr,ckConfirm:boolean)=>{
        pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                let RemoveTag:()=>void = ()=>
                {
                    Login((x)=>x.post("/ma/mg/lb/del").input({key:obj.key}),(e:any)=>
                    {
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            let newData:Array<LabelBagCtr> = [];
                            ($t.tagbag as Array<LabelBagCtr>).forEach((val,nu)=>{
                                if(val.key!=obj.key)
                                {
                                    newData.push(val);
                                }
                            });

                            $t.tagbag = newData; 
                            if(newData.length==0)
                            {//無標任何標籤情況
                                $t.showTagBag=false;
                            }
                        }
                        else
                        {    
                            $t.viewAlert($t.main.pub.config.get("error").svbusy);
                        }
                    });
                };

                if(ckConfirm)
                {
                    ($t as pub.mainTemp).viewConfirm( $t.main.pub.config.get("error").deleteBag+"(No."+obj.nu+")",RemoveTag,null,main.pub.lib.src('tagbag.png'));
                }
                else
                {
                    RemoveTag();
                }
            }
        });
    }

    /**
     * 標籤更名
     * @param obj 書籤
    */
    edit = (obj:LabelBagCtr)=>{
        if(obj.edit){
            ($t as pub.mainTemp).viewConfirm( $t.main.pub.config.get("error").edit,()=>{

                pb.v($t,"head_temp").async((eh:pub.mainHeadTemp)=>
                {
                    if(eh.load==0)
                    {//防連點
                        (Login as pub.Login)((x)=>x.post("/ma/mg/lb/edit")
                        .input({key:obj.key,name:obj.name}),(e:any)=>{
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                obj.name=e.data.name;
                                obj.edit=false;
                            }
                            else
                            {
                                $t.viewAlert($t.main.pub.config.get("error").svbusy);
                            }
                        });
                    }
                });

            },()=>{
                obj.edit=false;
            },main.pub.lib.src('edit.png'));
        }
        else
        {
            obj.edit=true;
        }
    }

    /** 開起文章 */
    opeTag = (obj:LabelBagCtr)=>
    {   if(obj.tp!= jEnum.Enum_docType.url)
        {
            $t.gotoTagBag = true;
            if(obj.tp == jEnum.Enum_docType.Ativity || obj.tp == jEnum.Enum_docType.pcar)
            {//直接開分頁
                docload.getLabel({  
                    path: obj.path,
                    tp : obj.tp,
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
                        e2.openBag=true;//標籤樣單獨關閉
                        $t.showTagBag=false;
                        pb.v(e2,"docVue").async((e3)=>
                        {
                            if(e3.tag.path != obj.path || e3.tag.tp != obj.tp)
                            {
                                e3.tag.path = obj.path;
                                e3.tag.tp = obj.tp;
                                e3.tag.show = false;
                                e3.tag.content = null;
                                e3.main$m.$m.main.getLabel(e3.tag,'','',0);
                            }
                        });
                    });
                });
            }
        }
        else
        {//超連接
            window.open(obj.path,'_blank');
        }
    }
}
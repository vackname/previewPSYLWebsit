import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import doc from "../../../JsonInterface/doc";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** 文章載入內容共用 */
let docload:doc;
/** index model */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
        docload = new doc($tObj,$eObj);
    }

    getDocType=()=>
    {
        $t.docTypeList = pub.docTypeCT();
    }

    /** 標籤前往 */
    getLabel=(val:pub.markPathCtr,animateName:string,tagAnimateName:string,colorTag:number)=>docload.getLabel(val,animateName,tagAnimateName,colorTag);

    /**
     * 新聞more
     * @param val 
     * @param animateName image載入動畫名
     */
    NewsLabelMoreData=(val:pub.NewsCtr,animateName:string)=> docload.NEWSmoreData(val,"",animateName);
    
    /** show temp 文章 */
    showTemp=(tp:jEnum.Enum_docType):string=> docload.showTemp(tp);

    /** 之前文章/後續文章載入 
     * @param open 開起文章欄位
    */
    catchShowTemp=(val:pub.NewsCtr,open:string)=>
    {
        Login((x)=>x.post(docload.docConnectionName(((open=='b')?val.btp:val.ftp))+"/main/data/doclist").input({key:((open=='b')?val.bkey:val.fkey)}),(obj:any)=>
        {
            if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
            {
                if(open=='b')
                {//之前
                    //load
                    val.bContent = docload.createFormatTemp(obj.data,val.btp,true,'',2,1);
                    val.bshow = true;
                }
                else if(open=='af')
                {//後續
                    //load
                    val.afContent = docload.createFormatTemp(obj.data,val.ftp,true,'',2,2);
                    val.afshow = true;
                }
            }
            else if(Number(obj.error)==jEnum.Enum_SystemErrorCode.limit)
            {
                mt.viewAlert( main.pub.config.get("error").stopdoc,()=>{},main.pub.lib.src('lock.png'));
            }
            else
            {
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
        });
}

    /** 取得顯示文章項目分類選擇細項
     * @param selfclassmain 文章大類項
     * @param fun 注入執行另一階段 function
     */
     selfCatchClass=(selfclassmain:string,fun:Function)=>
     {
        docload.selfCatchClass(jEnum.Enum_docType.News,selfclassmain,fun,$t.newsctcs);
     }

     /** 初始化*/
     initLoad = ()=>
     {
        docload.classFirst(jEnum.Enum_docType.News,(e)=>{
            $t.newsctcs = e as Array<jDB.NewsClassNameTitle>;
            self.serData(true);//first 搜尋;
         });
     };
     
      /**
       * 取得所有文章內容
       * @param val 
       */
      moreData=(val:pub.NewsCtr)=>
      {
        val.loadDoc[main.pub.lang as any] = true;
        Login(x2 => x2.post("/ns/mg/mb/newsfile/"+val.key+"_"+ main.pub.langNu+"_"+val.uid),(obj2:any)=>
        {//載入段落 file
            if(Number(obj2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 取得文字資料 */
                let catchFile:Array<jDB.DocFileFormat> = obj2.data;

                val.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                { 
                     ((obj2.imgdata as Array<jDB.DocPath>)[nu2].imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val3:pub.DocImgFileFormatCtr,nu3:number)=>{
                        val3["update"]=false;//建置欄位
                        if(val3.titleAry.length < ($t.main as pub.main).pub.langAry.length)
                        {//補語系位置
                            for(let a=val3.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                val3.titleAry.push("");
                            }
                        }
                    });

                    if(val2.imgAry.length==0)
                    {//已存在圖檔無需消除memory(轉換語系)
                        val2.imgAry = (obj2.imgdata as Array<jDB.DocPath>)[nu2].imgAry as Array<pub.DocImgFileFormatCtr>;
                    }
                });

                val.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                {
                    /** 注入file 段落 格式 */
                    let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                    if(getFileContent.content==null)
                    {//注入格式
                        getFileContent.content={};
                        getFileContent["ybeInput"] = "";
                        getFileContent["update"] = false;
                        getFileContent["IMGupdate"] = false;
                        getFileContent["imgfileAry"] = [];
                        getFileContent["imgfile"] = null;
                        getFileContent["objImg"] = new (Jobj as any)();
                    }

                    getFileContent.content[main.pub.lang] = catchFile[nu2];
                    let getContentAny:any={};//重新注冊content
                    Object.keys(getFileContent.content).map((key)=>{
                        getContentAny[key] = getFileContent.content[key];
                    });
                    getFileContent.content = getContentAny;
                    /** 偵聽圖片是否已進入載入階段(不重覆載入) */
                    let imgStartLoad:boolean=false;
                    ($t.datalist as Array<pub.NewsCtr>).forEach((valRe,nuRe)=>
                    {/* 重新註注冊 */
                        if(val.key == valRe.key)
                        {
                            let getAny:any={};
                            Object.keys(valRe.loadDoc).map((key)=>
                            {
                                getAny[key] = val.loadDoc[key as any];
                                if(!imgStartLoad && key != main.pub.lang)
                                {
                                    imgStartLoad = getAny[key];
                                }
                            });
                            valRe.loadDoc = getAny;
                        }
                    });

                    if(!imgStartLoad)
                    {
                        /** 分段式載入 */
                        let waitTime:number=nu2*100;
                        setTimeout(()=>{
                            /** 取出圖片 */
                            let imgAry:Array<string>=[];
                            (val2.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val3:pub.DocImgFileFormatCtr,nu3:number)=>{
                                imgAry.push(val3.path);
                            });

                            getFileContent.objImg//緩儲圖片容器
                            .loadimgjson("/ns/newsmgimg/"+val.uid+"/"+val.key)//載入圖片
                            .input(imgAry)
                            .async((e3,next3)=>
                            {   
                                e3.forEach((val3,nu3)=>{
                                    $t.$an.main.loadImg('loadPhoto'+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
                                });
                                /** 匹次載圖 */
                                let reNext = (re:(fun:nextImgLoad)=>void)=>
                                {//圖片載入完成 imglist

                                    /** 重建圖層更新 get set */
                                    let reImgAry:Array<jDB.DocImgFileFormat> = [];
                                    val2.imgAry.forEach((val2,nu2)=>{
                                        reImgAry.push(val2);
                                    });
                                    val2.imgAry = reImgAry;

                                    if(re!=null)
                                    {
                                        re((e4,next4)=>
                                        {
                                            e4.forEach((val3,nu3)=>{
                                                $t.$an.main.loadImg('loadPhoto'+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
                                            });
                                            reNext(next4);
                                        });
                                    }
                                }
                                reNext(next3);
                            });
                        },waitTime);
                    }
                });
                
            }
            else
            {//異常
                val.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                {
                    /** 注入file 段落 格式 */
                    let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                    getFileContent.content = {};
                    getFileContent.content[main.pub.lang] = {title:"",content:""};
                });
            }

            pb.v($t,"Newsvue").async((e)=>
            {
                let redata:Array<pub.NewsCtr> = [];
                (e.main$m.datalist as Array<pub.NewsCtr>).forEach((valRe,nuRe)=>
                {//重新注入
                    if(valRe.key== val.key)
                    {
                        redata.push(val);
                    }
                    else
                    {
                        redata.push(valRe);
                    }
                });
                e.main$m.datalist = redata;
            });
        });
      }

    /**
     * 切換語系取的first 資料
     * @param fun 等候圖片載入完成
     */
    getFileFirst=(val:pub.NewsCtr,fun:(obj:pub.NewsCtr)=>void)=>
    {
        if(val.titleAry.length< ($t.main as pub.main).pub.langAry.length)
        {//補語系位置
            for(let a=val.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
            {
                val.titleAry.push("");
            }
        }
        
        if(val["loadDoc"]==null || val["loadDoc"] == undefined)
        {
            val["loadDoc"] = {} as [x:boolean];//創建欄位
            val.loadDoc[main.pub.lang as any]=false;//創建語系欄位
        }
        else
        {
            val.loadDoc[main.pub.lang as any]=false;//創建語系欄位
        }

        Login(x2 => x2.post("/ns/mg/mb/newsfilefirst/"+val.key+"_"+ main.pub.langNu+"_"+val.uid),(obj2:any)=>
        {//載入段落 file
            if(Number(obj2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                if(val.langLoad==null)
                {//create 欄位
                    val = docload.createFormatTemp(val,jEnum.Enum_docType.News,false,'',0,0);
                }
                /** 取得文字資料 */
                let catchFile:Array<jDB.DocFileFormat> = obj2.data;

                /** 載入圖片 */
                let loadCount:number=0;
                val.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                {
                    /** 注入file 段落 格式 */
                    let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                    if(getFileContent.content==null)
                    {//注入格式
                        getFileContent.imgAry=[];
                        getFileContent.content={};
                        getFileContent["ybeInput"] = "";
                        getFileContent["update"] = false;
                        getFileContent["IMGupdate"] = false;
                        getFileContent["imgfileAry"] = [];
                        getFileContent["imgfile"] = null;
                        getFileContent["objImg"] = new (Jobj as any)();
                    }

                    if(getFileContent.content[main.pub.lang]==null)
                    {
                        getFileContent.content[main.pub.lang] = ((catchFile.length>nu2)?catchFile[nu2]:
                        {//建立空但格式
                            title:"",
                            content:"",
                        }) as jDB.DocFileFormat;
                        if( getFileContent.content[main.pub.lang]!=null)
                        {
                            loadCount++;
                            /** 取出圖片 */
                            let imgAry:Array<string>=[];
                            let createNew:Array<pub.DocImgFileFormatCtr> = [];
                            (val2.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val3,nu3)=>
                            {
                                val3["update"]=false;
                                if(val3.titleAry.length < ($t.main as pub.main).pub.langAry.length)
                                {//補語系位置
                                    for(let a=val3.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                    {
                                        val3.titleAry.push("");
                                    }
                                }
                                createNew.push(val3);
                                imgAry.push(val3.path);
                            });
                            val2.imgAry = createNew;

                            /** 分段式載入 */
                            let waitTime:number=nu2*100;
                            setTimeout(()=>{
                                getFileContent.objImg//緩儲圖片容器
                                .loadimgjson("/ns/newsmgimg/"+val.uid+"/"+val.key)//載入圖片
                                .input(imgAry)
                                .async((e2,next)=>
                                {//圖片載入完成再載入 imglist
                                    loadCount--;
                                    if(loadCount==0)
                                    {
                                        if(fun!=null && fun!=undefined)
                                        {
                                            fun(val);
                                        }
                                    }

                                });
                            },waitTime);
                        }
                        else
                        {//建置虛擬欄位
                            getFileContent.content[main.pub.lang] = {title:"",content:"" } as jDB.DocFileFormat
                        }
                    }
                });
            }
            else
            {//異常
                val.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                {
                    /** 注入file 段落 格式 */
                    let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                    if(getFileContent.content==null)
                    {//注入格式
                        getFileContent.content={};
                        getFileContent["ybeInput"] = "";
                        getFileContent["update"] = false;
                        getFileContent["IMGupdate"] = false;
                        getFileContent["imgfileAry"] = [];
                        getFileContent["imgfile"] = null;
                        getFileContent["objImg"] = new (Jobj as any)();
                    }
                    getFileContent.content[main.pub.lang] = {title:"",content:"" } as jDB.DocFileFormat;
                });
            }

            if(fun!=null && fun!=undefined)
            {//無列資料則 完成載入
                fun(val);
            }
        });
    }

     /** 搜尋文章(追蹤Join) data list(同 搜尋文章 )
     * @param traceKey 被trace 文章key
     * @param JoinKey create trace文章key
     */
     serStraceData=(traceKey:string,JoinKey:string)=>
     {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {//防連點
                pb.v($t,"toolvue").async(te=>{
                    Login(x => x.post("/ns/mg/newstrace")
                    .input({
                        trace:JSON.stringify([traceKey,JoinKey.replace('c_','')]),
                    })
                    ,(obj:any)=>
                    {
                        if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            $t.datalist = [];

                            obj.data.forEach((val:pub.NewsCtr,nu:number)=>
                            {//新增資料
                                val["edit"] = false;
                                val["update"] = false;
                                val["LABELupdate"] = false;
                                val["EVENTLABELupdate"] = false;

                                self.getFileFirst(val,()=>
                                {//段落資訊載入完成
                                    /**已存在文章 */
                                    let ckExist:boolean = false;
                                    ($t.datalist as Array<pub.NewsCtr>).forEach((val2:pub.NewsCtr,nu2:number)=>{
                                        if(val2.key==val.key)
                                        {
                                            ckExist=true;
                                        }
                                    });
                                    if(!ckExist)
                                    {//不存在擇加入list清單
                                        $t.datalist.push(val);
                                    }
                                });
                                
                            });
                        }
                        else
                        {
                            mt.viewAlert( main.pub.config.get("error").svbusy);
                        }
                
                    });
                });
            }
        });
    }

     /** first載入 */
     private firstLoad:boolean=true;
     /** 搜尋文章 data list
     * @param init 是否初始化
     */
     serData=(init:boolean)=>
     {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0 || this.firstLoad)
            {//防連點
                this.firstLoad = false;
                if(!init)
                {
                    $t.$an.main.serPage();//更多文章按鈕動畫
                }
                /** 取發布時間 */
                let pagetime:number=(($t.datalist.length>0 && !init)?(($t.datalist[$t.datalist.length-1].publish>0)?$t.datalist[$t.datalist.length-1].publish:$t.datalist[$t.datalist.length-1].date):0);

                /** 排除同時間已取得key */
                let fkey:Array<string>=[];
                if(!init)
                {
                    ($t.datalist as Array<pub.NewsCtr>).forEach((val,nu)=>
                    {
                        if(pagetime==((val.publish>0)?val.publish:val.date))
                        {
                            fkey.push(val.key);
                        }
                    });
                }

                pb.v($t,"toolvue").async(te=>{
                    Login(x => x.post("/ns/mg/newslist")
                    .input({
                        ser:te.InputSer,
                        pagetime:pagetime,
                        fkey:JSON.stringify(fkey),
                        selfclass:((te.selfclassmain!="333")?((te.selfclass=="999")?"999"+te.selfclassmain:te.selfclass):"333")
                    })
                    ,(obj:any)=>
                    {
                        if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            if(init)
                            {                                
                                //初始化搜尋
                                $t.datalist = [];
                            }

                            obj.data.forEach((val:pub.NewsCtr,nu:number)=>
                            {//新增資料
                                val["edit"] = false;
                                val["update"] = false;
                                val["LABELupdate"] = false;
                                val["EVENTLABELupdate"] = false;
                                
                                self.getFileFirst(val,()=>
                                {//段落資訊載入完成
                                    /**已存在文章 */
                                    let ckExist:boolean = false;
                                    ($t.datalist as Array<pub.NewsCtr>).forEach((val2:pub.NewsCtr,nu2:number)=>{
                                        if(val2.key==val.key)
                                        {
                                            ckExist=true;
                                        }
                                    });
                                    if(!ckExist)
                                    {//不存在擇加入list清單
                                        $t.datalist.push(val);
                                    }
                                });
                                
                            });
                        }
                        else
                        {
                            mt.viewAlert( main.pub.config.get("error").svbusy);
                        }
                
                    });
            });
            }
        });
     }
};
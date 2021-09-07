import * as jEnum from "./enum";
import * as pub from "./pub";
import * as jDB from "./db";

import ajaxM from "../models/ajax";
import pbM from "../models/pb";
import {jObj as jObjM,nextImgLoad} from "../models/Jobj/interface";
//取初始化設定
import * as initPE from "../init/model/pubExtendCtr";

/** temp this */
let $t:any | undefined;
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** load file  */
let Jobj:jObjM;
/** class this */
let self:model;
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** login */
let Login:pub.Login;
/** temp 文章共用控制器 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        Jobj = $eObj.Jobj;
        self = this;
        main = $tObj.main;
        $t = $tObj;
        mt = $tObj.mainTemp;
        Login = ($tObj.mainTemp.$m.h.Login as pub.Login);
    }

    /**
     * 作者資料
     * @param temp,樣版生成path
     * @param uid 作者uid
     */
    mbPreview=(temp:any,uid:string)=>
    {//公規樣版名 mbPreviewVue(作者 temp)
        pb.v(temp,"mbPreviewVue").async(mbTemp=>
        {
            Login((x)=> x.post("/ma/main/mb/content").input({uid:uid,nu:main.pub.langNu}), (obj)=> 
            {//取圖片
                if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                {//簡介內容
                    mbTemp.content = obj.data;
                    mbTemp.exist= obj.exist;
                    mbTemp.limit = false;
                    Login((x)=> x.post("/ma/main/mb/photo").input({uid:uid}), (obj)=> 
                    {//取圖片
                        if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                        {
                             mbTemp.objImg = new (Jobj as any)();
                            (mbTemp.objImg as jObjM)
                            .loadimgjson("/ma/mbimg/"+uid)//載入圖片
                            .input(obj.img)
                            .async((e3,next3)=>
                            {   
                                /** 匹次載圖 */
                                let reNext = (re:(fun:nextImgLoad)=>void)=>
                                {//圖片載入完成 imglist
                                    if(re!=null)
                                    {
                                        re((e4,next4)=>
                                        {
                                            reNext(next4);
                                        });
                                    }
                                }
                                mbTemp.photo = obj.img;
                                reNext(next3);
                            });
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                    });
                }
                else if (Number(obj.error) == jEnum.Enum_SystemErrorCode.limit)
                {
                    mbTemp.limit = true;
                }
                else
                {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
                $t.load=true;
            });
        });
     }



    /** 防止連點 */
    private notClick:boolean = false;
    /** 標籤前往 文章樣版或超連結
     * @param val 所在文章 list 樣版名
     * @param animateName 圖片載入名
     * @param tagAnimateName 標籤動畫
     * @param colorTag 文章標籤 boder left color
     */
    getLabel=(val:pub.markPathCtr,animateName:string,tagAnimateName:string,colorTag:number)=>
    {
        if(val.tp == jEnum.Enum_docType.url)
        {//超連接另開
            window.open(val.path,'_blank');
        }
        else if(val.content==null || val.content == undefined)
        {//load
            if([jEnum.Enum_docType.Product,jEnum.Enum_docType.Story].indexOf(val.tp)>-1)
            {//單載式文章(以圖為主) 例:首頁
                let url:string="";
                switch(val.tp)
                {
                    case jEnum.Enum_docType.Product:
                        url = "docdm";
                    break;
                    case jEnum.Enum_docType.Story:
                        url = "docstory";
                    break;
                }

                let imgPath:string="";
                switch(val.tp)
                {
                    case jEnum.Enum_docType.Product:
                        imgPath = "pdimg";
                    break;
                    case jEnum.Enum_docType.Story:
                        imgPath = "stimg";
                    break;
                }

                Login((x)=>x.post(self.docConnectionName(val.tp)+"/main/"+url).input({key:val.path}),(obj:any)=>
                {
                    if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                    {//載入
                    
                        if(obj.data.objImg == null)
                        {//建立圖片容器
                            obj.data.objImg = new (Jobj as any)();
                        }

                        obj.data.objImg//緩儲圖片容器
                        .loadimgjson(self.docConnectionName(val.tp)+"/"+imgPath+"/"+obj.data.key)//載入圖片
                        .input(obj.data.imgAry)
                        .async((e3:Array<string>,next3:(fun:nextImgLoad)=>void)=>
                        { 
                            /** 匹次載圖 */
                            let reNext = (re:(fun:nextImgLoad)=>void)=>
                            {       
                                /** 重建圖層更新 get set */
                                let reImgAry:Array<string> = [];
                                obj.data.imgAry.forEach((val3:string,nu3:number)=>{
                                    reImgAry.push(val3);
                                });
                                obj.data.imgAry = reImgAry;
                                //圖片載入完成 imglist
                                if(re!=null)
                                {
                                    re((e4,next4)=>
                                    {
                                        reNext(next4);
                                    });
                                }
                            }
                            reNext(next3);
                        });

                        val.content = obj.data;
                        val.show = true;
                        if(tagAnimateName!='')
                        {
                             self.TagOPen(tagAnimateName);
                        }
                    }
                    else if(Number(obj.error)==jEnum.Enum_SystemErrorCode.limit)
                    {//無權限給予 空文章
                        val.content ={
                            key:"",
                            display:false,
                            showt:true,
                            order:0,
                            titleAry:["Close Privew","Close Privew","Close Privew","Close Privew","Close Privew"],
                            title2Ary:["","","","","",""],
                            imgAry:[],
                            imgwp:false,
                            descriptionAry:["","","","","",""],
                            date:pb.unixReNow(),
                           }
                            val.show = true;
                            if(tagAnimateName!='')
                            {
                              self.TagOPen(tagAnimateName);
                            }
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
            else if(val.tp == jEnum.Enum_docType.Ativity)
            {//前往報名privew
                if(mt.head.singCK)
                {//登入狀態
                    if(!mt.gotoTagBag)
                    {
                        mt.gotoPageHistory = mt.NuView;//記錄反回緩存區
                    }

                    mt.$m.h.ac.MGActivityLoad((n:string)=>
                    {//bag 進入不緩存
                        mt.NuView = initPE.enum_pag.MGActivity;
                        mt.$m.h.ChangePj(mt.NuView,n);
                        pb.v(mt,n).async((topj)=>
                        {
                            topj.indexGoto = true;
                            topj.key=val.path;
                            topj.OutInto = true;//外部進入
                            topj.toPay=true;
                            pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
                            {
                                eh.firstHome = true;//是否顯示home鈕
                            });
                            pb.v(topj,"AcPayVue").async((e)=>
                            {
                                /** 等候 model 載入完成 */
                                let wait:Function=()=>{
                                    if(e.$m!=null){
                                        e.$m.main.readDoc();//初始化page
                                    }
                                    else
                                    {
                                        setTimeout(()=>{ wait(); },100);
                                    }
                                }
                                setTimeout(()=>{ wait(); },100);
                                e.data.key="";
                            });
                            
                        });
                    });
                }
                else
                {//經由URL 前往分頁
                    window.open(window.location.protocol.split(':')[0]+"://"+window.location.host+"/u/"+jEnum.Enum_docType.Ativity+"/"+val.path);
                }
            }
            else if(val.tp == jEnum.Enum_docType.pcar)
            {//前往商城
                if(!mt.gotoTagBag)
                {//bag 進入不緩存
                    mt.gotoPageHistory = mt.NuView;//記錄反回緩存區
                }
                mt.$m.h.pc.productCityLoad((n:string)=>
                {
                    mt.NuView = initPE.enum_pag.productcar;
                    mt.$m.h.ChangePj(mt.NuView,n);
                    pb.v(mt,n).async((topj)=>
                    {
                        topj.key=val.path;
                        topj.OutInto = true;//外部進入
                        topj.showDetail=true;
                        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
                        {
                            eh.firstHome = true;//是否顯示home鈕
                        });
                        pb.v(topj,"pDetailTemp").async((e)=>
                        {
                            e.data.key="";
                            /** 等候 model 載入完成 */
                            let wait:Function=()=>{
                                if(e.$m!=null){
                                    e.$m.main.productLoad();//初始化page
                                }
                                else
                                {
                                    setTimeout(()=>{ wait(); },100);
                                }
                            }
                            setTimeout(()=>{ wait(); },300);
                            
                        });
                        
                    });
                });
            }
            else
            {//多載式文章 例:新聞、彩踩
                Login((x)=>x.post(self.docConnectionName(val.tp)+"/main/data/doclist").input({key:val.path}),(obj:any)=>
                {
                    if(Number(obj.error)==jEnum.Enum_SystemErrorCode.Null)
                    {//載入
                        val.content =  self.createFormatTemp(obj.data,val.tp,true,animateName,colorTag,0);
                        val.show = true;
                        self.TagOPen(tagAnimateName);
                    
                    }
                    else if(Number(obj.error)==jEnum.Enum_SystemErrorCode.limit)
                    {//無權限給予 空文章
                        val.lock=true;
                        /** 空文章 序列化 data */
                        let docEmptyData:any=null;
                        if(val.tp==jEnum.Enum_docType.News)
                        {//新聞空序列
                            let docEmpty:pub.NewsCtr = {} as pub.NewsCtr;
                            docEmpty.key="";
                            docEmpty.langAry=[];
                            docEmpty.codekey="";
                            docEmpty.btp=-1;
                            docEmpty.bkey="";
                            docEmpty.fkey="";
                            docEmpty.ftp=-1;
                            docEmpty.display=true,
                            docEmpty.titleAry=["Close Privew","Close Privew","Close Privew","Close Privew","Close Privew"];
                            docEmpty.readPathAry=[];
                            docEmpty.nckey="";
                            docEmpty.mdocAry=[];
                            docEmpty.docAry=[];
                            docEmpty.uid="";
                            docEmpty.date=0;
                            docEmpty.publish=0;
                            docEmpty.mark="";
                            docEmpty.btp=jEnum.Enum_docType.News;
                            docEmpty.ftp=jEnum.Enum_docType.News;
                            docEmpty.date=pb.unixReNow();
                            docEmpty.publish=pb.unixReNow();
                            docEmptyData = docEmpty;
                        }else if(val.tp==jEnum.Enum_docType.Newscc)
                        {//採踩空序列
                            let docEmpty:pub.NewsccCtr = {} as pub.NewsccCtr;
                            docEmpty.key="";
                            docEmpty.langAry=[];
                            docEmpty.art="";
                            docEmpty.codekey="";
                            docEmpty.btp=-1;
                            docEmpty.bkey="";
                            docEmpty.fkey="";
                            docEmpty.ftp=-1;
                            docEmpty.display=true,
                            docEmpty.titleAry=["Close Privew","Close Privew","Close Privew","Close Privew","Close Privew"];
                            docEmpty.readPathAry=[];
                            docEmpty.nckey="";
                            docEmpty.mdocAry=[];
                            docEmpty.docAry=[];
                            docEmpty.uid="";
                            docEmpty.date=0;
                            docEmpty.publish=0;
                            docEmpty.mark="";
                            docEmpty.btp=jEnum.Enum_docType.Newscc;
                            docEmpty.ftp=jEnum.Enum_docType.Newscc;
                            docEmpty.date=pb.unixReNow();
                            docEmpty.publish=pb.unixReNow();
                            docEmptyData = docEmpty;
                        }
                        mt.viewAlert( main.pub.config.get("error").stopdoc,()=>{},main.pub.lib.src('lock.png'));
                        val.content =  self.createFormatTemp(docEmptyData,val.tp,true,animateName,colorTag,0);
                        val.show = true;
                        self.TagOPen(tagAnimateName);
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        }
    }

    /** 標籤引入動畫 */
    private TagOPen = (key:string)=>
    {
        if(pb.el.id(key).exist)
        {
            pb.el.id(key)
            .animate({"duration":0.3,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"width": "5px","top":"-90px","left":"40px"},
                "100%":{"width": "30px","top":"-60px","left":"5px"},
            }).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                self.TagOPen(key);
            },20);
        }
    }

    /** 圖片匹次載入動畫
     * @param count 20秒後不在等候動畫
     */
    private loadImg = (key:string,count:number)=>
    {
        if(pb.el.id('d'+key).exist)
        {
            pb.el.id('d'+key).style({"display":"none"});
        }

        if(pb.el.id(key).exist)
        {
            pb.el.id(key)
            .animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0.1"},
                "100%":{"opacity": "1"},
            }).frame((e)=>{
                if(pb.el.id('d'+key).exist)
                {
                    pb.el.id('d'+key).style({"display":"none"}).remove()
                    .animate({"duration":0.3,"delay":0,"count":1},
                    {//漸顯動畫
                        "0%":{"opacity": "0.1"},
                        "100%":{"opacity": "1"},
                    });
                }
            }).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                count--;
                self.loadImg(key,count);
            },20);
        }
    }

    /**
     * (新聞媒體更多文章)取得所有文章內容
     * @param val 新聞foramt
     * @param tempName 渲染樣版name
     * @param animateName 動畫keyname
     */
    NEWSmoreData=(val:pub.NewsCtr,tempName:string,animateName:string)=>
    {
        val.loadDoc[main.pub.lang as any] = true;

        /** 重取Doc 檔 */
        let newDoc:Array<jDB.DocPath> =[];
        val.docAry.forEach((getV,getNu)=>{
            newDoc.push({ path:getV.path,img:[],imgAry:[],WallPaper:getV.WallPaper,ybe:""});
        });
        Login(x2 => x2.post("/ns/main/data/newsfile/"+val.key+"_"+ main.pub.langNu+"_"+val.uid).input({"contentList":JSON.stringify(newDoc)}),(obj2:any)=>
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
                        getFileContent["update"] = false;
                        getFileContent["IMGupdate"] = false;
                        getFileContent["imgfileAry"] = [];
                        getFileContent["imgfile"] = null;
                        getFileContent["objImg"] = new (Jobj as any)();
                    }

                    getFileContent.content[main.pub.lang] = catchFile[nu2];
                    /** 偵聽圖片是否已進入載入階段(不重覆載入) */
                    let imgStartLoad:boolean=false;
                    let getContentAny:any={};//重新注冊content
                    Object.keys(getFileContent.content).map((key)=>{
                        getContentAny[key] = getFileContent.content[key];
                    });
                    getFileContent.content = getContentAny;
                    
                    let getAny:any={};
                    Object.keys(val.loadDoc).map((key)=>
                    {
                        getAny[key] = val.loadDoc[key as any];
                        if(!imgStartLoad && key != main.pub.lang)
                        {
                            imgStartLoad = getAny[key];
                        }
                    });
                    val.loadDoc = getAny;

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
                            .loadimgjson("/ns/newsimg/"+val.uid+"/"+val.key)//載入圖片
                            .input(imgAry)
                            .async((e3,next3)=>
                            { 
                                e3.forEach((val3,nu3)=>{
                                    self.loadImg(animateName+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
                                });
                                /** 匹次載圖 */
                                let reNext = (re:(fun:nextImgLoad)=>void)=>
                                {       
                                    /** 重建圖層更新 get set */
                                    let reImgAry:Array<jDB.DocImgFileFormat> = [];
                                    val2.imgAry.forEach((val2,nu2)=>{
                                        reImgAry.push(val2);
                                    });
                                    val2.imgAry = reImgAry;

                                    //圖片載入完成 imglist
                                    if(re!=null)
                                    {
                                        re((e4,next4)=>
                                        {
                                            e4.forEach((val3,nu3)=>{
                                                self.loadImg(animateName+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
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
            if(tempName!='')
            {//無樣版狀態為 label us
                pb.v($t,tempName).async((e)=>
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
            }

        });
    }
    //------

    /**
     * (彩踩媒體更多文章)取得所有文章內容
     * @param val 新聞foramt
     * @param tempName 渲染樣版name
     * @param animateName 動畫keyname
     */
     NEWSccmoreData=(val:pub.NewsccCtr,tempName:string,animateName:string)=>
     {
         val.loadDoc[main.pub.lang as any] = true;
 
         /** 重取Doc 檔 */
         let newDoc:Array<jDB.DocPath> =[];
         val.docAry.forEach((getV,getNu)=>{
             newDoc.push({ path:getV.path,img:[],imgAry:[],WallPaper:getV.WallPaper,ybe:""});
         });
         Login(x2 => x2.post("/nscc/main/data/newsfile/"+val.key+"_"+ main.pub.langNu+"_"+val.uid).input({"contentList":JSON.stringify(newDoc)}),(obj2:any)=>
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
                         getFileContent["update"] = false;
                         getFileContent["IMGupdate"] = false;
                         getFileContent["imgfileAry"] = [];
                         getFileContent["imgfile"] = null;
                         getFileContent["objImg"] = new (Jobj as any)();
                     }
 
                     getFileContent.content[main.pub.lang] = catchFile[nu2];
                     /** 偵聽圖片是否已進入載入階段(不重覆載入) */
                     let imgStartLoad:boolean=false;
                     let getContentAny:any={};//重新注冊content
                     Object.keys(getFileContent.content).map((key)=>{
                         getContentAny[key] = getFileContent.content[key];
                     });
                     getFileContent.content = getContentAny;
                     
                     let getAny:any={};
                     Object.keys(val.loadDoc).map((key)=>
                     {
                         getAny[key] = val.loadDoc[key as any];
                         if(!imgStartLoad && key != main.pub.lang)
                         {
                             imgStartLoad = getAny[key];
                         }
                     });
                     val.loadDoc = getAny;
 
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
                             .loadimgjson("/nscc/newsimg/"+val.uid+"/"+val.key)//載入圖片
                             .input(imgAry)
                             .async((e3,next3)=>
                             { 
                                 e3.forEach((val3,nu3)=>{
                                     self.loadImg(animateName+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
                                 });
                                 /** 匹次載圖 */
                                 let reNext = (re:(fun:nextImgLoad)=>void)=>
                                 {       
                                     /** 重建圖層更新 get set */
                                     let reImgAry:Array<jDB.DocImgFileFormat> = [];
                                     val2.imgAry.forEach((val2,nu2)=>{
                                         reImgAry.push(val2);
                                     });
                                     val2.imgAry = reImgAry;
 
                                     //圖片載入完成 imglist
                                     if(re!=null)
                                     {
                                         re((e4,next4)=>
                                         {
                                             e4.forEach((val3,nu3)=>{
                                                 self.loadImg(animateName+val.key+'_'+val2.path+'_'+val3.split('.')[0],1000);//圖片載入完成動畫
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
             if(tempName!='')
             {//無樣版狀態為 label us
                 pb.v($t,tempName).async((e)=>
                 {
                     let redata:Array<pub.NewsccCtr> = [];
                     (e.main$m.datalist as Array<pub.NewsccCtr>).forEach((valRe,nuRe)=>
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
             }
 
         });
     }
     //------

    /** show temp 文章(temp 統一命名) */
    showTemp=(tp:jEnum.Enum_docType):string=>
    {
        let vuename:string="";
        switch(tp)
        {
            case jEnum.Enum_docType.News:
                vuename = "newslivue";
            break;
            case jEnum.Enum_docType.Newscc:
                vuename = "newscclivue";
            break;
            case jEnum.Enum_docType.Product:
                vuename = "pDMliVue";
            break;
            case jEnum.Enum_docType.Story:
                vuename = "storyliVue";
            break;
        }
        return vuename;
    }

    /** 文章線路名(文章 統一命名後端連線) */
    docConnectionName=(tp:jEnum.Enum_docType):string=>
    {
        let url:string="";
        switch(tp)
        {
            case jEnum.Enum_docType.News:
                url= "/ns";
            break;
            case jEnum.Enum_docType.Newscc:
                url= "/nscc";
            break;
            case jEnum.Enum_docType.Product:
            case jEnum.Enum_docType.Story:
                url= "/ma";
            break;
        }
        return url;
    }

    /** 取文章分類 list(文章 統一格式) */
    classFirst=(tp:jEnum.Enum_docType,asyncFun:(ary:Array<any>)=>void)=>
    {
        switch(tp)
        {
            case jEnum.Enum_docType.News:
               self.classFirstNews(asyncFun);
            break;
            case jEnum.Enum_docType.Newscc:
                self.classFirstNewscc(asyncFun);
             break;
        }
    }


    /** 分類名第二層 文章 search list(文章 統一格式)
      * @param obj 第二層分類json:any
      * @param fun 取用完成後執行 function
      */
    private classSeList = (tp:jEnum.Enum_docType,obj:any,fun:Function)=>
    {
        switch(tp)
        {
            case jEnum.Enum_docType.News:
               self.classSeListNews(obj,fun);
            break;
            case jEnum.Enum_docType.Newscc:
                self.classSeListNewscc(obj,fun);
             break;
        }
    }

    /** 取得顯示文章項目分類選擇細項
     * @param selfclassmain 文章大類項
     * @param fun 注入執行另一階段 function
     * @param ctcs 第一層陣列
     */
    selfCatchClass=(tp:jEnum.Enum_docType,selfclassmain:string,fun:Function,ctcs:Array<any>)=>
    {
        ctcs.forEach((val:any,nu:number)=>{
            if(selfclassmain==val.key){
                if(val.cl.length==0){//還原顯示
                    self.classSeList(tp,val,()=>{
                        fun(val.cl);
                    });
                }else{
                    fun(val.cl);
                }
            }
        });
    }

    /**
     * 新聞載入 first 分類 news select 功能
     * @param asyncFun first 分類載入完成執行動作
    */
    private classFirstNews=(asyncFun:(ary:Array<any>)=>void)=>{
        Login((x)=>x.post("/ns/main/data/cflist"),(e2:any)=>{ //第一層 分類 list --set1
            /** 第一層 分類 first create使用row 及 第一層分類 container list  */
            let getNct:Array<pub.SERnctCtr>=[];
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                e2.data.forEach((val:pub.SERnctCtr,nu:number)=>{
                    val["cl"]=[];//建立欄位
                    for(let a=val.nameAry.length;a< main.pub.langAry.length;a++)
                    {
                        val.nameAry.push("");//補語系位置
                    }
                    getNct.push(val);
                });
            }
            else
            {
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
            asyncFun(getNct);
        });
    }

    /** 分類名第二層 新聞媒體news search
      * @param obj 第二層分類json:any
      * @param fun 取用完成後執行 function
      * @param catchData 是否取資料
      */
     private classSeListNews = (obj:pub.SERnctCtr,fun:Function)=>
     {
        Login((x)=>x.post("/ns/main/data/cslist").input({key:obj.key}),(e2:any)=>{
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                let createList:Array<jDB.NewsClassName> = [];
                e2.data.forEach((val2:jDB.NewsClassName,nu2:number)=>
                {
                    for(let a=val2.nameAry.length;a< main.pub.langAry.length;a++)
                    {
                        val2.nameAry.push("");//補語系位置
                    }
                    createList.push(val2);
                });
                obj.cl = createList;
            }
            else
            {
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
            fun();
        });
     };


      /**
     * 踩採載入 first 分類 news select 功能
     * @param asyncFun first 分類載入完成執行動作
    */
    private classFirstNewscc=(asyncFun:(ary:Array<any>)=>void)=>{
        Login((x)=>x.post("/nscc/main/data/cflist"),(e2:any)=>{ //第一層 分類 list --set1
            /** 第一層 分類 first create使用row 及 第一層分類 container list  */
            let getNct:Array<pub.SERnctCtr>=[];
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                e2.data.forEach((val:pub.SERnctCtr,nu:number)=>{
                    val["cl"]=[];//建立欄位
                    for(let a=val.nameAry.length;a< main.pub.langAry.length;a++)
                    {
                        val.nameAry.push("");//補語系位置
                    }
                    getNct.push(val);
                });
            }
            else
            {
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
            asyncFun(getNct);
        });
    }

      /** 分類名第二層 彩踩 news search
      * @param obj 第二層分類json:any
      * @param fun 取用完成後執行 function
      * @param catchData 是否取資料
      */
    private classSeListNewscc = (obj:pub.SERnctCtr,fun:Function)=>
    {
        Login((x)=>x.post("/nscc/main/data/cslist").input({key:obj.key}),(e2:any)=>
        {
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                let createList:Array<jDB.NewsLClassName> = [];
                e2.data.forEach((val2:jDB.NewsLClassName,nu2:number)=>
                {
                    for(let a=val2.nameAry.length;a< main.pub.langAry.length;a++)
                    {
                        val2.nameAry.push("");//補語系位置
                    }
                    createList.push(val2);
                });
                obj.cl = createList;
            }
            else
            {
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
            fun();
        });
    };

    /** create 初始化 文章格式 (基礎格式共用)
     * @param obj 注入文章物件
     * @param lang 語系名字串
     * @param downloadContent 載入 內容
     * @param animateName 動畫ID(more button)
     * @param colorTag 附屬於主要文章下邊線標示顏色
     * @param TraceTpBF 0=無上下追蹤 1=上一篇開起,2=下一篇開啟 (button)
     * @returns 回傳創建 文章 format
    */
    createFormatTemp =(obj:any,tp:jEnum.Enum_docType,downloadContent:boolean|false,animateName:string|null,colorTag:number,TraceTpBF:number):any=>
    {//注入編緝欄位
        switch(tp)
        {
            case jEnum.Enum_docType.News:
                let format:pub.NewsCtr = obj;
                format.show=true;
                format.langLoad=[main.pub.lang];//注入語系記錄
                format.edit = false;
                if(format.loadDoc==null || format.loadDoc ==undefined)
                {
                    format.loadDoc = {} as any;
                }
                format.loadDoc[main.pub.lang as any] = false;
                format.bshow = false;
                format.afshow = false;
                format.bContent = null;
                format.afContent = null;
                format.showApprove=false;
                format.TraceTpBF = TraceTpBF;
                (format.readPathAry as Array<pub.markPathCtr> ).forEach((val,nu)=>{//注入欄位
                    val.content = null;
                    val.update = false;
                    val.show = false;
                    val.lock = false;
                });
                (format.mdocAry as Array<pub.markPathCtr> ).forEach((val,nu)=>{//注入欄位
                    val.content = null;
                    val.update = false;
                    val.show = false;
                    val.lock = false;
                });
                if(downloadContent)
                {//標籤文章
                    format.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                    {
                        /** 注入file 段落 格式 */
                        let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                        if(getFileContent.content==null)
                        {//注入格式
                            getFileContent.content={};
                            getFileContent["update"] = false;
                            getFileContent["IMGupdate"] = false;
                            getFileContent["imgfileAry"] = [];
                            getFileContent["imgfile"] = null;
                            getFileContent["objImg"] = new (Jobj as any)();
                        }
                    });
                    format.TagColor = colorTag;
                    format.val=((animateName!=null)?animateName:'');
                    self.NEWSmoreData(format,'',((animateName!=null)?animateName:''));
                }
                return format;
            case jEnum.Enum_docType.Newscc:
                let format2:pub.NewsccCtr = obj;
                format2.show=true;
                format2.langLoad=[main.pub.lang];//注入語系記錄
                format2.edit = false;
                if(format2.loadDoc==null || format2.loadDoc ==undefined)
                {
                    format2.loadDoc = {} as any;
                }
                format2.loadDoc[main.pub.lang as any] = false;
                format2.bshow = false;
                format2.afshow = false;
                format2.bContent = null;
                format2.afContent = null;
                format2.showApprove=false;
                format2.TraceTpBF = TraceTpBF;
                (format2.readPathAry as Array<pub.markPathCtr> ).forEach((val,nu)=>{//注入欄位
                    val.content = null;
                    val.update = false;
                    val.show = false;
                    val.lock = false;
                });
                (format2.mdocAry as Array<pub.markPathCtr> ).forEach((val,nu)=>{//注入欄位
                    val.content = null;
                    val.update = false;
                    val.show = false;
                    val.lock = false;
                });
                if(downloadContent)
                {//標籤文章
                    format2.docAry.forEach((val2:jDB.DocPath,nu2:number)=>
                    {
                        /** 注入file 段落 格式 */
                        let getFileContent:pub.DocPathCtr =  val2 as pub.DocPathCtr
                        if(getFileContent.content==null)
                        {//注入格式
                            getFileContent.content={};
                            getFileContent["update"] = false;
                            getFileContent["IMGupdate"] = false;
                            getFileContent["imgfileAry"] = [];
                            getFileContent["imgfile"] = null;
                            getFileContent["objImg"] = new (Jobj as any)();
                        }
                    });
                    format2.TagColor = colorTag;
                    format2.val=((animateName!=null)?animateName:'');
                    self.NEWSccmoreData(format2,'',((animateName!=null)?animateName:''));
                }
                return format2;
        }
    }
}
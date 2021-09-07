import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import pb from "../../../models/pb";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** 文章儲存提示標籤 (progress degree) */
interface uploadView
{
    /** 判斷 id */
    id:number,
    /**  file name/api name */
    name:string,
    notPpoint:boolean,
    /** 確認完成 */
    ck:boolean,
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
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
/** 儲存排程 model */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
    }

     /** 主要框架完成list 清單 progress degree */
     private titleSaveNuAry:Array<uploadView>=[];
     /** 段落儲存 */
     private docSaveNuAry:Array<uploadView>=[];
 
     /** 緩儲儲存重新起動 */
     private initReSave:boolean=false;
 
     /** 圖片上傳最大count */
     private imgMaxUploadCount:number=0;
 
     /**
      * 儲存文章-生成進度儲存
      * @param obj 
      */
     save=(obj:pub.NewsccCtr)=>
     {
         if(self.titleSaveNuAry.length==0 && self.docSaveNuAry.length==0)
         {
             let nu:number = 0;
 
             if(obj.update)
             {//標題儲存
                 self.titleSaveNuAry.push({ id: nu,name:obj.titleAry[main.pub.langNu],ck:false,notPpoint:false});
                 nu++;
             }
 
             if(obj.LABELupdate)
             {/** 移除深入閱讀標籤 */
                 self.titleSaveNuAry.push({ id: nu,name:"remove Label:",ck:false,notPpoint:false});
             }
 
             (obj.readPathAry as Array<pub.markPathCtr>).forEach((val1,nu1)=>
             {/** 深入閱讀標籤 */
                 if(val1.update)
                 {
                     self.titleSaveNuAry.push({ id: nu,name:"read Label:"+val1.path.substring(0,9)+".../"+val1.nameAry[main.pub.langNu].substring(0,9)+"...",ck:false,notPpoint:false});
                 }
                 nu++;
             });
 
 
             if(obj.EVENTLABELupdate)
             {/** 移除其它標籤 */
                 self.titleSaveNuAry.push({ id: nu,name:"remove event Label:",ck:false,notPpoint:false});
             }
 
             (obj.mdocAry as Array<pub.markPathCtr>).forEach((val1,nu1)=>
             {/** 其它標籤 */
                 if(val1.update)
                 {
                     self.titleSaveNuAry.push({ id: nu,name:"event Label:"+val1.path.substring(0,9)+".../"+val1.nameAry[main.pub.langNu].substring(0,9)+"...",ck:false,notPpoint:false});
                 }
                 nu++;
             });
 
             /** 開始段落儲存 */
             let docAryObj:Function = ()=>{
                 /** 圖片緩上傳 計數 */
                 let waitImg:number=0;
                 (obj.docAry as Array<pub.DocPathCtr>).forEach((val1,nu1)=>
                 {/** 段落標籤 */
                     /** 執行圖片上傳動作 */
                     let imgSaveobj:Function=()=>
                     {
                            if(val1.IMGupdate)
                            {/** 文章圖片上傳 */
                                let getImgKey:number= pb.unixReNow();
                                val1.imgfileAry.forEach((val2,nu2)=>
                                {
                                    if(!val2.over)
                                    {
                                        waitImg++;
                                        let imgUpload:uploadView = { id: nu,name:"img/photo upload:"+val2.filename,ck:false,notPpoint:false};
                                        self.docSaveNuAry.push(imgUpload);
                                        setTimeout(()=>{
                                            /** 圖片開始載入 function */
                                            let uploadStartFun:Function =()=>
                                            {
                                                self.imgMaxUploadCount++;
                                                self.imgDocUpload(obj,val1,val2,imgUpload,getImgKey+"_"+nu2);
                                            }

                                            if(self.imgMaxUploadCount<2)
                                            {
                                                uploadStartFun();
                                            }
                                            else
                                            {
                                                /** 等候載入圖片 */
                                                let reImgFile:Function = (fun:Function)=>
                                                {
                                                    if(self.imgMaxUploadCount<2)
                                                    {
                                                        fun();
                                                    }
                                                    else
                                                    {
                                                        setTimeout(()=>
                                                        {
                                                            reImgFile(fun);
                                                        },500);
                                                    }
                                                }
                                                reImgFile(uploadStartFun);
                                            }
                                        },waitImg*50);
    
                                    }
                                });
                                val1.IMGupdate = false;
                                nu++;
                            }
                     };

                     /** 儲存段落文章 */
                     let saveContentDoc:Function=()=>
                     {
                         if(val1.update)
                         {
                            let doc:uploadView={ id: nu,name:"document:"+val1.content[main.pub.lang].title.substring(0,9)+".../"+val1.content[main.pub.lang].content.substring(0,9)+"...",ck:false,notPpoint:false};
                            self.docSaveNuAry.push(doc);
                            self.editContentDoc(obj,val1,doc,imgSaveobj);               
                            //文章
                            nu++;
                        }
                        else
                        {
                            imgSaveobj();
                        }
                     }

                     /** 直接儲存段落再存 圖檔 */
                     let gotoUploadImage = true;
                     /**
                     * img title save oder Number count split
                     */
                    let updateImgNu:number=0;
                    /**
                     * 已完成儲存img title count
                     */
                    let ImgCompleteTotal:number=0;
                    (val1.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val2,nu2)=>
                    {//儲存 img description
                        if(val2.update)
                        {
                            gotoUploadImage==false;
                            let imgTitle:uploadView={ id: nu,name:"img/photo title:"+val2.titleAry[main.pub.langNu].substring(0,9)+"...",ck:false,notPpoint:false};
                            self.docSaveNuAry.push(imgTitle);
                            /** 圖片 title資訊緩存 */
                            let waitImg:Function = (getnu:number)=>
                            {
                                if(updateImgNu==0)
                                {
                                    updateImgNu++;
                                    self.editContentImgDoc(obj,val1,val2,imgTitle,()=>{
                                        updateImgNu--;
                                        ImgCompleteTotal++;
                                        if(ImgCompleteTotal==val1.imgAry.length)
                                        {//img title save complete
                                            if(val1.update)
                                            {
                                                saveContentDoc();
                                            }
                                            else
                                            {
                                                imgSaveobj();
                                            }
                                        }
                                        nu++;
                                    });
                                }
                                else
                                {
                                    setTimeout(()=>{
                                        waitImg(getnu);
                                    },100+10*nu2);
                                }
                            }
                            waitImg(nu2);
                        }
                    });

                    if(gotoUploadImage)
                    {
                        saveContentDoc();
                    }
                 });
             };
 
             if(self.titleSaveNuAry.length>0)
             {//儲存主要框架
                 self.editDoc(obj,self.titleSaveNuAry,docAryObj);
             }
             else
             {
                 docAryObj();
             }
 
 
             $t.openUploadView = true;
             pb.v($t,"uploadvue").async((e)=>
             {//顯示儲存進度表
                 e.NewsCtr = obj;
                 e.titleSaveNuAry = self.titleSaveNuAry;
                 e.docSaveNuAry = self.docSaveNuAry;
             });

             setTimeout(()=>
             {
                if(self.titleSaveNuAry.length==0 && self.docSaveNuAry.length==0)
                {//完全無資料存儲狀態
                    self.reSave(obj)
                }
             },1000);
         }
         else
         {
            self.reSave(obj);
         }
     }

     /** video youtube Save */
     editDocVideoYoutube = (obj:pub.NewsccCtr,docObj:pub.DocPathCtr)=>
     {
        Login((x)=>x.post("/nscc/mg/mb/newsvideo").input({key:obj.key,path:docObj.path,
            ybe: docObj.ybe
        }),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                docObj.ybe=e.ybe;
            }
            else
            {
                docObj.ybe="";
                mt.viewAlert( main.pub.config.get("error").svbusy);
            }
        });
     }
 
     /**
      * 編緝 文章段落
      * @param obj 文章
      * @param imgSaveobj 執行圖片儲存動作
     */
     private editContentDoc = (obj:pub.NewsccCtr,docObj:pub.DocPathCtr,saveObj:uploadView,imgSaveobj:Function)=>
     {   
         /** 儲存段落計數(語系統計) */
        let saveContent:number=0;
        /** 總處理儲存段落 */
        let contentTotalCount:number = Object.keys(docObj.content).length;

        Object.keys(docObj.content).map(key=>
        {//取得目前已load 語系(被修改一次性儲存)

            /** 等候存儲排程 */
            let runSaveLang:Function = ()=>
            {
                if(saveContent==0)
                {
                    contentTotalCount--;
                    saveContent++;
                    /** 段落內容物件 */
                    let contentObj:jDB.DocFileFormat = docObj.content[key];
                    /** 取得這系 number */
                    let getLangNu = 0;
                    main.pub.langAry.forEach((val,nu)=>
                    {//取語係儲存號
                        if(val.val==key)
                        {
                            getLangNu=nu;
                        }
                    });
                    Login((x)=>x.post("/nscc/mg/mb/newsdocedit").input({key:obj.key,path:docObj.path,
                        nu:getLangNu,
                        title: contentObj.title,
                        content: contentObj.content
                    }),(e:any)=>
                    {
                        saveContent--;
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                           
                            let getContent:jDB.DocFileFormat = e.data;
                            docObj.update  = false;
                            docObj.content[key] = getContent;
                            if(contentTotalCount==0)
                            {//語系段落處理完成 往下處理 image photo
                                imgSaveobj();
                                saveObj.ck= true;
                            }
                        }
                        else
                        {
                            if(contentTotalCount==0)
                            {//語系段落處理完成 往下處理 image photo
                                imgSaveobj();
                                saveObj.ck= true;
                            }
                            mt.viewAlert( main.pub.config.get("error").svbusy+"("+key+")");
                        }
                        if(contentTotalCount==0)
                        {
                            setTimeout(()=>{
                                self.reSave(obj);
                            },1000);
                        }

                    });
                }
                else
                {//等候排程
                    setTimeout(()=>{
                        runSaveLang();
                    },100);
                }
            };
            runSaveLang();
        });
     }
 
     /**
      * 上傳文章段段落圖片
      * @param obj 文章
      * @param imgObj 上傳檔案資訊
      * @param saveObj 儲存進度
      * @param keyid 圖片上傳id
     */
     private imgDocUpload = (obj:pub.NewsccCtr,docObj:pub.DocPathCtr,imgObj:pub.imgFileObj,saveObj:uploadView,keyid:string)=>
     {
         /** 分割上傳大小 */
         let splitUploadSize:number=196396;
         /** 匹次上傳分割 */
         let uploadDataSize:number = imgObj.uptotalsize;//斷接
         let nu:number= 0;//定位置切割點
 
         /** 被分割 img */
         let catchImg:Array<string> = [];
         while(uploadDataSize>0)
         {
             uploadDataSize-=splitUploadSize;
             if(imgObj.upsize<=imgObj.uptotalsize-uploadDataSize)
             {
                 catchImg.push(imgObj.base64.substring(nu*splitUploadSize,splitUploadSize*(nu+1)));
             }
             nu++;
         }

         if(Number(mt.head.mbdata.status.split("#")[0])>=3000 || [jEnum.Enum_MBLevel.pay,jEnum.Enum_MBLevel.systemMG].indexOf(mt.head.mbdata.level)>-1)
         {
            /** 目前正在載入完成 碎片 計數 */
            let nowSplit:number = 0;
            catchImg.forEach((val1,nu1)=>
            {//排隊佈屬
                /** 排序上傳檔案 */
                let waitUpload:Function = ()=>
                {
                    if(nowSplit==nu1)
                    {
                        Login((x)=>x.post("/nscc/mg/mb/newsimgupload").input({key:obj.key,path:docObj.path,imgdata:val1,tp:((catchImg.length-1!=nu1)?'':"complete")+nu1,keyid:keyid}),(e:any)=>
                        {
                            nowSplit++;
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                imgObj.upsize += imgObj.base64.substring(nu1*splitUploadSize,splitUploadSize*(nu1+1)).length;//加總上傳size
                                imgObj.uploadmes = "upload runing...";
                                if(imgObj.upsize==imgObj.uptotalsize)
                                {
                                    saveObj.name = "img/photo upload:"+imgObj.filename+"("+((imgObj.upsize/imgObj.uptotalsize*100)).toFixed(2)+"%)";
                                    saveObj.ck = true;
    
                                    /** 新圖片 格式建置 */
                                    let newImg:pub.DocImgFileFormatCtr = {path:e.newImg,titleAry:[],update:false};
                                    for(let a=newImg.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                    {//填空語系 位置
                                        newImg.titleAry.push("");
                                    }
                                    pb.v(mt,"head_temp").async((headObj:pub.mainHeadTemp)=>
                                    {
                                        pb.v($t,"uploadvue").async((e)=>
                                        {//顯示儲存進度表 app點數
                                            e.usPoint -= 3000;//圖片公定扣點數
                                            e.NewsCtr = obj;
                                            e.titleSaveNuAry = self.titleSaveNuAry;
                                            e.docSaveNuAry = self.docSaveNuAry;
                                        });
                                    });

                                    if(docObj.objImg == null)
                                    {//建立圖片容器
                                        docObj.objImg = new (Jobj as any)();
                                    }
    
                                    if(docObj.objImg.Jobj[("/nscc/newsmgimg/"+obj.uid+"/"+obj.key) as any]==null || docObj.objImg.Jobj[("/nscc/newsmgimg/"+obj.uid+"/"+obj.key) as any]==undefined)
                                    {
                                        docObj.objImg.Jobj[("/nscc/newsmgimg/"+obj.uid+"/"+obj.key) as any] = {} as any;
                                    }
                                    let getImgData:any = docObj.objImg.Jobj[("/nscc/newsmgimg/"+obj.uid+"/"+obj.key) as any];
                                    getImgData[("/nscc/newsmgimg/"+obj.uid+"/"+obj.key+"/"+newImg.path) as any]=imgObj.base64;//注入圖片
                                    docObj.objImg.key = "/nscc/newsmgimg/"+obj.uid+"/"+obj.key;//注入儲存容器key
                                    //--------------------完成上傳清除
                                    imgObj.uploadmes = "upload complete!";

                                    /** 重建 切段 get set 更新 */
                                    let newObj:Array<pub.DocImgFileFormatCtr> = [newImg];
                                    (docObj.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val,nu)=>
                                    {//新圖+舊圖
                                        newObj.push(val);
                                    });

                                    /** 重新排序圖片位置 */
                                    let reOderImg:Array<pub.DocImgFileFormatCtr> = [];
                                    (e.data as Array<string>).forEach((val,nu)=>{
                                        newObj.forEach((val1,nu1)=>
                                        {//新圖+舊圖
                                            if(val1.path==val)
                                            {
                                                reOderImg.push(val1);
                                            }
                                        });

                                    });
                                    docObj.imgAry = reOderImg;
                                    self.reSave(obj);

                                    setTimeout(()=>
                                    {
                                        self.imgMaxUploadCount--;//釋出空位上傳
                                        let removeImgFile:Array<pub.imgFileObj> = [];
                                        docObj.imgfileAry.forEach((val,nu)=>
                                        {//排除已上傳完成
                                            if(val.uptotalsize!=val.upsize)
                                            {
                                                removeImgFile.push(val)
                                            }
    
                                        });
    
                                        docObj.imgfileAry = removeImgFile;
                                        if(docObj.imgfileAry.length==0)
                                        {//圖片已上傳完畢
                                            docObj.imgfile = null;
                                            obj.docAry.forEach((val,nu)=>{
                                                if(docObj.path==val.path)
                                                {//清空上傳資料input
                                                    pb.el.id('newccofile_'+obj.key+'_'+nu).get.value ="";
                                                }
                                            });
                                        }
                                    },100);
                                }
                            }
                            else if(Number(e.error) == jEnum.Enum_SystemErrorCode.notpointError)
                            {//無額度error
                                mt.ViewAlertAtClose(main.pub.config.get("error").notpoint,null,2,main.pub.lib.src('coin.png'));
                                //無額度error
                                saveObj.notPpoint = true;
                                saveObj.ck = true;
                                imgObj.upsize =0;
                                self.imgMaxUploadCount--;
                                self.reSave(obj);

                            }
                            else if(Number(e.error) == jEnum.Enum_SystemErrorCode.fileForamtError)
                            {//檔案上傳損毀
                                if(imgObj.restart>0)
                                {
                                    imgObj.uploadmes = "error!wait upload for reset";
                                    setTimeout(()=>
                                    {
                                        imgObj.restart--;
                                        imgObj.upsize -= splitUploadSize*3;//斷開節點重新上傳
                                        if(imgObj.upsize<0)
                                        {
                                            imgObj.upsize = 0;
                                        }
    
                                        self.imgDocUpload(obj,docObj,imgObj,saveObj,keyid);
                                    },1000);
                                }
                                else
                                {
                                    saveObj.ck = true;
                                    imgObj.upsize =0;
                                    self.imgMaxUploadCount--;
                                    self.reSave(obj);
                                    imgObj.uploadmes = "error for format file(upload fail)";
                                }
                            }
                            else
                            {
                                saveObj.ck = true;
                                imgObj.upsize =0;
                                self.imgMaxUploadCount--;
                                self.reSave(obj);
                                imgObj.uploadmes = "error unknow!";
                            }
                        });
                    }
                    else
                    {
                        setTimeout(()=>
                        {
                            waitUpload();
                        },20);
                    }
                }
                waitUpload();
            });
        }
        else
        {
            mt.ViewAlertAtClose(main.pub.config.get("error").notpoint,null,2,main.pub.lib.src('coin.png'));
            //無額度error
            saveObj.notPpoint = true;
            self.imgMaxUploadCount--;
            saveObj.ck = true;
            imgObj.upsize =0;
            self.reSave(obj);
        }
     }
 
     /**
      * 編緝 文章段落圖片 title
      * @param obj 文章
      * @param imgObj 文章段落圖片
      * @param saveObj 處理進度
      * @param oderSave 排序儲存時間點
     */
     private editContentImgDoc = (obj:pub.NewsccCtr,docObj:pub.DocPathCtr,imgObj:pub.DocImgFileFormatCtr,saveObj:uploadView,oderSave:Function)=>
     {
         imgObj.update = false;
         Login((x)=>x.post("/nscc/mg/mb/newsimgedit").input({key:obj.key,path:docObj.path,imgpath:imgObj.path,titleAry:JSON.stringify(imgObj.titleAry)}),(e:any)=>{
             if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
             {
                 saveObj.ck = true;
             }
             else
             {
                 mt.viewAlert(main.pub.config.get("error").svbusy);
             }
             oderSave();
             self.reSave(obj);
         });
     }
 
     /**
      * publish save setting 文章框架
      * @param docStepSave 執行儲存 段落 function 陣列
     */
     private editDoc = (val:pub.NewsccCtr,saveLine:Array<uploadView>,docStepSave:Function)=>
     {
         Login((x)=>x.post("/nscc/mg/mb/newsedit").input({key:val.key,title:JSON.stringify(val.titleAry), mdoc:JSON.stringify(val.mdocAry), readPath:JSON.stringify(val.readPathAry)
         ,nckey:val.nckey
         } as jDB.NewsL ),(e:any)=>{
             if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
             {
                 saveLine.forEach((val1,nu1)=>{
                     val1.ck = true;
                 });
 
                 /** 重新注冊深入閱讀 */
                 let getreadPathAry:Array<pub.markPathCtr>=[];
                 (val.readPathAry as Array<pub.markPathCtr>).forEach((val1,nu1)=>
                 {/** 深入閱讀標籤 */
                     val1.update = false;//解除更新 mark
                     getreadPathAry.push(val1);
                 });
                 val.readPathAry = getreadPathAry;
         
                 /** 重新注冊其它標籤 */
                 let getmdocAry:Array<pub.markPathCtr>=[];
                 (val.mdocAry as Array<pub.markPathCtr>).forEach((val1,nu1)=>
                 {/** 其它標籤 */
                     val1.update = false;//解除更新 mark
                     getmdocAry.push(val1);
                 });
                 val.mdocAry = getmdocAry;
                 docStepSave();
                 val.update = false;//解除更新 mark
                 val.EVENTLABELupdate = false;
                 val.LABELupdate = false;
 
             }
             else
             {
                 mt.viewAlert( main.pub.config.get("error").svbusy);
             }
             self.reSave(val);
         });
     }
 
     /**
      * 重新續存 (防止頁面重整而造成)(未初始化前)
     */
     startReSave = ()=>
     {
         try
         {
             if(localStorage.getItem("psylnewsccsaveexist")!=null && localStorage.getItem("psylnewsccsave") !=null)
             {
                 pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
                 {
                     if(pb.unixReNow()-Number(localStorage.getItem("psylnewsccsaveexist"))>540)
                     {//存活 9分鐘內資訊
                         mt.viewConfirm($t.getLangcc('mes').resavestart,()=>
                         {
                             let obj:pub.NewsccCtr = JSON.parse(pb.Base64ToUTF8(localStorage.getItem("psylnewsccsave") as string));
                             if(eh.mbdata.uid == obj.uid)
                             {// 是否為目前登入帳戶所持有
                                 self.initReSave = true;
                                 self.save(obj);
                             }
                             else
                             {//異常帳戶 清除資訊
                                 localStorage.removeItem("psylnewsccsaveexist");
                                 localStorage.removeItem("psylnewsccsave");
                                 $t.$m.main.initLoad();//載入 class first/init
                             }
                         },()=>{
                             $t.$m.main.initLoad();//載入 class first/init
                         },main.pub.lib.src('savenoteleft.png'));
                     }
                     else
                     {//超過緩存時間清除
                         localStorage.removeItem("psylnewsccsaveexist");
                         localStorage.removeItem("psylnewsccsave");
                         $t.$m.main.initLoad();//載入 class first/init
                     }
                 });
             }
             else
             {
                 $t.$m.main.initLoad();//載入 class first/init
             }
         }
         catch(e)
         {
             $t.$m.main.initLoad();//載入 class first/init
         }
     }

     /** unixtime 緩存儲存記錄 */
     private recodeLater = 0;
     /**
      * 持續-儲存-記錄
      * @param obj 
      * @param point error
      */
     private reSave(obj:pub.NewsccCtr)
     {
        /** 確認是否已處理完成 */
        let ckComplete:boolean = true;
        self.titleSaveNuAry.forEach((val,nu)=>{
            if(ckComplete && !val.ck)
            {
                ckComplete = val.ck;
            }
        });

        self.docSaveNuAry.forEach((val,nu)=>{
            if(ckComplete && !val.ck)
            {
                ckComplete = val.ck;
            }
        });

        if(ckComplete)
        {
            $t.$an.u.save(()=>
            {
                //關閉運行-儲存進度表
                $t.openUploadView=false;//直接釋放 upload temp memory
                self.titleSaveNuAry = [];//清除 完成儲存動作
                self.docSaveNuAry = []; //清除 完成儲存動作

                (obj.docAry as Array<pub.DocPathCtr>).forEach((val:pub.DocPathCtr,nu:number)=>
                {
                    if(val.imgfileAry.length>0)
                    {//檢查是否有存在遺留未upload image
                        val.IMGupdate = true;
                    }
                });
                
            });//儲存OK動畫-upload
        }

        if(this.recodeLater + 6<pb.unixReNow())
        {//緩進3 秒
            this.recodeLater = pb.unixReNow();
            try
            {
                localStorage.setItem("psylnewsccsaveexist",String(pb.unixReNow()));//已存在時間
                if(!ckComplete)
                {
                    let objGet:pub.NewsccCtr = JSON.parse(JSON.stringify(obj));
                    (objGet.docAry as Array<pub.DocPathCtr>).forEach((val,nu)=>
                    {//清除 圖片暫存(localStorage max size 5MB)
                        val.imgfile = null;
                        val.imgfileAry = [];
                    });
                    localStorage.setItem("psylnewsccsave", pb.UTF8ToBase64(JSON.stringify(objGet)));
                }
                else
                {//完成清除 續存
                    localStorage.removeItem("psylnewsccsaveexist");
                    localStorage.removeItem("psylnewsccsave");
                    if(self.initReSave)
                    {//重新儲存作動(未載入 first)
                        self.initReSave = false;
                        $t.$m.main.initLoad();//載入 class first/init
                    }
                }
            }
            catch(e)
            {
                if(self.initReSave)
                {//重新儲存作動(未載入 first)
                    self.initReSave = false;
                    $t.$m.main.initLoad();//載入 class first/init
                }
            }
        }
        else if(ckComplete)
        {//清除
            try{
                localStorage.removeItem("psylnewsccsaveexist");
                localStorage.removeItem("psylnewsccsave");
                if(self.initReSave)
                {//重新儲存作動(未載入 first)
                    self.initReSave = false;
                    $t.$m.main.initLoad();//載入 class first/init
                }
            }
            catch(e)
            {
                if(self.initReSave)
                {//重新儲存作動(未載入 first)
                    self.initReSave = false;
                    $t.$m.main.initLoad();//載入 class first/init
                }
            }
        }
     }
 
     /**
      *  是否已更動末儲存
      * @param obj 
      */
     usUpdate=(obj:pub.NewsccCtr):boolean=>
     {
         /** update已更動 */
         let update:boolean=false;
         (obj.docAry as Array<pub.DocPathCtr>).forEach((val:pub.DocPathCtr,nu:number)=>
         {
             if(!update)
             {
                 update = val.update || val.IMGupdate;
             }

             (val.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val1,nu1)=>
             {//圖片title
                if(!update)
                {
                    update = val1.update;
                }
             });
 
         });
 
         (obj.readPathAry as Array<pub.markPathCtr>).forEach((val,nu)=>
         {//深入追蹤標籤
             if(!update)
             {
                 update = val.update;
             }
         });
 
 
         (obj.mdocAry as Array<pub.markPathCtr>).forEach((val,nu)=>
         {//其它標籤
             if(!update)
             {
                 update = val.update;
             }
         });
 
         return obj.update || update || obj.LABELupdate || obj.EVENTLABELupdate;
     }
      
}
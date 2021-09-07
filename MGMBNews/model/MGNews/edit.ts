import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";


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
/** 編緝 model */
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

    /** 選擇起用語系 */
    chooseLang=(val:pub.NewsCtr,lang:number)=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點

                let ary:Array<number>=[];
                val.langAry.forEach((val1,nu)=>{
                    ary.push(val1);
                });

                if(ary.indexOf(lang)==-1)
                {//add
                    ary.push(lang);
                }
                else
                {//remove
                    /** 重建 */
                    let ary2:Array<number>=[];
                    ary.forEach((val1,nu)=>{
                        if(val1 != lang)
                        {
                            ary2.push(val1);
                        }
                    });
                    ary = ary2;
                }

                Login((x)=>x.post("/ns/mg/mb/newslang").input({key:val.key,lang:JSON.stringify(ary)} as jDB.News),(e:any)=>
                {//語系注入
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.langAry = e.data as Array<number>;
                        
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 創建追蹤後續文章
    */
     insertTraceDoc = (val:pub.NewsCtr)=>
     {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                mt.viewConfirm($t.getLang('mes').createTrace,()=>
                {
                    Login((x)=>x.post("/ns/mg/mb/newsinsert").input({nckey:val.nckey,bkey:val.key}),(e:any)=>{
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 取得文章格式 */
                            let data:jDB.News = e.data;
                            $t.$m.main.getFileFirst(data,(obj:pub.NewsCtr)=>
                            {
                                /** 重建文章 */
                                let newObj:Array<pub.NewsCtr>=[obj];
                                $t.datalist.forEach((val:pub.NewsCtr,nu:number)=>
                                {
                                    newObj.push(val);
                                });

                                $t.datalist = newObj;
                                val.fkey = "c_"+data.key;//注冊為此文章追蹤
                            });

                            window.scrollTo(0, 0);
                        }
                        else
                        {
                            mt.viewAlert(main.pub.config.get("error").svbusy);
                        }
                    });
                },null,main.pub.lib.src('trace.png'));
            }
        });
    }

    /**
     * create 文章框架
    */
    insertDoc = ()=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                pb.v($t,"Newsvue").async(en=>
                {
                    if(en.selfclass!="999" && en.selfclassmain !="333")
                    {
                        Login((x)=>x.post("/ns/mg/mb/newsinsert").input({nckey:en.selfclass}),(e:any)=>{
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 取得文章格式 */
                                let data:jDB.News = e.data;
                                $t.$m.main.getFileFirst(data,(obj:pub.NewsCtr)=>
                                {
                                    /** 重建文章 */
                                    let newObj:Array<pub.NewsCtr>=[obj];
                                    $t.datalist.forEach((val:pub.NewsCtr,nu:number)=>
                                    {
                                        newObj.push(val);
                                    });

                                    $t.datalist = newObj;
                                });
                            }
                            else
                            {
                                mt.viewAlert(main.pub.config.get("error").svbusy);
                            }
                        });
                    }
                    else
                    {//未選類別
                        $t.$an.edit.insertDocError();
                    }
                });
            }
        });
    }
   
    /**
     * 刪除 文章框架
     * @param nu 刪除文章列號
    */
    delDoc = (val:pub.NewsCtr,nu:number)=>{
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm($t.getLang('mes').delns,()=>{
                    Login((x)=>x.post("/ns/mg/mb/newsdel").input({key:val.key}),(e:any)=>{
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            $t.$an.edit.delDoc(nu,()=>{//刪除動畫
                                /** 重建文章 */
                                let newObj:Array<pub.NewsCtr>=[];
                                $t.datalist.forEach((val1:pub.NewsCtr,nu1:number)=>
                                {
                                    if(val1.key !=val.key)
                                    {
                                        if(val1.fkey=="c_"+val.key)
                                        {
                                            val1.fkey = "";//取消解除此文章追蹤
                                        }
                                        newObj.push(val1);
                                    }
                                });
                                $t.datalist = newObj;
                            });

                        }
                        else
                        {
                            mt.viewAlert(main.pub.config.get("error").svbusy);
                        }
                    });
                },null);
            }
        });
    }

    /**
     * publish setting 文章框架
     * @param day 
    */
    PublishDoc = (val:pub.NewsCtr,day:string)=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                let fun:Function=()=>
                {
                    Login((x)=>x.post("/ns/mg/mb/newspublish").input({key:val.key,publish:Number(day)} as jDB.News),(e:any)=>
                    {
                        val.publish = Number(day);
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            val.publish = e.publish as number;
                            val.codekey = e.codekey;//無參數擇為未審核
                        }
                        else
                        {
                            mt.viewAlert( main.pub.config.get("error").svbusy);
                        }
                    });
                };
                if(Number(day)==-1)
                {//取消發佈
                    mt.viewConfirm($t.getLang('mes').publish,()=>
                    {
                        fun();
                    },null);
                }
                else
                {
                    fun();
                }
            }
        });
    }

    /**
     * 建立 文章段落
     * @param obj 文章
    */
     insertContentDoc = (obj:pub.NewsCtr)=>
     {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ns/mg/mb/newsdocinsert").input({key:obj.key}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {

                        let getContent:pub.DocPathCtr = e.data;
                        getContent.content = {};
                        getContent["ybeInput"] = "";
                        getContent["imgfile"]=null;
                        getContent["update"]=false;
                        getContent["imgfileAry"]=[];
                        getContent["IMGupdate"]=false;
                        getContent["objImg"] = new (Jobj as any)();
                        getContent.content[ main.pub.lang] = {title:"",content:""} as jDB.DocFileFormat;//create 虛擬資料框架(對應語系)

                        obj.docAry.push(getContent);
                        
                        pb.v($t,"Newsvue").async((e)=>
                        {
                            let redata:Array<pub.NewsCtr> = [];
                            (e.main$m.datalist as Array<pub.NewsCtr>).forEach((valRe,nuRe)=>
                            {//重新注入
                                if(valRe.key== obj.key)
                                {
                                    if(obj.docAry.length==1)
                                    {
                                        obj.loadDoc[$t.main.pub.lang] = true;
                                    }
                                    redata.push(obj);
                                }
                                else
                                {
                                    redata.push(valRe);
                                }
                            });
                            e.main$m.datalist = redata;
                            $t.$an.main.imgConnectionRun(obj.key,obj.docAry.length-1);//文章段上下連接提示動畫
                        });
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 刪除 文章段落
     * @param obj 文章
    */
    delContentDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr)=>{
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm($t.getLang('mes').delnscontent,()=>{
                    Login((x)=>x.post("/ns/mg/mb/newsdocdel").input({key:obj.key,path:docObj.path}),(e:any)=>{
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建 */
                            let newObj:Array<pub.DocPathCtr> = [];
                            /**
                             * 刪除流水號
                            */
                            let delnu:number=-1;
                            (obj.docAry as Array<pub.DocPathCtr>).forEach((val:pub.DocPathCtr,nu:number)=>
                            {
                                if(docObj.path!=val.path)
                                {
                                    newObj.push(val);
                                }
                                else
                                {
                                    delnu = nu;
                                }
                            });
                            if(delnu!=-1)
                            {//移除動畫
                                $t.$an.edit.delDocAry(obj.key,delnu,()=>{
                                    obj.docAry = newObj;
                                });
                            }
                        }
                        else
                        {
                            mt.viewAlert( main.pub.config.get("error").svbusy);
                        }
                    });
                },null);
            }
        });
    }

    /**
     * 編緝 文章段落 圖片為照片牆
     * @param obj 文章
    */
    WallPaperImgDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr)=>
    {   
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                Login((x)=>x.post("/ns/mg/mb/newsimgwp").input({key:obj.key,path:docObj.path,
                }),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        docObj.WallPaper = e.wp;
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 上移 文章段落
     * @param obj 文章
     * @param docObj 文章段落
    */
    preContentDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ns/mg/mb/newsdocpre").input({key:obj.key,path:docObj.path}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重建順序 */
                        let newObj:Array<pub.DocPathCtr> = [];
                        (e.data as Array<jDB.DocPath>).forEach((val,nu)=>{
                            (obj.docAry as Array<pub.DocPathCtr>).forEach((val1,nu1)=>
                            {
                                if(val.path == val1.path)
                                {
                                    newObj.push(val1);
                                }
                            });
                        });
                        obj.docAry = newObj;
                        
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 下移 文章段落
     * @param obj 文章
     * @param docObj 文章段落
    */
    nextContentDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ns/mg/mb/newsdocnext").input({key:obj.key,path:docObj.path}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重建順序 */
                        let newObj:Array<pub.DocPathCtr> = [];
                        (e.data as Array<jDB.DocPath>).forEach((val,nu)=>{
                            (obj.docAry as Array<pub.DocPathCtr>).forEach((val1,nu1)=>
                            {
                                if(val.path == val1.path)
                                {
                                    newObj.push(val1);
                                }  
                            });
                        });
                        obj.docAry = newObj;
                    }
                    else
                    {
                        mt.viewAlert( main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /** 取消上傳/全部
     * @param del 刪除row -1=直接執行
     * @param docKey 文章key
     * @param del 段落number
     */
     imguploadCancel = (val:pub.DocPathCtr,del:number,docKey:string)=>
     {
         let run:Function=()=>
         {//移除動畫
             val.imgfile = null;
             val.imgfileAry = [];
             val.IMGupdate = false;
             val.update = false;
             pb.el.id('newofile_'+docKey+'_'+del).get.value ="";
         }
 
         if(del!=-1)
         {
             $t.$an.edit.removeAllUpload(del+docKey,run);
         }
         else
         {
             run();
         }
     }
 
     /** 刪除預覽上傳單檔
      * @param del img number
      * @param docnu 段落 number
      * @param docKey 文章key
      */
     imguploadDel= (val:pub.DocPathCtr,del:number,docKey:string,docnu:number)=>
     {
         $t.$an.edit.removeUpload(docnu+docKey+del,()=>
         {//移除動畫
             val.IMGupdate = true;
 
             let imgfileAry:Array<pub.imgFileObj>=[];
             val.imgfileAry.forEach((val2,nu2)=>{
                 if(nu2!=del)
                 {
                     imgfileAry.push(val2);
                 }
             });
             val.imgfileAry = imgfileAry;
             if(val.imgfileAry.length==0)
             {
                 val.IMGupdate = false;
                 val.imgfile=null;
                 pb.el.id('newofile_'+docKey+'_'+del).get.value ="";
             }
         });
     }

     /** base64 縮小尺寸 */
     impguploadReSize = (val:pub.imgFileObj)=>
     {
         let img:HTMLImageElement = document.createElement("img");
         img.src =val.base64;
         let canvas:HTMLCanvasElement = document.createElement("canvas");
         let ctx:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
         let resize:number=1/(val.base64.length/(1024*1024*2));
         canvas.width = img.width*resize;
         canvas.height = img.height*resize;
         ctx.scale(resize,resize);
         ctx.drawImage( img ,0,0);
         val.base64 = canvas.toDataURL("image/jpeg");
         val.size = (val.base64.length/1024/1024).toFixed(2);
         val.uptotalsize = val.base64.length,
         val.sizeName ="MB";
         setTimeout(()=>
         {
            val.over =false;
         },300);
     }
 
     /** 圖檔上傳 設置-同步語系上傳暫存檔 */
     imgupload = (news:pub.NewsCtr,row:number,obj:pub.DocPathCtr,files:any)=>
     {//同步
         obj.imgfile = files.target.files;
         // 清除暫存 base64圖檔
         obj.imgfileAry =[];
         /**  catch file input */
         Array.prototype.forEach.call(obj.imgfile,(file:any,nu:number)=>{
             /**relase to base64 */
             let reader:FileReader = new FileReader();
             reader.onloadend = function () {
                 /**base64  */
                 let b64:any = reader.result;//.replace(/^data:.+;base64,/, '');
                 /** 取得單位量數 */
                 let catchSize:number = 0;
                 /** 取得單位量詞 */
                 let catchSizeName:string = "";
                 let sizeGB:number = (file.size/1024/1024/1024);
                 let sizeMB:number = (file.size/1024/1024);
                 let sizeKB:number = (file.size/1024);
                 if(sizeGB>1)
                 {
                     catchSize = sizeGB;
                     catchSizeName = "GB";
                 }
                 else if(sizeMB>1)
                 {
                     catchSize = sizeMB;
                     catchSizeName = "MB";
                 }
                 else if(sizeKB>1)
                 {
                     catchSize = sizeKB;
                     catchSizeName = "KB";
                 }
                 else
                 {
                     catchSize = file.size;
                     catchSizeName = "B";
                 }
 
                 obj.imgfileAry.push({base64:b64,
                     size:catchSize.toFixed(2),
                     sizeName:catchSizeName,
                     filename:file.name,
                     uploadmes:"",
                     upsize:0,
                     restart:3,
                     uptotalsize:b64.length,
                     over:(1024*1024*2<file.size)});//容量限制2MB
             };
             reader.readAsDataURL(file);
         });

         /** 等候載入圖像完成 */
         let waitLoadComplete:Function=()=>{
             if(obj.imgfile.length==obj.imgfileAry.length)
             {
                obj.IMGupdate = true;
             }else
             {
                setTimeout(()=>{
                    waitLoadComplete();
                },100);
             }
         };
         waitLoadComplete();

        if(obj.imgfile.length==0)
        {//取消
            obj.imgfile = null;
            obj.IMGupdate = false;
        }

         $t.$an.edit.dataRefrsh(news.key+'docphoto'+ row);
     };

    /**
     * 上移 文章段落圖片
     * @param obj 文章
     * @param docObj 文章段落
     * @param imgObj 文章段落圖片
     * @param catchNu 取得異動流水號
    */
     preContentImgDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr,imgObj:pub.DocImgFileFormatCtr)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ns/mg/mb/newsimgpre").input({key:obj.key,path:docObj.path,imgpath:imgObj.path}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重建 排序*/
                        let newObj:Array<pub.DocImgFileFormatCtr> = [];
                        (e.data as Array<string>).forEach((val,nu)=>{
                            (docObj.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val1,nu1)=>
                            {
                                if(val == val1.path)
                                {
                                    newObj.push(val1);
                                }
                            });
                        });
                        docObj.imgAry = newObj;
                    }
                    else
                    {
                        mt.viewAlert(main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 下移 文章段落圖片
     * @param obj 文章
     * @param docObj 文章段落
     * @param imgObj 文章段落圖片
     * @param catchNu 取得異動流水號
    */
    nextContentImgDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr,imgObj:pub.DocImgFileFormatCtr,catchNu:number)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ns/mg/mb/newsimgnext").input({key:obj.key,path:docObj.path,imgpath:imgObj.path}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重建 排序*/
                        let newObj:Array<pub.DocImgFileFormatCtr> = [];
                        (e.data as Array<string>).forEach((val,nu)=>{
                            (docObj.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val1,nu1)=>
                            {
                                if(val == val1.path)
                                {
                                    newObj.push(val1);
                                }
                            });
                        });
                        docObj.imgAry = newObj;
                    }
                    else
                    {
                        mt.viewAlert(main.pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /**
     * 移除 文章段落圖片
     * @param obj 文章
     * @param imgObj 文章段落圖片
    */
    delContentImgDoc = (obj:pub.NewsCtr,docObj:pub.DocPathCtr,imgObj:pub.DocImgFileFormatCtr)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                mt.viewConfirm($t.getLang('mes').delnscontentimg,()=>
                {
                    Login((x)=>x.post("/ns/mg/mb/newsimgdel").input({key:obj.key,path:docObj.path,imgpath:imgObj.path}),(e:any)=>{
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建 */
                            let newObj:Array<pub.DocImgFileFormatCtr> = [];
                            (docObj.imgAry as Array<pub.DocImgFileFormatCtr>).forEach((val:pub.DocImgFileFormatCtr,nu:number)=>
                            {
                                if(val.path != imgObj.path)
                                {
                                    newObj.push(val);
                                }
                            });
                            docObj.imgAry= newObj;
                        }
                        else
                        {
                            mt.viewAlert(main.pub.config.get("error").svbusy);
                        }
                    });
                },null);
            }
        });
    }
    //----------- 標籤
    /** 深入閱讀 上移 
     * @param catchNu 取得異動流水號
    */
    preReadPath = (obj:pub.markPathCtr,data:pub.NewsCtr,catchNu:number)=>
    {
        if(catchNu!=0)
        {
            /** 重建 */
            let newObj:Array<pub.markPathCtr> = [];
            (data.readPathAry as Array<pub.markPathCtr> )
            .forEach((val:pub.markPathCtr,nu:number)=>
            {
                if(nu!=catchNu)
                {
                    if(catchNu-1==nu)
                    {
                        newObj.push(obj);
                    }
                    newObj.push(val);
                }

            });
            data.readPathAry = newObj;
            data.LABELupdate =true;
            $t.$an.edit.dataRefrsh(data.key+'lab');
        }
    }

    /** 深入閱讀 下移 
     * @param catchNu 取得異動流水號
    */
    nextReadPath= (obj:pub.markPathCtr,data:pub.NewsCtr,catchNu:number)=>
    {
        /** 重建 */
        let newObj:Array<pub.markPathCtr> = [];
        (data.readPathAry as Array<pub.markPathCtr> )
        .forEach((val:pub.markPathCtr,nu:number)=>
        {
            if(nu!=catchNu)
            {
                newObj.push(val);
                if(catchNu+1==nu)
                {
                    newObj.push(obj);
                }
            }

        });
        data.readPathAry = newObj;
        data.LABELupdate =true;
        $t.$an.edit.dataRefrsh(data.key+'lab');
    }

    /** 深入閱讀 insert 
     * @param row insert 資料
    */
    insertReadPath= (data:pub.NewsCtr,row:pub.markPathCtr)=>
    {
        data.LABELupdate = true;
        /** 重建 */
        let newObj:Array<pub.markPathCtr> = [row];
        (data.readPathAry as Array<pub.markPathCtr> )
        .forEach((val:pub.markPathCtr,nu:number)=>
        {
            newObj.push(val);
        });
        data.readPathAry = newObj;
        data.LABELupdate =true;
    }

    /** 深入閱讀 del 
     * @param catchNu 取得異動流水號
    */
    delReadPath= (data:pub.NewsCtr,catchNu:number)=>
    {
        mt.viewConfirm($t.getLang('mes').dellabel,()=>{
            /** 重建 */
            let newObj:Array<pub.markPathCtr> = [];
            (data.readPathAry as Array<pub.markPathCtr> )
            .forEach((val:pub.markPathCtr,nu:number)=>
            {
                if(nu!=catchNu)
                {
                    newObj.push(val);
                }
            });
            data.readPathAry = newObj;
            data.LABELupdate =true;
            $t.$an.edit.dataRefrsh(data.key+'lab');
        },null);
    }

    /** 其它 上移 
     * @param catchNu 取得異動流水號
    */
    preMdoc = (obj:pub.markPathCtr,data:pub.NewsCtr,catchNu:number)=>
    {
        if(catchNu!=0)
        {
            /** 重建 */
            let newObj:Array<pub.markPathCtr> = [];
            (data.mdocAry as Array<pub.markPathCtr> )
            .forEach((val:pub.markPathCtr,nu:number)=>
            {
                if(nu!=catchNu)
                {
                    if(catchNu-1==nu)
                    {
                        newObj.push(obj);
                    }
                    newObj.push(val);
                }

            });
            data.mdocAry = newObj;
            data.EVENTLABELupdate =true;
            $t.$an.edit.dataRefrsh(data.key+'eventlab');
        }
    }

    /** 其它 下移 
     * @param catchNu 取得異動流水號
     */
    nextMdoc= (obj:pub.markPathCtr,data:pub.NewsCtr,catchNu:number)=>
    {
    /** 重建 */
    let newObj:Array<pub.markPathCtr> = [];
    (data.mdocAry as Array<pub.markPathCtr> )
    .forEach((val:pub.markPathCtr,nu:number)=>
    {
        if(nu!=catchNu)
        {
            newObj.push(val);
            if(catchNu+1==nu)
            {
                newObj.push(obj);
            }
        }

    });
    data.mdocAry = newObj;
    data.EVENTLABELupdate =true;
    $t.$an.edit.dataRefrsh(data.key+'eventlab');
    }

    /** 其它 insert
     * @param row insert 資料
     */
    insertMdoc= (data:pub.NewsCtr,row:pub.markPathCtr)=>
    {//todo--------
        data.EVENTLABELupdate = true;
        /** 重建 */
        let newObj:Array<pub.markPathCtr> = [row];
        (data.mdocAry as Array<pub.markPathCtr> )
        .forEach((val:pub.markPathCtr,nu:number)=>
        {
            newObj.push(val);
        });
        data.mdocAry = newObj;
        data.EVENTLABELupdate =true;
    }

    /** 其它 del 
     * @param catchNu 取得異動流水號
     */
    delMdoc= (data:pub.NewsCtr,catchNu:number)=>
    {
        mt.viewConfirm($t.getLang('mes').dellabel,()=>{
            /** 重建 */
            let newObj:Array<pub.markPathCtr> = [];
            (data.mdocAry as Array<pub.markPathCtr> )
            .forEach((val:pub.markPathCtr,nu:number)=>
            {
                if(nu!=catchNu)
                {
                    newObj.push(val);
                }
            });
            data.mdocAry = newObj;
            data.EVENTLABELupdate =true;
            $t.$an.edit.dataRefrsh(data.key+'eventlab');
        },null);
    }
    //-----------end
};
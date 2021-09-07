import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** 首頁伴空間消息 */
interface sCtr extends jDB.Story
{
    /** 編緝模式 */
    openEdit:boolean,
    /** 是否被更動資料 */
    update:boolean
    /** 上傳file input */
    imgfile:any,
    /** 欲上傳圖片base64 */
    imgfileAry:Array<pub.imgFileObj>,
    /** 圖片儲存容器 */
    objImg:jObjM,
    /** 是否上傳圖片 */
    IMGupdate:boolean,
};


/** temp this */
let $t:any | undefined;
/** load file  */
let Jobj:jObjM;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 故事*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 選擇起用語系 */
    chooseLang=(val:sCtr,lang:number)=>
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

                Login((x)=>x.post("/ma/mg/story/lang").input({key:val.key,lang:JSON.stringify(ary)} as jDB.News),(e:any)=>
                {//語系注入
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.langAry = e.data.langAry;
                        val.display = false;
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /** 刪除圖片
     * @param img 圖片名
    */
    delImg=(val:sCtr,img:string)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認刪除？("+img+")",()=>
                Login((x)=>x.post("/ma/mg/story/imgdel")
                .input({key:val.key,list:JSON.stringify([img])}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.imgAry = e.data;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }),null);
            }
        });
    }

    /**
     * 上移 圖片
     * @param obj 文章
     * @param imgpath 圖片名
    */
     preContentImgDoc = (obj:sCtr,imgpath:string)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ma/mg/story/imgpre").input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {

                        obj.imgAry = e.data;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙錄中！");
                    }
                });
            }
        });
    }

    /**
     * 下移 圖片
     * @param obj 文章
     * @param imgpath 圖片名
    */
    nextContentImgDoc = (obj:sCtr,imgpath:string)=>{
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {//防連點
                Login((x)=>x.post("/ma/mg/story/imgnext").input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        obj.imgAry = e.data;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙錄中！");
                    }
                });
            }
        });
    }

    /** 刪除文章 */
    del=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認刪除？",()=>
                Login((x)=>x.post("/ma/mg/story/del")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 重建序列container */
                        let newDatalist:Array<sCtr> = [];
                        $t.story.list.forEach((val2:sCtr,nu2:number)=>{//建立排序
                            if(val.key!=val2.key)
                            {
                                if(val.order<val2.order)
                                {
                                    val2.order -= 1;
                                }
                                newDatalist.push(val2);
                            }
                        });
                        $t.story.list = newDatalist;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }),null);
            }
        });
    }
    /** show 標題特顯色塊 */
    showt=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認-"+((!val.showt)?"起動":"關閉")+"標題特顯色塊？",()=>
                Login((x)=>x.post("/ma/mg/story/tshow")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.showt = (e.data as jDB.Story).showt;
                        val.display = false;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }),null);
            }
        });
    }
    /** 顯示文章 */
    display=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認"+((val.display)?"隱藏":"顯示")+"文章？",()=>
                Login((x)=>x.post("/ma/mg/story/display")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.display = (e.data as jDB.Story).display;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }),null);
            }
        });
    }

    /** 圖片顯示為照片牆 */
    imgwp=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認-"+((!val.imgwp)?"照片牆":"一般")+"模式文章照片？",()=>
                Login((x)=>x.post("/ma/mg/story/wallpaper")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.imgwp = (e.data as jDB.Story).imgwp;
                        val.display = false;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }),null);
            }
        });
    }
    

    /** 新增文章 */
    insert=()=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>
        {
            if(he.load==0)
            {
                Login((x)=>x.post("/ma/mg/story/edit")
                .input({key:""}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 注入新資料 */
                        let addData:sCtr = e.data;
                        addData.openEdit = false;
                        addData.update = false;
                        addData.imgfile = null;
                        addData.imgfileAry = [];
                        addData.IMGupdate = false;
                        if(addData.objImg == null)
                        {//建立圖片容器
                            addData.objImg = new (Jobj as any)();
                        }

                        /** 重建序列container */
                        let newDatalist:Array<sCtr> = [addData];
                        $t.story.list.forEach((val:sCtr,nu:number)=>
                        {//建立排序
                            val.order += 1;
                            newDatalist.push(val);
                        });
                        $t.story.list = newDatalist;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
    }

    /** 上移文章 */
    preDocument=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                Login((x)=>x.post("/ma/mg/story/pre")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        if(val.order != (e.data as Array<jDB.Story>)[0].order)
                        {/* 防止未更動情況*/
                            /** 重建序列container */
                            let newDatalist:Array<sCtr> = [];
                            $t.story.list.forEach((val2:sCtr,nu:number)=>
                            {//建立排序
                                if(val2.key==(e.data as Array<jDB.Story>)[1].key)
                                {
                                    val2.order +=1;
                                    val.order -= 1;
                                    newDatalist.push(val);
                                }

                                if(val2.key!=(e.data as Array<jDB.Story>)[0].key)
                                {
                                    newDatalist.push(val2);
                                }
                            });
                            $t.story.list =[];
                            $t.story.list = newDatalist;
                        }
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
    }

    /** 下移文章 */
    nextDocument=(val:sCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                Login((x)=>x.post("/ma/mg/story/next")
                .input({key:val.key}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        if(val.order != (e.data as Array<jDB.Story>)[0].order)
                        {/* 防止未更動情況*/
                            /** 重建序列container */
                            let newDatalist:Array<sCtr> = [];
                            $t.story.list.forEach((val2:sCtr,nu:number)=>
                            {//建立排序
                                if(val2.key!=(e.data as Array<jDB.Story>)[0].key)
                                {
                                    if(val2.key==(e.data as Array<jDB.Story>)[1].key)
                                    {
                                        val2.order +=1;
                                    }
                                    newDatalist.push(val2);
                                }

                                if(val2.key==(e.data as Array<jDB.Story>)[1].key)
                                {
                                    val2.order +=1;
                                    val.order -= 1;
                                    newDatalist.push(val);
                                }
                            });

                            $t.story.list = [];
                            $t.story.list = newDatalist;
                        }
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
    }

    /** 儲存
     */
    save = (val:sCtr)=>
    {
        /** 開始上傳圖片 */
        let uploadImg:Function = ()=>{
            val.imgfileAry.forEach((val1,nu1)=>
            {

                setTimeout(()=>{
                    if(!val1.over)
                    {
                        let getImgKey:number= pb.unixReNow();
                        /** 圖片開始載入 function */
                        let uploadStartFun:Function =()=>
                        {

                            self.imgMaxUploadCount++;
                            self.imgDocUpload(val,val1,getImgKey+"_"+nu1);
                            
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
                    }
                },nu1*50);
            
            });
        };

        if(val.update)
        {
            self.edit(val,()=>
            {
                if(val.IMGupdate)
                {
                    uploadImg();
                }
                else
                {
                    $t.saveRun = false;
                }
            });
        }
        else if(val.IMGupdate)
        {
            uploadImg();
        }
    }
    /** 編緝文章
     * @param fun 待載入 function
     */
    private edit=(val:sCtr,fun:Function)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                mt.viewConfirm("是否確認儲存？",()=>{
                    $t.saveRun = true;
                    Login((x)=>x.post("/ma/mg/story/edit")
                    .input({
                        key:val.key,
                        title:JSON.stringify(val.titleAry),
                        title2:JSON.stringify(val.title2Ary),
                        description:JSON.stringify(val.descriptionAry),
                        url:val.url
                    } as sCtr),(e:any)=>
                    {
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            val.update=false;
                            val.display = false;
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                        $t.saveRun = false;
                        fun();
                    });
                },null);
            }
        });
    }

    /** 圖片上傳最大count */
    private imgMaxUploadCount:number=0;
    /**
      * 上傳文章段圖片
      * @param obj 文章
      * @param imgObj 上傳檔案資訊
      * @param saveObj 儲存進度
      * @param keyid 圖片上傳id
     */
     private imgDocUpload = (obj:sCtr,imgObj:pub.imgFileObj,keyid:string)=>
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


        /** 目前正在載入完成 碎片 計數 */
        let nowSplit:number = 0;
        catchImg.forEach((val1,nu1)=>
        {//排隊佈屬
            /** 排序上傳檔案 */
            let waitUpload:Function = ()=>
            {
                if(nowSplit==nu1)
                {
                    $t.saveRun = true;
                    Login((x)=>x.post("/ma/mg/story/imgupload").input({key:obj.key,imgdata:val1,tp:((catchImg.length-1!=nu1)?'':"complete")+nu1,keyid:keyid}),(e:any)=>
                    {
                        nowSplit++;
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            imgObj.upsize += imgObj.base64.substring(nu1*splitUploadSize,splitUploadSize*(nu1+1)).length;//加總上傳size
                            imgObj.uploadmes = "upload runing...";
                            if(imgObj.upsize==imgObj.uptotalsize)
                            {

                                if(obj.objImg.Jobj[("/ma/mgstimg/"+mt.head.mbdata.uid) as any]==null || obj.objImg.Jobj[("/ma/mgstimg/"+mt.head.mbdata.uid) as any]==undefined)
                                {
                                    obj.objImg.Jobj[("/ma/mgstimg/"+mt.head.mbdata.uid) as any] = {} as any;
                                }
                                let getImgData:any = obj.objImg.Jobj[("/ma/mgstimg/"+mt.head.mbdata.uid) as any];
                                getImgData[("/ma/mgstimg/"+mt.head.mbdata.uid+"/"+e.newImg) as any]=imgObj.base64;//注入圖片
                                obj.objImg.key = "/ma/mgstimg/"+mt.head.mbdata.uid;//注入儲存容器key
                                obj.imgAry = [];
                                obj.imgAry = e.data;
                                obj.display = false;
                                //--------------------完成上傳清除
                                imgObj.uploadmes = "upload complete!";
                                setTimeout(()=>
                                {
                                    self.imgMaxUploadCount--;//釋出空位上傳
                                    let removeImgFile:Array<pub.imgFileObj> = [];
                                    obj.imgfileAry.forEach((val,nu)=>
                                    {//排除已上傳完成
                                        if(val.uptotalsize!=val.upsize)
                                        {
                                            removeImgFile.push(val)
                                        }

                                    });
                                    obj.imgfileAry = removeImgFile;

                                    let complete:boolean=true;
                                    obj.imgfileAry.forEach((val,nu)=>
                                    {//排除已上傳完成(偵聽是否有非失敗未上傳完畢)
                                        if(val.uploadmes !="error for format file(upload fail)" && imgObj.uploadmes != "error unknow!" && !val.over)
                                        {
                                            complete=false;
                                        }
                                    });

                                    if(complete)
                                    {//圖片已上傳完畢-開設儲存動作權限
                                        if(obj.imgfileAry.length==0)
                                        {
                                            obj.imgfile = null;
                                            obj.IMGupdate = false;
                                            pb.el.id('newofileStory_'+obj.key).get.value ="";
                                        }
                                        $t.saveRun = false;
                                    }
                                },100);
                            }
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

                                    self.imgDocUpload(obj,imgObj,keyid);
                                },1000);
                            }
                            else
                            {
                                imgObj.upsize =0;
                                self.imgMaxUploadCount--;

                                let complete:boolean=true;
                                obj.imgfileAry.forEach((val,nu)=>
                                {//排除已上傳完成(偵聽是否有非失敗未上傳完畢)
                                    if(val.uploadmes !="error for format file(upload fail)" && imgObj.uploadmes != "error unknow!" && !val.over)
                                    {
                                        complete=false;
                                    }
                                });

                                if(complete)
                                {//圖片已上傳完畢-開設儲存動作權限
                                    $t.saveRun = false;
                                }

                                imgObj.uploadmes = "error for format file(upload fail)";
                            }
                        }
                        else
                        {
                            imgObj.upsize =0;
                            self.imgMaxUploadCount--;
                            imgObj.uploadmes = "error unknow!";

                     
                            let complete:boolean=true;
                            obj.imgfileAry.forEach((val,nu)=>
                            {//排除已上傳完成(偵聽是否有非失敗未上傳完畢)
                                if(val.uploadmes !="error for format file(upload fail)" && imgObj.uploadmes != "error unknow!" && !val.over)
                                {
                                    complete=false;
                                }
                            });

                            if(complete)
                            {//圖片已上傳完畢-開設儲存動作權限
                                $t.saveRun = false;
                            }
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
    
    /** 取消上傳/全部
    */
    imguploadCancel = (val:sCtr)=>
    {
        let run:Function=()=>
        {//移除動畫
            val.imgfile = null;
            val.update = false;
            val.imgfileAry = [];
            val.IMGupdate = false;
            pb.el.id('newofileStory_'+val.key).get.value ="";
        }
        $t.$an.removeAllUpload('Story'+val.key,run);
    }
     

    /** 刪除預覽上傳單檔 */
    imguploadDel = (val:sCtr,del:number)=>
    {
        $t.$an.removeUpload('Story'+del+val.key,()=>
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
                pb.el.id('newofileStory_'+val.key).get.value ="";
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
    imgupload = (dataObj:sCtr,files:any)=>
    {//同步
        dataObj.imgfile = files.target.files;
        // 清除暫存 base64圖檔
        dataObj.imgfileAry =[];
        /**  catch file input */
        Array.prototype.forEach.call(dataObj.imgfile,(file:any,nu:number)=>{
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

                dataObj.imgfileAry.push({base64:b64,
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
            if(dataObj.imgfile.length==dataObj.imgfileAry.length)
            {
                dataObj.IMGupdate = true;
            }else
            {
                setTimeout(()=>{
                    waitLoadComplete();
                },100);
            }
        };
        waitLoadComplete();

        if(dataObj.imgfile.length==0)
        {//取消
            dataObj.imgfile = null;
            dataObj.IMGupdate = false;
            dataObj.imgfileAry = [];
            dataObj.IMGupdate = false;
        }

        $t.$an.dataRefrsh(dataObj.key+'Storydocphoto');
    };

    /** 搜尋文章 data list
     * @param ser 搜尋關鍵字
     * @param init 是否初始化
     */
    serData=(init:boolean)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                if(init)
                {//初始化搜尋
                    $t.story.list = [];
                }
                
                Login((x)=>x.post("/ma/mg/story/list")
                .input({ser:$t.story.ser,date:(($t.pDM.list.length>0)?$t.story.list[$t.story.list.length-1].date:0)}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                            
                        e.data.forEach((val2:sCtr,nu2:number)=>
                        {//新增資料

                            let insert:boolean=true;
                            ($t.story.list as Array<jDB.Story>).forEach((val1,nu1)=>
                            {//排除重覆
                                if(val1.key==val2.key)
                                {
                                    insert=false;
                                }
                            });
                            
                            if(insert)
                            {
                                //新宣告欄位功能
                                val2.openEdit = false;
                                val2.update = false;
                                val2.imgfile = null;
                                val2.imgfileAry = [];
                                val2.IMGupdate = false;

                                if(val2.objImg == null)
                                {//建立圖片容器
                                    val2.objImg = new (Jobj as any)();
                                }
                                val2.objImg//緩儲圖片容器
                                .loadimgjson("/ma/mgstimg/"+mt.head.mbdata.uid)//載入圖片
                                .input(val2.imgAry)
                                .async((e3,next3)=>
                                { 
                                    e3.forEach((val3,nu3)=>{
                                        $t.$an.loadImg("MGstoryPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                    });
                                    /** 匹次載圖 */
                                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                                    {       
                                        /** 重建圖層更新 get set */
                                        let reImgAry:Array<string> = [];
                                        val2.imgAry.forEach((val3,nu2)=>{
                                            reImgAry.push(val3);
                                        });
                                        val2.imgAry = reImgAry;
                                        //圖片載入完成 imglist
                                        if(re!=null)
                                        {
                                            re((e4,next4)=>
                                            {
                                                e4.forEach((val3,nu3)=>{
                                                    $t.$an.loadImg("MGstoryPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                                });
                                                reNext(next4);
                                            });
                                        }
                                    }
                                    reNext(next3);
                                });
                                $t.story.list.push(val2);
                            }
                        });
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
            }
        });
    }
};
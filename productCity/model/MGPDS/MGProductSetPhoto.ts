import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as MGPSpE from "./pubExtendCtr";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

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
/** 商品圖片設定 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

     /** 圖片上傳最大count */
    private imgMaxUploadCount:number=0;
    /** 無上傳圖片額度停止 */
    private notPpoint:boolean =false;
    /**
      * 上傳文章段圖片
      * @param obj 文章
      * @param imgObj 上傳檔案資訊
      * @param keyid 圖片上傳id
     */
     private imgDocUpload = (obj:MGPSpE.pCtr,imgObj:pub.imgFileObj,keyid:string)=>
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
                        Login((x)=>x.post("/pc/mg/mb/imgupload").input({key:obj.key,imgdata:val1,tp:((catchImg.length-1!=nu1)?'':"complete")+nu1,keyid:keyid}),(e:any)=>
                        {
                            nowSplit++;
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                imgObj.upsize += imgObj.base64.substring(nu1*splitUploadSize,splitUploadSize*(nu1+1)).length;//加總上傳size
                                imgObj.uploadmes = "upload runing...";
                                if(imgObj.upsize==imgObj.uptotalsize)
                                {

                                    if(obj.objImg.Jobj[("/pc/igpt") as any]==null || obj.objImg.Jobj[("/pc/igpt") as any]==undefined)
                                    {
                                        obj.objImg.Jobj[("/pc/igpt") as any] = {} as any;
                                    }
                                    let getImgData:any = obj.objImg.Jobj[("/pc/igpt") as any];
                                    getImgData[("/pc/igpt/"+e.newImg) as any]=imgObj.base64;//注入圖片
                                    obj.objImg.key = "/pc/igpt";//注入儲存容器key
                                    obj.imgAry = [];
                                    obj.imgAry = e.data;

                                    if(($t.productImg as jObjM ).Jobj[("/pc/igpt") as any]==null || ($t.productImg as jObjM ).Jobj[("/pc/igpt") as any]==undefined)
                                    {
                                        ($t.productImg as jObjM ).Jobj[("/pc/igpt") as any]= {} as any;
                                    }
                                    /** 注入商品List圖片 */
                                    let getProductImg:any = ($t.productImg as jObjM ).Jobj[("/pc/igpt") as any];
                                    getProductImg[("/pc/igpt/"+e.newImg) as any]=imgObj.base64;

                                    pb.v($t,"editview").async((e1:any)=>{
                                        e1.val.imgAry = e.data;
                                        e1.obj.imgAry = e.data;
                                    });
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
                                        {//圖片已上傳完畢
                                            if(obj.imgfileAry.length==0)
                                            {
                                                obj.imgfile = null;
                                                obj.IMGupdate = false;
                                                pb.el.id('productImgEditfile').get.value ="";
                                            }
                                        }
                                    },100);
                                }
                            }
                            else if(Number(e.error) == jEnum.Enum_SystemErrorCode.notpointError)
                            {//無額度error
                                mt.ViewAlertAtClose($t.main.pub.config.get("error").notpoint,null,2,$t.main.pub.lib.src('coin.png'));
                                //無額度error
                                self.notPpoint = true;
                                imgObj.upsize =0;
                                self.imgMaxUploadCount--;
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
    imguploadCancel = (val:MGPSpE.pCtr)=>
    {
        let run:Function=()=>
        {//移除動畫
            val.imgfile = null;
            val.update = false;
            val.imgfileAry = [];
            val.IMGupdate = false;
            pb.el.id('productImgEditfile').get.value ="";
        }
        $t.$an.photo.removeAllUpload('product'+val.key,run);
    }
     

    /** 刪除預覽上傳單檔 */
    imguploadDel = (val:MGPSpE.pCtr,del:number)=>
    {
        $t.$an.photo.removeUpload('product'+del+val.key,()=>
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
                pb.el.id('productImgEditfile').get.value ="";
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
    imgupload = (dataObj:MGPSpE.pCtr,files:any)=>
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

        $t.$an.photo.dataRefrsh(dataObj.key+'productdocphoto');
    };

     /** 儲存
     */
    save = (val:MGPSpE.pCtr)=>
    {
        if(val.codekey=='')
        {
            self.notPpoint=false;//初始化
            /** 開始上傳圖片 */
            let uploadImg:Function = ()=>{
                val.imgfileAry.forEach((val1,nu1)=>
                {
                    setTimeout(()=>
                    {
                        if(!self.notPpoint)
                        {
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
                            }
                    },nu1*50);
                });
            };

            if(val.update)
            {//開始上傳
                if(val.IMGupdate)
                {
                    uploadImg();
                }
            }
            else if(val.IMGupdate)
            {
                uploadImg();
            }
        }
        else
        {
            mt.viewAlert($t.langM("notUpload"),()=>{},$t.main.pub.lib.src('publish.png'));
        }
      }

     /**
      * 刪除圖片
      * @param obj 商品 json
      * @param imgary 刪除圖片
      */
     remove = (obj:MGPSpE.pCtr,imgary:Array<String>)=>
     {
        if(obj.codekey=='')
        {
            mt.viewConfirm($t.langM("confirm")+"?"+$t.langM("del"),()=>{
                pb.v($t,"editview").async((e:any)=>{
                    Login((x)=>x.post("/pc/mg/mb/delimg")
                    .input({key:obj.key,imgary:JSON.stringify(imgary)}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            obj.imgAry = e2.data;
                            e.obj.imgAry = e2.data;
                            e.val.imgAry = e2.data;
                            mt.ViewAlertAtClose("OK！",null,3,$t.main.pub.lib.src('delete.png'));
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                    });
                });
            },null);
        }
        else
        {
            mt.viewAlert($t.langM("notRemove"),()=>{},$t.main.pub.lib.src('publish.png'));
        }
     }

     /**
      * 圖片往上移
      * @param obj 
      * @param imgpath 圖片名
      */
     preImg =(obj:MGPSpE.pCtr,imgpath:string)=>
     {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                Login((x)=>x.post("/pc/mg/mb/imgpre")
                .input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        obj.imgAry= e.data;
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                });
            }
        });
     }

    /**
     * 圖片往下移
    * @param obj 
    * @param imgpath 圖片名
     */
    nextImg =(obj:MGPSpE.pCtr,imgpath:string)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            if(e.load==0)
            {
                Login((x)=>x.post("/pc/mg/mb/imgnext")
                .input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        obj.imgAry= e.data;
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                });
            }
        });
    }

    /* 載入圖片 */
    loadImg=(obj:MGPSpE.pCtr)=>
    {
        (obj.objImg as jObjM)//緩儲圖片容器
        .loadimgjson("/pc/igpt")//載入圖片
        .input(obj.imgAry)
        .async((e3,next3)=>
        { 
            e3.forEach((val3,nu3)=>
            {
                $t.$an.photo.loadImg('productPhotoExsit'+val3.split('.')[0],1000);//動畫
            });
            /** 匹次載圖 */
            let reNext = (re:(fun:nextImgLoad)=>void)=>
            {       
                /** 重建圖層更新 get set */
                let reImgAry:Array<string> = [];
                obj.imgAry.forEach((val3,nu2)=>{
                    reImgAry.push(val3);
                });
                obj.imgAry = reImgAry;
                //圖片載入完成 imglist
                if(re!=null)
                {
                    re((e4,next4)=>
                    {
                        e4.forEach((val3,nu3)=>{
                            $t.$an.photo.loadImg('productPhotoExsit'+val3.split('.')[0],1000);//動畫
                        });
                        reNext(next4);
                    });
                }
            }
            reNext(next3);
        });
    }
}
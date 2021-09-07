import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import pbM from "../../../models/pb";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import *  as mbeditPE from "./pubExtendCtr";

/** temp this */
let $t:mbeditPE.mbditTemp;
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
/** 銀行交易資訊 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
        mt = $tObj.mainTemp;
        main = $tObj.main;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 取消上傳/全部*/
    imguploadCancel = ()=>
    {
      $t.BankInput.imgfile = null;
      $t.BankInput.imgfileAry = [];
       pb.el.id('memberEditBankfile').get.value="";
    }

    /**
     * 取得上傳圖片流水號
    */
    imguploadChooseUpload = (nu:number)=>
    {
       mt.viewConfirm($t.lang.get("confirm").uploadBankPhoto,()=>
       {
        $t.BankInput.imgfileAry = [$t.BankInput.imgfileAry[nu]];
           let keyid:string=String(pb.unixReNow())+"_"+nu;
           self.imgUpload($t.BankInput.imgfileAry[0],keyid);
       },null,$t.main.pub.lib.src('bankCar.png'));
    }

   /**
     * 上傳簡述圖片
     * @param obj 文章
     * @param imgObj 上傳檔案資訊
     * @param saveObj 儲存進度
     * @param keyid 圖片上傳id
    */
   private imgUpload = (imgObj:pub.imgFileObj,keyid:string)=>
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
                   Login((x)=>x.post("/ma/mg/mbinfo/imguploadbank").input({key:mt.head.mbdata.uid,keyid:keyid,imgdata:val1,tp:((catchImg.length-1!=nu1)?'':"complete")+nu1}),(e:any)=>
                   {
                       nowSplit++;
                       if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                       {
                           imgObj.upsize += imgObj.base64.substring(nu1*splitUploadSize,splitUploadSize*(nu1+1)).length;//加總上傳size
                           imgObj.uploadmes = "upload runing...";
                           if(imgObj.upsize==imgObj.uptotalsize)
                           {
                               if($t.BankInput.objImg == null)
                               {//建立圖片容器
                                $t.BankInput.objImg = new (Jobj as any)();
                               }

                               if($t.BankInput.objImg.Jobj[("/ma/mgmbbankimg/"+mt.head.mbdata.uid) as any]==null || $t.BankInput.objImg.Jobj[("/ma/mgmbbankimg/"+mt.head.mbdata.uid) as any]==undefined)
                               {
                                 $t.BankInput.objImg.Jobj[("/ma/mgmbbankimg/"+mt.head.mbdata.uid) as any] = {} as any;
                               }
                               let getImgData:any = $t.BankInput.objImg.Jobj[("/ma/mgmbbankimg/"+mt.head.mbdata.uid) as any];
                               getImgData[("/ma/mgmbbankimg/"+mt.head.mbdata.uid+'/'+e.newImg) as any]=imgObj.base64;//注入圖片
                               $t.BankInput.objImg.key = "/ma/mgmbbankimg/"+mt.head.mbdata.uid//注入儲存容器key
                               //--------------------完成上傳清除
                               imgObj.uploadmes = "upload complete!";
                               $t.BankInput.photo = [e.newImg as string];

                               $t.load=false;
                               setTimeout(()=>
                               {
                                   let removeImgFile:Array<pub.imgFileObj> = [];
                                   $t.BankInput.imgfileAry.forEach((val,nu)=>
                                   {//排除已上傳完成
                                       if(val.uptotalsize!=val.upsize)
                                       {
                                           removeImgFile.push(val)
                                       }

                                   });

                                   $t.BankInput.imgfileAry = removeImgFile;
                                   if($t.BankInput.imgfileAry.length==0)
                                   {//圖片已上傳完畢
                                      $t.BankInput.imgfile = null;
                                      pb.el.id('memberEditBankfile').get.value="";
                                   }
                                   $t.load=true;
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

                                   self.imgUpload(imgObj,keyid);
                               },1000);
                           }
                           else
                           {
                               imgObj.upsize =0;
                               imgObj.uploadmes = "error for format file(upload fail)";
                           }
                       }
                       else
                       {
                           imgObj.upsize =0;
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

    /** 圖檔上傳 解析*/
    imgupload = (files:any)=>
    {
      $t.BankInput.imgfile = files.target.files;
        /**  catch file input */
        Array.prototype.forEach.call($t.BankInput.imgfile,(file:any,nu:number)=>{
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

                $t.BankInput.imgfileAry.push({
                   base64:b64,
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
       if($t.BankInput.imgfile.length==0)
       {//取消
          $t.BankInput.imgfile = null;
       }
   };

   /** 刪除bank Info */
   deletePoto = ()=>
   {
       if($t.load && $t.BankInput.photo.length>0)
       {
           $t.load=false;
           Login((x)=> x.post("/ma/mg/mbinfo/delbankimg").input({img:$t.BankInput.photo[0]}), (obj)=> 
           {
               if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
               {
                  $t.BankInput.photo=[];
               }else{
                  mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
               }
               $t.load = true;
           });
       }
   }

    /** BankInfo data init 載入  */
    BankPhoto = ()=>
    {
        pb.v($t,"bankinfoVue").async((eb)=>{
            Login((x)=> x.post("/ma/mg/mbinfo/photobank"), (obj)=> 
            {//取圖片
                if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                {
                    $t.BankInput.photo = obj.img;
                    eb.imgload= false;
                    if($t.BankInput.objImg == null)
                    {//建立圖片容器
                        $t.BankInput.objImg = new (Jobj as any)();
                    }
                    $t.BankInput.objImg
                    .loadimgjson("/ma/mgmbbankimg/"+mt.head.mbdata.uid)//載入圖片
                    .input($t.BankInput.photo)
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
                        reNext(next3);
                        eb.imgload = true;
                        eb.imgload = false;
                        setTimeout(()=>{
                            eb.imgload = true;
                        },300);
                    });

                }
                else
                {
                    mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }

            });
        });
    }
}
import pbM from "../../../models/pb";

import * as pE from "../pubExtendCtr";
import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** 語系分類選擇容器 */
interface langClass
{
    /** 語系名 */
    key:string,
    /** 語系代碼 */
    val:string
}

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
/** 系統共用 */
let main:pub.main;
/** main */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 前往名單處理-單據處理 */
    gotoPayDay = (val:pE.acCtr)=>
    {
        $t.pj.VueName = "MgPd";
        pb.v($t.pj,"MgPd").async((pde)=>{
            let wait:Function =()=>
            {
                if(pde.$m!=null && pde.$m!=undefined)
                {
                    pde.$m.main.insertTag({nameAry:val.titleAry,path:val.key}as pub.markPathCtr);
                }
                else
                {
                    setTimeout(()=>
                    {
                        wait();
                    },50);
                }
            }
            wait();
            pde.showSearchPage = true;
        });
    }

    /** 刪除圖片
     * @param img 圖片名
    */
     delImg=(val:pE.acCtr,img:string)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 mt.viewConfirm("是否確認刪除？("+img+")",()=>
                 Login((x)=>x.post("/ac/mg/doc/imgdel")
                 .input({key:val.key,list:JSON.stringify([img])}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         val.imgAry = e.data;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
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
      preContentImgDoc = (obj:pE.acCtr,imgpath:string)=>{
         pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
         {
             if(eh.load==0)
             {//防連點
                 Login((x)=>x.post("/ac/mg/doc/imgpre").input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         obj.imgAry = e.data;
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
      * 下移 圖片
      * @param obj 文章
      * @param imgpath 圖片名
     */
     nextContentImgDoc = (obj:pE.acCtr,imgpath:string)=>{
         pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
         {
             if(eh.load==0)
             {//防連點
                 Login((x)=>x.post("/ac/mg/doc/imgnext").input({key:obj.key,imgpath:imgpath}),(e:any)=>{
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         obj.imgAry = e.data;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                     }
                 });
             }
         });
     }
 
     /** 刪除文章 */
     del=(val:pE.acCtr)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 mt.viewConfirm("是否確認刪除？",()=>
                 Login((x)=>x.post("/ac/mg/doc/del")
                 .input({key:val.key}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         /** 重建序列container */
                         let newDatalist:Array<pE.acCtr> = [];
                         $t.list.forEach((val2:pE.acCtr,nu:number)=>{//建立排序
                             if(val.key!=val2.key)
                             {
                                 newDatalist.push(val2);
                             }
                         });
                         $t.list = newDatalist;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                     }
                 }),null);
             }
         });
     }

    /** add video youtube */
    editDocVideoYoutube=(val:pE.acCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
            Login((x)=>x.post("/ac/mg/doc/ybe")
            .input({key:val.key,ybe:val.ybe}),(e:any)=>
            {
                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                val.display = false;
                }
                else
                {
                val.ybe ="";
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                }
            });
            }
        });
    }

     /** 顯示報名/發佈 */
     display=(val:pE.acCtr)=>
     {
        if(val.indate >0 && val.edate >0  && val.stdate >0)
        {
            pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                if(he.load==0)
                {
                    mt.viewConfirm("是否確認"+((val.display)?"停用":"發佈")+"文章？",()=>
                    Login((x)=>x.post("/ac/mg/doc/display")
                    .input({key:val.key}),(e:any)=>
                    {
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            val.appck = (e.data as jDB.ActivityIn).appck;
                            val.display = (e.data as jDB.ActivityIn).display;
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                    }),null);
                }
            });
        }
        else
        {
            mt.viewAlert("目前還未設定活動/報名時間！");
        }
     }
    
     /** 必填資訊-聯絡人 */
     Am=(val:pE.acCtr)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 mt.viewConfirm("是否確認"+((val.amCK)?"停用":"起用")+"(必填資訊)聯絡人？",()=>
                 Login((x)=>x.post("/ac/mg/doc/am")
                 .input({key:val.key}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         val.amCK = (e.data as jDB.ActivityIn).amCK;
                         val.display = false;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                     }
                 }),null);
             }
         });
     }
     
      /** 必填資訊-個資 */
     pers=(val:pE.acCtr)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 mt.viewConfirm("是否確認"+((val.peCK)?"停用":"起用")+"(必填資訊)個資？",()=>
                 Login((x)=>x.post("/ac/mg/doc/pers")
                 .input({key:val.key}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         val.peCK = (e.data as jDB.ActivityIn).peCK;
                         val.display = false;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                     }
                 }),null);
             }
         });
     }

    /** 必填資訊-個資 */
    adr=(val:pE.acCtr)=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 mt.viewConfirm("是否確認"+((val.peCK)?"停用":"起用")+"(必填資訊)寄送地址？",()=>
                 Login((x)=>x.post("/ac/mg/doc/adr")
                 .input({key:val.key}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         val.adrCk = (e.data as jDB.ActivityIn).adrCk;
                         val.display = false;
                     }
                     else
                     {
                         mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                     }
                 }),null);
             }
         });
     }


      /** 選擇起用語系 */
    chooseLang=(val:pE.acCtr,lang:number)=>
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

                Login((x)=>x.post("/ac/mg/doc/lang").input({key:val.key,lang:JSON.stringify(ary)} as jDB.ActivityIn),(e:any)=>
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
 
    /** 存儲簡章 */
    private saveDoc = (acObj:pE.acCtr)=>
    {
        if($t.load)
        {
            /** 儲存篇數 count */
            let saveCount:number=0;
            $t.load=false;
          
            saveCount++;
            acObj.langLoad.forEach((key,nu)=>
            {//取得目前已load 語系(被修改一次性儲存)
                /** 取得這系 number */
                let getLangNu:number = 0;
                ($t.main.pub.langAry as Array<langClass>).forEach((val1,nu1)=>
                {//取語係儲存號                    
                    if(val1.val==key)
                    {
                        getLangNu=nu;
                    }
                });

                Login((x)=> x.post("/ac/mg/doc/editcontent").input({key:acObj.key,nu:getLangNu,content: acObj.descriptionAry[getLangNu]}), (obj)=> 
                {
                    acObj.update=false;
                    if (Number(obj.error) != jEnum.Enum_SystemErrorCode.Null) 
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                    saveCount--;
                    if(saveCount==0)
                    {
                        $t.load = true;
                    }
                });
            });
        }
    }
      

    /** 載入簡章 */
    catchDoc = (acObj:pE.acCtr)=>
    {
        $t.load=false;
        Login((x)=> x.post("/ac/mg/doc/content").input({key:acObj.key,nu:($t.main as pub.main).pub.langNu}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                acObj.descriptionAry[($t.main as pub.main).pub.langNu] = obj.data;
                let getNewAry:Array<string> = [];
                acObj.descriptionAry.forEach((val,nu)=>
                {
                    getNewAry.push(val);
                });

                acObj.descriptionAry = [];
                acObj.descriptionAry = getNewAry;
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            $t.load=true;
        });
    }
 
     /** 新增活動 */
     insert=()=>
     {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>
         {
             if(he.load==0)
             {
                 Login((x)=>x.post("/ac/mg/doc/edit")
                 .input({key:""}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         /** 重建序列container */
                         let newDatalist:Array<pE.acCtr> = [self.initListData(e.data)];
                         $t.list.forEach((val:pE.acCtr,nu:number)=>
                         {//建立排序
                             newDatalist.push(val);
                         });
                         $t.list = newDatalist;
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
     save = (val:pE.acCtr)=>
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
     private edit=(val:pE.acCtr,fun:Function)=>
     {
        if(val.inputY >0 && val.inputM>0 && val.inputD>0)
        {
            val.indate = pb.unixRe(val.inputY+"-"+val.inputM+"-"+val.inputD+" "+val.inputH+":00:00");
        }
        else
        {
            val.indate = 0;
        }

        if(val.inputAT_YA >0 && val.inputAT_MA>0 && val.inputAT_DA>0)
        {
            val.stdate = pb.unixRe(val.inputAT_YA+"-"+val.inputAT_MA+"-"+val.inputAT_DA+" "+val.inputAT_HA+":00:00");
        }
        else
        {
            val.stdate = 0;
        }

        if(val.inputAT_YB >0 && val.inputAT_MB>0 && val.inputAT_DB>0)
        {
            val.edate =  pb.unixRe(val.inputAT_YB+"-"+val.inputAT_MB+"-"+val.inputAT_DB+" "+val.inputAT_HB+":00:00");
        }
        else
        {
            val.edate = 0;
        }
 
        if(val.cash*0==0 && val.fee*0==0 && val.count*0==0)
        {
            val.count = Math.abs(val.count);
            val.fee = Math.abs(val.fee);
            val.cash = Math.abs(val.cash);
            val.shfee = Math.abs(val.shfee);
            val.ageX = Math.abs(val.ageX);
            val.ageM =  Math.abs(val.ageM);
            if(val.indate<val.edate  || val.indate <val.stdate)
            {
                mt.viewAlert("活動時間需比報名期間晚！");
            }
            else if(val.indate >0 && val.edate >0  && val.stdate >0)
            {
                pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                    if(he.load==0)
                    {
                        mt.viewConfirm("是否確認儲存？",()=>{
                            $t.saveRun = true;
                            Login((x)=>x.post("/ac/mg/doc/edit")
                            .input({
                                key:val.key,
                                title:JSON.stringify(val.titleAry),
                                indate:val.indate,
                                stdate:val.stdate,
                                edate:val.edate,
                                count:val.count,
                                fee:val.fee,
                                cash:val.cash,
                                ageM:val.ageM,
                                ageX:val.ageX,
                                shfee:val.shfee
                            } as pE.acCtr),(e:any)=>
                            {
                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    val.update=false;
                                    val.display = false;
                                    val.edate = e.data.edate;
                                    val.stdate = e.data.stdate;
                                    self.saveDoc(val);
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
            else
            {
                mt.viewAlert("目前還未設定活動/報名時間！");
            }
        }
        else
        {
            mt.viewAlert("請輸入數字！");
        }
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
      private imgDocUpload = (obj:pE.acCtr,imgObj:pub.imgFileObj,keyid:string)=>
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
                        Login((x)=>x.post("/ac/mg/doc/imgupload").input({key:obj.key,imgdata:val1,tp:((catchImg.length-1!=nu1)?'':"complete")+nu1,keyid:keyid}),(e:any)=>
                        {
                            nowSplit++;
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                imgObj.upsize += imgObj.base64.substring(nu1*splitUploadSize,splitUploadSize*(nu1+1)).length;//加總上傳size
                                imgObj.uploadmes = "upload runing...";
                                if(imgObj.upsize==imgObj.uptotalsize)
                                {

                                    if(obj.objImg.Jobj[("/ac/mgpdimg/"+obj.key) as any]==null || obj.objImg.Jobj[("/ac/mgpdimg/"+obj.key) as any]==undefined)
                                    {
                                        obj.objImg.Jobj[("/ac/mgpdimg/"+obj.key) as any] = {} as any;
                                    }
                                    let getImgData:any = obj.objImg.Jobj[("/ac/mgpdimg/"+obj.key) as any];
                                    getImgData[("/ac/mgpdimg/"+obj.key+"/"+e.newImg) as any]=imgObj.base64;//注入圖片
                                    obj.objImg.key = "/ac/mgpdimg/"+obj.key;//注入儲存容器key
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
                                        {//圖片已上傳完畢
                                            if(obj.imgfileAry.length==0)
                                            {
                                                obj.imgfile = null;
                                                obj.IMGupdate = false;
                                                pb.el.id('newofileACIn_'+obj.key).get.value ="";
                                            }
                                        $t.saveRun = false;
                                        }
                                    },100);
                                    obj.display = false;
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
     imguploadCancel = (val:pE.acCtr)=>
     {
         let run:Function=()=>
         {//移除動畫
             val.imgfile = null;
             val.update = false;
             val.imgfileAry = [];
             val.IMGupdate = false;
             pb.el.id('newofileACIn_'+val.key).get.value ="";
         }
         $t.$an.removeAllUpload('ACIn'+val.key,run);
     }
      
 
     /** 刪除預覽上傳單檔 */
     imguploadDel = (val:pE.acCtr,del:number)=>
     {
         $t.$an.removeUpload('ACIn'+del+val.key,()=>
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
                 pb.el.id('newofileACIn_'+val.key).get.value ="";
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
     imgupload = (dataObj:pE.acCtr,files:any)=>
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
 
         $t.$an.dataRefrsh(dataObj.key+'ACIndocphoto');
     };

     /** 初始化建立欄位 */
     private initListData(val2:pE.acCtr):pE.acCtr
     {
        //新宣告欄位功能
        val2.pdataAry = [];
        val2.ybeInput = "";
        val2.openEdit = false;
        val2.update = false;
        val2.imgfile = null;
        val2.imgfileAry = [];
        val2.IMGupdate = false;
        val2.langLoad = [];
        val2.imgPanel = false;
        val2.timePanel = false;
        val2.runPanel = false;
        val2.feePanel = false;
        val2.pdPanel = false;
        val2.adrnow=false;
        val2.productImg = new (Jobj as any)();
        $t.$an.main.sysYearDate(val2);//時間選擇器初始化

        if(val2.titleAry.length < ($t.main as pub.main).pub.langAry.length)
        {//補語系位置
            for(let a=val2.titleAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
            {
                val2.titleAry.push("");
            }
        }

        if(val2.descriptionAry.length < ($t.main as pub.main).pub.langAry.length)
        {//補語系位置
            for(let a=val2.descriptionAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
            {
                val2.descriptionAry.push("");
            }
        }

        if(val2.objImg == null)
        {//建立圖片容器
            val2.objImg = new (Jobj as any)();
        }
        return val2;
     }
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
                    $t.list = [];
                }
                 Login((x)=>x.post("/ac/mg/doc/list")
                 .input({ser:$t.ser,date:(($t.list.length>0)?$t.list[$t.list.length-1].date:0)}),(e:any)=>
                 {
                     if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                     {
                         e.data.forEach((val2:pE.acCtr,nu2:number)=>
                         {//新增資料
                             let insert:boolean=true;
                             ($t.list as Array<jDB.ActivityIn>).forEach((val1,nu1)=>
                             {//排除重覆
                                 if(val1.key==val2.key)
                                 {
                                     insert=false;
                                 }
                             });
 
                             if(insert)
                             {
                                self.initListData(val2);
                                val2.objImg//緩儲圖片容器
                                 .loadimgjson("/ac/mgpdimg/"+val2.key)//載入圖片
                                 .input(val2.imgAry)
                                 .async((e3,next3)=>
                                 { 
                                     e3.forEach((val3,nu3)=>{
                                         $t.$an.loadImg("MGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
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
                                                     $t.$an.loadImg("MGACInPhoto"+(val3.split('.')[0])+val2.key,1000);//動畫
                                                 });
                                                 reNext(next4);
                                             });
                                         }
                                     }
                                     reNext(next3);
                                 });
                                 $t.list.push(val2);
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
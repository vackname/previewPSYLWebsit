import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

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
/** 商品編緝 設定 */
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
    chooseLang=(val:pE.pCtr,lang:number)=>
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
                pb.v($t,"editview").async((ev:any)=>
                Login((x)=>x.post("/pc/mg/sys/lang").input({key:val.key,lang:JSON.stringify(ary)} as pE.pCtr),(e:any)=>
                {//語系注入
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        val.langAry = e.data.langAry as Array<number>;
                        ev.val.type = e.data.type;
                        ev.obj.type = e.data.type;
                        ev.obj.langAry = val.langAry;
                        mt.viewAlert("設定成功！(未起用商品)",()=>{},$t.main.pub.lib.src('display_off.png'));
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                }));
            }
        });
    }

    /** add video youtube */
    editDocVideoYoutube=(val:pE.pCtr)=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                pb.v($t,"editview").async((ev:any)=>
                {
                Login((x)=>x.post("/pc/mg/sys/ybe")
                    .input({key:val.key,ybe:val.ybe}),(e:any)=>
                    {
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            ev.val.type = e.data.type;
                            ev.obj.ybe = val.ybe;
                            mt.viewAlert("設定成功！(未起用商品)",()=>{},$t.main.pub.lib.src('display_off.png'));
                        }
                        else
                        {
                            val.ybe = "";
                            mt.viewAlert("伺服器忙線中");
                        }
                    });
                });
            }
        });
    }

    /** 前往Member資料檢閱
     * @param uid
     */
    gotoMB =(uid:string)=>
    {
        mt.$m.h.MG.gourlMBMG();
        pb.v($t.main$m,"MgMb").async((toObj)=>
        {
            toObj.InputSer = uid;//關鍵字(帳戶)
            toObj.appckser = "0";//一般搜尋
            setTimeout(()=>
            {
                toObj.$m.mb.MBList(true);
            },600);
        });
    }

    /** 所屬分類 限商店、線上 container */
    getStoreData = ()=>
    {
        $t.storedatalist = pub.getStoreDataCT();
    };

    /** 庫存 type,class container */
    getTypeClassData = ()=>
    {
        $t.productTypeList = pub.getProductTypeCT();
        $t.productClassList = pub.getProductClassCT();
    };

    /** 商品編緝open view 
     * @param approveMark 審核失敗描述
    */
    editF = (obj:pE.pCtr,approveMark:boolean)=>
    {
        //取得現在需定位畫面位置
        $t.scrolltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        pb.v($t,"editview").async((e:any)=>
        {
            if(approveMark)
            {//開起審核失敗資訊閱覽
                e.showPage='approve';
            }
            else
            {//商品設定
                e.showPage='product';
            }
            e.obj = obj;
            e.val = {//初始化斷開繼承-input
                key:obj.key,
                ybe:obj.ybe,
                ybeInput:"",
                langAry:obj.langAry,
                type:obj.type,
                store:obj.store,
                pckey:obj.pckey,
                pctkey:obj.pctkey,
                class:obj.class,
                uid:obj.uid,
                set:obj.set,
                nameAry:obj.nameAry,
                Count:obj.Count,
                cash:obj.cash,
                unitAry:obj.unitAry,
                imgAry:obj.imgAry,
                descriptionAry:obj.descriptionAry,
                countLimit:obj.countLimit,
                langLoad:[] as Array<string>,
                approve:obj.approve,
                mark:obj.mark,
                update:false,
                imgfile:null,
                imgfileAry:[] as Array<pub.imgFileObj>,
                objImg:new (Jobj as any)(),
                IMGupdate:false,
                shunit:obj.shunit,
                fee:obj.fee,
                codekey:obj.codekey,
                appck:obj.appck,
                typeCtr:((obj.type==jEnum.Enum_ProductType.Limit || obj.type==jEnum.Enum_ProductType.StopLimit)?jEnum.Enum_ProductType.Limit:jEnum.Enum_ProductType.NotLimit)
            } as pE.pCtr;
            e.val.imgAry = obj.imgAry;

            if(e.val.langLoad.indexOf($t.main.pub.lang)==-1)
            {/** 阻止已曾經載入語系 */
                e.val.langLoad.push($t.main.pub.lang);
                self.loadDoc(e.val);//載入first 語系簡述
            }

            pb.v(e,"productset").async((e2:any)=>{
                    e2.selfclassmain = ((e.val.pctkey =="" || e.val.pctkey == null)?"333":e.val.pctkey);
                    setTimeout(()=>{//因採用 watch refresh 需wait
                        e2.selfclass = ((e.val.pckey =="" || e.val.pckey == null)?"999":e.val.pckey);
                    },1000);
                    e.ViewOpen();
                    $t.$m.maind.allanceList(e);//取折設定
                });
        });
    };

    /**商品排序往上移
     * @param pobj product json
    */
    productPre = (pobj:pE.pCtr)=>
    {
        if($t.load==true)
        {
            /** catch key */
            let catchKey:boolean = true;
            /** 上一層 key */
            let prvKey:string = "";
            $t.dataList.forEach((val2:any,nu2:number)=>
            {//取欲切換之層級
                if(pobj.key==val2.key)
                {
                    catchKey = false;
                }else if(catchKey)
                {
                    prvKey = val2.key;
                }
            });

            $t.load = false;
            Login((x)=>x.post("/pc/mg/sys/productpre")
                    .input({key:pobj.key,key2:prvKey}),(e2:any)=>
                    {
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建序列container */
                            let newDatalist:Array<pE.pCtr> = [];
                            /** 檢測是否更動排序 */
                            let changeOder:boolean = Number(e2.data.order) != Number(pobj.order);
                            if(changeOder){
                                $t.dataList.forEach((val2:pE.pCtr,nu2:number)=>{//建立排序
                                    if(e2.data.key!=val2.key)
                                    {
                                        if( Number(e2.data.order) == Number(val2.order)){
                                            val2.order=Number(pobj.order);
                                            pobj.mark=e2.data.mark;
                                            pobj.order=e2.data.order;
                                            newDatalist.push(pobj);
                                        }
                                        newDatalist.push(val2);
                                    }
                                });
                                $t.dataList = newDatalist;
                            }
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                        $t.load=true;
                    });
        }
    };

    /**商品排序往下移
     * @param pobj product json
    */
    productNext = (pobj:pE.pCtr)=>{
        if($t.load==true)
        {
            let catchKey:boolean = false;
            let nextKey:string = "";
            $t.dataList.forEach(function(val2:pE.pCtr,nu2:number)
            {//取欲切換之層級
                if(pobj.key==val2.key)
                {
                    catchKey = true;
                }else if(catchKey)
                {
                    catchKey = false;
                    nextKey = val2.key;
                }
            });

            $t.load = false;
            Login((x)=>x.post("/pc/mg/sys/productnext")
                    .input({key:pobj.key,key2: nextKey}),(e2:any)=>
                    {
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建序列container */
                            let newDatalist:Array<pE.pCtr> = [];
                            let changeOder:boolean = Number(e2.data.order) != Number(pobj.order);//檢測是否更動排序
                            if(changeOder){
                                $t.dataList.forEach((val2:pE.pCtr,nu2:number)=>{//建立排序
                                    if(e2.data.key!=val2.key)
                                    {
                                        newDatalist.push(val2);
                                        if( Number(e2.data.order) == Number(val2.order)){
                                            val2.order=Number(pobj.order);
                                            pobj.mark=e2.data.mark;
                                            pobj.order=e2.data.order;
                                            newDatalist.push(pobj);
                                        }
                                    }
                                });

                                $t.dataList = newDatalist;
                            }
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                        $t.load=true;
                    });
        }
    };

    /** 通路設定 */
    storeSet= (getVal:number)=>
    {
        pb.v($t,"editview").async((e:any)=>{
            Login((x)=>x.post("/pc/mg/sys/pstore").input({key:e.val.key,store:getVal}),(e3:any)=>{
                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    e.val.store = e3.data.store;
                    e.obj.store  = e3.data.store;
                    e.val.mark = e3.data.mark;
                    e.obj.mark  = e3.data.mark;
                }
                else
                {
                    mt.viewAlert(((Number(e3.error)==jEnum.Enum_SystemErrorCode.ExistData)?"存在單據無法更動庫存狀態！":"伺服器忙線中"));
                }
            });
        });
    }

    /** 購買數量限制 */
    limitCount = (getCount:number)=>
    {
        pb.v($t,"editview").async((e:any)=>{
            Login((x)=>x.post("/pc/mg/sys/limitcount").input({key:e.val.key,countLimit:getCount}),(e3:any)=>{
                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    e.val.countLimit = e3.data.countLimit;
                    e.obj.countLimit  = e3.data.countLimit;
                    e.val.mark = e3.data.mark;
                    e.obj.mark  = e3.data.mark;
                }
                else
                {
                    mt.viewAlert(((Number(e3.error)==jEnum.Enum_SystemErrorCode.ExistData)?"存在單據無法更動庫存狀態！":"伺服器忙線中"));
                }
            });
        });
    }

    /** 減少庫存 */
    deCount = (getCount:number)=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {
                pb.v($t,"editview").async((e:any)=>{
                    Login((x)=>x.post("/pc/mg/sys/pdecount").input({key:e.val.key,Count:getCount}),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            e.val.Count = e3.data.Count;
                            e.obj.Count  = e3.data.Count;
                            e.val.mark = e3.data.mark;
                            e.obj.mark  = e3.data.mark;
                        }
                        else
                        {
                            mt.viewAlert(((Number(e3.error)==jEnum.Enum_SystemErrorCode.ExistData)?"存在單據無法更動庫存狀態！":"伺服器忙線中"));
                        }
                    });
                });
            }
        });
    }

    /** 增加庫存 */
    inCount = (getCount:number)=>
    {
        pb.v(mt,"head_temp").async((eh:pub.mainHeadTemp)=>
        {
            if(eh.load==0)
            {
                pb.v($t,"editview").async((e:any)=>{
                    Login((x)=>x.post("/pc/mg/sys/pincount").input({key:e.val.key,Count:getCount}),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            e.val.Count = e3.data.Count;
                            e.obj.Count  = e3.data.Count;
                            e.val.mark = e3.data.mark;
                            e.obj.mark  = e3.data.mark;
                        }
                        else
                        {
                            mt.viewAlert(((Number(e3.error)==jEnum.Enum_SystemErrorCode.ExistData)?"存在單據無法更動庫存狀態！":"伺服器忙線中"));
                        }
                    });
                });
            }
        });
     }

    /**
     * 新增實體商品
     * @param setck 商品套餐模式=true
     */
     AddProduct = (setck:boolean)=>
    {
        if($t.load==true)
        {
            if(Number($t.selfclass)!=999)
            {
                $t.load = false;
                $t.$an.loadEdit();//載入動畫
                Login((x)=>x.post("/pc/mg/sys/productinsert")
                        .input({key:"",
                            pckey:$t.selfclass,//類別細項分組
                            set:setck//add us 套餐
                        }),(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 重建序列container */
                                let newDatalist:Array<pE.pCtr> = [];
                                /** index of number */
                                let countNu:number = 0;
                                /** 目前新增資料位於位置 */
                                let nowDataListNu:number=0;
                                $t.dataList.forEach((val2:pE.pCtr,nu2:number)=>
                                {//建立排序
                                    
                                    if( Number(e2.data.order) <= Number(val2.order))
                                    {
                                        if(Number(e2.data.order) == Number(val2.order))
                                        {//add list
                                            countNu++;
                                            nowDataListNu=countNu;

                                            self.addIndexOfLang(e2.data.nameAry);
                                            self.addIndexOfLang(e2.data.unitAry);
                                            self.addIndexOfLang(e2.data.descriptionAry);
                                            newDatalist.push(e2.data);
                                        }
                                        val2.order=Number(val2.order) + 1;
                                    }
                                    countNu++;
                                    newDatalist.push(val2);
                                });

                                if(nowDataListNu==0)
                                {//新增至最後一筆
                                    countNu++;
                                    newDatalist.push(e2.data);
                                    nowDataListNu=countNu;
                                }

                                $t.dataList = newDatalist;
                                $t.pageCount++;//實際庫存更新
        
                                mt.ViewAlertAtClose("已新增(編號:"+nowDataListNu+"):"+($t.main as pub.main).pub.catchLangName(e2.data.nameAry),null,2);
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            };
                            $t.load=true;
                        });
            }
            else
            {
                mt.ViewAlertAtClose("請分組！",()=>{
                    $t.$an.tool.classBorderError("productSetErrorBorder");
                },1);
            }
        }
    };
    
    editProduct = ()=>
    {//商品編緝送出
        pb.v($t,"editview").async((e:any)=>{

                mt.viewConfirm("是否確認編緝或設定此商品？("+($t.main as pub.main).pub.catchLangName(e.val.nameAry)+")",()=>
                {
                    pb.v(e,"productset").async((e4:any)=>{

                        if(($t.main as pub.main).pub.catchLangName(e.val.nameAry)!="(null)" && ($t.main as pub.main).pub.catchLangName(e.val.unitAry)!="(null)" && Number(e.val.fee)*0==0 &&  Number(e.val.cash)*0==0 &&  Number(e.val.shunit)*0==0 && (e4.selfclass!='999' && e4.selfclassmain!='333'))
                        {
                            if(!e.load)
                            {
                                e.val.cash = Math.abs(e.val.cash);
                                e.val.fee = Math.abs(e.val.fee);
                                e.val.shunit = Math.abs(e.val.shunit);
                                let closeType:boolean = Number(e.val.type)>=0;//是否關閉 type
                                e.load = true;//開始載入
                                $t.$an.loadProductEdit();//載入動畫
                                Login((x)=>x.post("/pc/mg/sys/productedit").input({
                                    name:JSON.stringify(e.val.nameAry),
                                    key:e.val.key,
                                    unit:JSON.stringify(e.val.unitAry),
                                    type:e.val.typeCtr,
                                    cash:e.val.cash,
                                    fee:e.val.fee,
                                    shunit:e.val.shunit,
                                    pckey:e4.selfclass,
                                    } as pE.pCtr),(e3:any)=>{
                                    if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                    {
                                        //e.obj= product list
                                        //e.val= edit view
                                        let getData:jDB.Product = e3.data;
                                        this.addIndexOfLang(getData.nameAry);
                                        this.addIndexOfLang(getData.unitAry);
                                        this.addIndexOfLang(getData.descriptionAry);
                                        e.obj.store = getData.store;
                                        e.obj.nameAry = getData.nameAry;
                                        e.obj.descriptionAry = getData.descriptionAry;
                                        e.obj.class = getData.class;
                                        e.obj.key =  getData.key;
                                        e.obj.unitAry = getData.unitAry;
                                        e.obj.type = getData.type;
                                        e.obj.cash = getData.cash;
                                        e.obj.mark = getData.mark;
                                        e.obj.pckey = getData.pckey;
                                        e.obj.pctkey = getData.pctkey;
                                        e.obj.shunit = getData.shunit;
                                        e.obj.fee = getData.fee;
                                        e.obj.Count = getData.Count;
                                        e.val.nameAry = getData.nameAry;
                                        e.val.Count = getData.Count;
                                        e.val.unitAry = getData.unitAry;
                                        e.val.store = getData.store;
                                        e.val.descriptionAry = getData.descriptionAry;
                                        e.val.type = getData.type;
                                        e.val.fee = getData.fee;
                                        e.val.mark = getData.mark;
                                        mt.viewAlert("設定成功！(未起用商品)",()=>{},$t.main.pub.lib.src('display_off.png'));
                                    }
                                    else
                                    {
                                        mt.viewAlert(((Number(e3.error)==jEnum.Enum_SystemErrorCode.ExistData)?"存在單據無法更動庫存狀態！":"伺服器忙線中"));
                                    }
                                    e.val.uploadImg =[];
                                    e.load = false;//結束載入
                                });
                            }
                        }
                        else
                        {
                            mt.viewAlert("錯誤-欄位格式異常、或為空值！");
                        }
                    });
                },null);
            
        });
    
    };

    /** 商品描述語系載入 */
    loadDoc = (obj:pE.pCtr)=>{
        Login((x)=>x.post("/pc/pb/product/doc")
        .input({key:obj.key,nu:$t.main.pub.langNu}),(e2:any)=>{
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            { 
                obj.descriptionAry[$t.main.pub.langNu]=e2.data;
                /** 重建渲染 */
                let newDescription:Array<string> = [];
                obj.descriptionAry.forEach((val,nu)=>
                {
                    newDescription.push(val);
                });

                obj.descriptionAry = newDescription;
                pb.v($t,"editview").async((e:any)=>{
                    e.obj.descriptionAry = obj.descriptionAry;
                });
            }
            else
            {
                mt.viewAlert("伺服器忙線中");
            }
        });

    };

    /** 商品描述 儲存*/
    editProductDescription = (obj:pE.pCtr)=>{
        mt.viewConfirm("是否確認儲存商品描述？",()=>
        {
            obj.descriptionAry.forEach((val,nu)=>
            {
                if(obj.langLoad.indexOf(($t.main as pub.main).pub.langAry[nu].val)>-1)
                {
                    Login((x)=>x.post("/pc/mg/sys/doc")
                    .input({key:obj.key,content:val,langnu:nu}),(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                pb.v($t,"editview").async((e:any)=>{
                                    e.val.type = e2.data.type;
                                    e.obj.type = e2.data.type;
                                    obj.type = e2.data.type;
                                });
                                mt.viewAlert("設定成功！(未起用商品)",()=>{},$t.main.pub.lib.src('display_off.png'));
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                    });
                }
            });
        },null);
    };

    /** 使用者 起用 禁用購買*/
    CancelF = (obj:pE.pCtr)=>{
        mt.viewConfirm("是否確認"+((Number(obj.type)>-1)?"禁用":"起用")+"'使用者'購買？",()=>
        {
            Login((x)=>x.post("/pc/mg/sys/productonoff")
            .input({key:obj.key}),(e2:any)=>{
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        obj.type = Number(e2.type);
                        obj.appck = e2.appck;
                        obj.mark = e2.mark;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
            });
        },null);
    };

    /**補語系位置 */
    private addIndexOfLang=(obj:Array<string>)=>{
        for(let a=obj.length;a<($t.main as pub.main).pub.langAry.length;a++)
        {
            obj.push("");
        }
    };

    /** delete product */
    private removeData=(obj:pE.pCtr)=>{
        Login((x)=>x.post("/pc/mg/sys/productremove")
        .input({key:obj.key}),(e2:any)=>{
                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                {
                    /** 排除當前緩儲存在需刪除 product data*/
                    let newObj:Array<pE.pCtr> = [];
                    mt.viewAlert("已刪除-"+($t.main as pub.main).pub.catchLangName(obj.nameAry));
                    $t.dataList.forEach((val:pE.pCtr,nu:number)=>{
                        if(val.key != obj.key)
                        {
                            if(Number(obj.order)<Number(val.order)){
                                val.order = Number(val.order)-1;
                            }
                            newObj.push(val);
                        }
                    });
                    $t.dataList = newObj;

                    $t.pageCount--;//實際庫存更新
                    $t.pageNu = Math.floor(($t.dataList.length)/20);//更新目前下一個頁碼
                }
                else
                {
                    mt.viewAlert("伺服器忙線中");
                }
                $t.load=true;
        });
    }

    /** 移除商品*/
    RemoveF = (obj:pE.pCtr)=>{
        if($t.load==true)
        {
            if([0].indexOf(Number(obj.class))==-1)
            {
                mt.viewConfirm("是否確認刪除？",()=>
                {
                    $t.load = false;
                    $t.$an.loadEdit();//載入動畫
                    self.removeData(obj);
                },null);
            }else{

                mt.ViewAlertAtClose("系統建置類別無法刪除！");
            }
        }
    };

    /**設定商品 search list
     * @param initSer 是否初始化 true =是
     * @param fun 注入執行另一階段 function
    */
    productListSer=(initSer:boolean,fun:Function)=>
    {
        if($t.load==true)
        {
            $t.load = false;
            setTimeout(()=>{
            $t.$an.loadEdit();//載入動畫
            },100);
            if(initSer)
            {//初化搜尋
                $t.input.InputSer = $t.InputSer;
                $t.input.InputType = $t.InputType;
                $t.input.InputClass = $t.InputClass;
                $t.input.selfclassmain = $t.selfclassmain;
                $t.input.selfclass = $t.selfclass;
                $t.pageNu = 0;
                $t.dataList = [];
            }

            Login((x)=>x.post("/pc/mg/sys/productlist")
                    .input({ser:$t.input.InputSer,type: $t.input.InputType,class:$t.input.InputClass ,page:$t.pageNu,appck:(($t.appck)?"1":"0")})
                    .input({selfclass:(($t.input.selfclassmain!="333")?(($t.input.selfclass=="999")?"999"+$t.input.selfclassmain:$t.input.selfclass):"333")})
                    ,(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /**取得圖層名稱 */
                                let catchProductImg:Array<string>=[];
                                /**db product list */
                                let catchDatalist:Array<pE.pCtr>=[];
                                e2.data.forEach((val:pE.pCtr,nu:number)=>
                                {
                                    /** 是否存在*/
                                    let exist:boolean=false;
                                    $t.dataList.forEach((val2:pE.pCtr,nu2:number)=>{//排除因刪除而造成找回原資料狀況
                                        if(val.key==val2.key)
                                        {
                                            exist=true;
                                        }
                                    });
                                    if(!exist)
                                    {
                                        this.addIndexOfLang(val.nameAry);
                                        this.addIndexOfLang(val.unitAry);
                                        this.addIndexOfLang(val.descriptionAry);
                                        
                                        if(val.imgAry.length>0)
                                        {//push
                                            catchProductImg.push(val.imgAry[0]);
                                        }
                                        val["ybeInput"] = "";
                                        catchDatalist.push(val);
                                       
                                    }
                                });

                                catchDatalist.forEach((val,nu)=>
                                {//渲染框架
                                    $t.dataList.push(val);
                                });

                                ($t.productImg as jObjM)//緩儲圖片容器
                                .loadimgjson("/pc/igpt")//載入圖片
                                .input(catchProductImg)
                                .async((e3,next3)=>
                                { 
                                    e3.forEach((val3,nu3)=>
                                    {
                                        catchDatalist.forEach((val,nu)=>{
                                            if(val3==val.imgAry[0])
                                            {
                                                let imgnew:Array<string> = [];
                                                val.imgAry.forEach((v,n)=>{
                                                    imgnew.push(v);
                                                });
                                                val.imgAry = imgnew;//重建
                                                $t.$an.photo.loadImg('productDatali'+val.key,1000);//動畫
                                            }
                                        });
                                    });
                                    /** 匹次載圖 */
                                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                                    {       
                                        //圖片載入完成 imglist
                                        if(re!=null)
                                        {
                                            re((e4,next4)=>
                                            {
                                                e4.forEach((val3,nu3)=>{
                                                    catchDatalist.forEach((val,nu)=>{
                                                        if(val3==val.imgAry[0])
                                                        {
                                                            let imgnew:Array<string> = [];
                                                            val.imgAry.forEach((v,n)=>{
                                                                imgnew.push(v);
                                                            });
                                                            val.imgAry = imgnew;//重建
                                                            $t.$an.photo.loadImg('productExsit'+val.key,1000);//動畫
                                                        }
                                                    });
                                                });
                                                reNext(next4);
                                            });
                                        }
                                    }
                                    reNext(next3);
                                });

                            
                                e2.discount.forEach((val:jDB.ProductDiscount,nu:number)=>{//正在運行折扣
                                    /** 是否存在*/
                                    let exist:boolean=false;
                                    $t.discountList.forEach((val2:jDB.ProductDiscount,nu2:number)=>{//排除因刪除而造成找回原資料狀況
                                        if(val.key==val2.key)
                                        {
                                            exist=true;
                                        }
                                    });
                                    if(!exist)
                                    {
                                        $t.discountList.push(val);
                                    }
                                });

                                $t.pageCount = Number(e2.pageCount);

                                $t.pageNu++;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            $t.load=true;

                            if(fun!=null && fun!=undefined){
                                fun();
                            }
                    });
        }
    };
}
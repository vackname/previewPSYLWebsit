import * as jDB from "../JsonInterface/db";
import * as jEnum from "./enum";
/** Qrcode model */
import QRCodeM from "../models/qrcode/interface";

import {jObj as jObjM} from "../models/Jobj/interface";

//-------- 入口 main mainTemp  format------
/** 語系分類選擇容器 */
interface langClass
{
    /** 語系名 */
    key:string,
    /** 語系代碼 */
    val:string
}

/** function資料容器 */
interface funDataClass
{
    /** 被切換語系project代碼 */
    key:string,
    /** 語系輸發function */
    val:Function
}

interface AddLangDataClass
{
    /**
     * @param key 被切換語系project代碼
     * @param fun 切換語系 function
     */
    (key:string,fun:()=>void):void
}

interface Addscroll
{
    /**
     * @param key scrollevent project+pageName key
     * @param fun scrollevent function
     */
    (key:string,fun:()=>void):void
}

/** address 國別容器 */
interface adrClass
{
    /** 語系名 */
    key:string,
    /** 語系代碼 */
    val:string
}

/** 基礎設定 config 夾 */
interface config
{
    /** json Object path:models/jsonDoc/config */
    config:jObjM,
    /** image object path:libary/pub */
    lib:jObjM,
    /** 目前選擇語言 */
    lang:string,
    /** address 國別容器 */
    adrAry:Array<adrClass>,
    /** 目前語言系統分類(選擇器) */
    langAry:Array<langClass>,
    /** 切換語系 function */
    langFun:()=>void,
    /** 其它語系function切換或載入 */
    langEventFunc:Array<funDataClass>,
    /** 其它語系function切換或載入(add function) */
    langEventAddFunc:AddLangDataClass,
    /** 當前語系序號 對應DB */
    langNu:number,
    /** DB語系資料對應
     * @param ary DB array 語系資料源
     * @return 被對應langNu indexof value
     */
    catchLangName:(ary:Array<string>)=>string
    /** DB語系資料指接對應
     * @param ary DB array 語系資料源
     * @param nu 直接對應語系號
     * @return 被對應langNu indexof value
     */
    catchLangNameNu:(ary:Array<string>,nu:number)=>string
    /** 注入不重覆scroll事件 */
    scrollAddFun:(obj:Addscroll)=>void
}

/**psyl 起動(預設參數)(注入 temp bind 參數)  */
export interface main
{
    /** 共用 libary 注入 */
    pub:config,
    /** 目前位於子頁code(子標題名) */
    page:string,
    /** 進入專案(init project us) */
    urlName:string,
    /** 網址路徑名 */
    spUrl:string,
}


/** 登入Memberformat */
export interface loginMB
{
    /** 存活時間 unix 標記點*/
    iat:number,
    /** 匿稱 */
    name:string,

    /** 登入屬性 Enum LoginTp */
    tp:number,
    /** 帳戶 */
    account:string,
    /** 帳戶 uid */
    uid:string,
    /** 付費權限  管理者級別 jEnum.Enum_MBLevel.MG 才判別 (1=付費,0未付費), 其他為 MB level */
    get:number,
    /** 權限狀態 "[點數 count]#[使用期限:unit day]" ex:"122#32.3"*/
    status:string,
    /** 會員等級 */
    level:jEnum.Enum_MBLevel
    /** 營業占成 */
    profit:number
}

/** 購物車 */
export interface productCar extends jDB.Product
{
    /** 折數資訊暫存 */
    discountAry:Array<jDB.ProductDiscount>,
    /** error product 購買後錯誤Mark US =true(狀態限制) */
    error:boolean,
    /** error product 購買後錯誤Mark US =true(庫存限制) */
    errorCount:boolean,
    /** 結帳階段運算 折 */
    discount:number,
    /** 選取 ctr */
    ck:boolean,
    /** 被選購數量 */
    count:number,
    /** 圖片儲存容器 */
    objImg:jObjM,
    /** 是否已曾載入圖片*/
    loaddimg:boolean,
    /** 已載入語系 */
    langLoad:Array<string>,
    /** QRCode img 載入 */
    QR:QRCodeM|null
}

/** 購物車選購單 */
export interface pCar
{
    /** 選取 ctr */
    key:string,
    /** 被選購數量 */
    count:number,
}

/** bind init project head temp data */
export interface headBindData
{
    /** 是否顯示 mobile menu */
    headopen:boolean,
    /** 購物車資訊 */
    productCar:Array<pCar>,
    /** 系統MB leve name */
    mbLevelNameList:Array<leveNameContainer>,
    /** 是否登入 */
    singCK:boolean,
    
    mbdata:loginMB,
    /** 是否開起首頁鈕 */
    firstHome: boolean,
}

/** 登入輸入欄位 */
export interface loginInput
{
    /** 帳戶 */
    id:string,
    /** 密碼 */
    pw:string,
    /** 驗證碼 */
    code:string
}

/** bind init project login temp data */
interface LoginBindData{
    /** 是否正在運行=true */
    catchload:boolean,
    /** 登入驗證碼 */
    code:string,
    /** 登入輸入欄位 */
    input:loginInput,
    /** 圖檔容器 */
    img:jObjM
}

/** head menu */
export interface MenuList
{
    /** page or config name(key) */
    key:string,
    /** menu 前置名 ex:'前置名'+'原名' */
    addName:()=>void,
    /** 判斷是否登入使用 */
    logInfun:()=>boolean,
    /** 判斷不登入使用  */
    notLoginFun:()=>boolean,
    /** 判斷位於首頁時是否需顯示 */
    head:boolean,
    /** click function */
    clickfun?:()=>void
    /** 顯示位置是否 從最後開始 */
    FinalAry:boolean
}

/** head teamp */
export interface mainHeadTemp extends headBindData
{
    /** 系統 */
    main:any,
    /** 舊 point*/
    oldIncon:number,
    /** 現在 point*/
    nowIncon:number,
    /** 初始化站台(登入wait)(載入處理計數) */
    load:number,
    /** 搜尋input */
    searchTextBox:string,
    /** 尋bar view */
    searchBox:boolean,
    /** 購物車小圖提示 view */
    payCar:boolean,
    /** 目前所選 page */
    targetPageName:string,
    /** maintain array */
    maintainList:Array<string>,
    /** Menu head list */
    MenuList:Array<MenuList>,
    /** Menu head list第二層分類-工具箱 */
    MenuList2:Array<MenuList>,
    /** Menu head list第二層分類-文章管理 */
    MenuList3:Array<MenuList>,
    /** Menu head list第二層分類-營業活動 管理工具 */
    MenuList4:Array<MenuList>,
    /** post system roject連接路徑 */
    psys:any;
    /** 採踩Project連接路徑 */
    ncc:any;
    /** 新聞媒體Project連接路徑 */
    ns:any;
    /** 商城Project連接路徑 */
    pc:any;
    /** 入口首頁Project連接路徑 */
    tur:any;
    /** 後台管理Project連接路徑 */
    MG:any;
    /** 設定連結路徑 */
    urlset:any;
    /** 語系 web頁 (config page json)
     * @param str key
     * @returns json value
    */
    getLange:(str:string)=>string,
    /** 登入永久付費使用權 */
    PayLevel:()=>boolean,
    /** 一般使用權 */
    NormalLevel:()=>boolean,
    /** 商家登入使用權 */
    MGLevel:()=>boolean,
    /** 寫手登入使用權 */
    RgLevel:()=>boolean,
    /** 編緝者登入使用權 */
    editLevel:()=>boolean,
    /** 系統管理者 */
    SysLevel:()=>boolean,
    /** 最高權限管理者 */
    chiefSysLevel:()=>boolean,
    /** 使用app權限 */
    useAppLevel:()=>boolean,
    /** 權限使用者名稱 
     * @param value mblevel
     * @returns level name
    */
    levelName:(value:jEnum.Enum_MBLevel)=>string,
    /** animate model */
    $an:any,
    /**db or data process model */
    $m:any
}

/** init project(初始化入口點project) */
export interface mainTemp
{
    /** 為本系統websit 登入為 = true */
    loginType:boolean,
   /** 系統 this */
    main:any,
    /** head teamp data bind */
    head:headBindData,
    /** login temp */
    login:LoginBindData,
    /** 緩儲已載入陣列 */
    loadMark:Array<string>,
    /** 緩緒切換頁 enum model/pubExtendCtr enum_pag */
    NuView:number,
    /** 經由 TagBag進入點之記錄 (NuView  enum model/pubExtendCtr) */
    gotoPageHistory:number,
    /** 透過 標籤前往頁 */
    gotoTagBag:boolean,
    /** 是否開啟maintain model */
    maintain:boolean|false,
    /** 緩開 未登入狀況不載入 login view model */
    loginopen:boolean,
    /** 首頁換存 開起專案temp(未緩存共用 show temp) */
    VueName:string,
    /** 登入使用App階級 */
    useAppLevel:()=>boolean,
    /** 登入已付費使用一般使用權 */
    NormalLevel:()=>boolean,
    /** 系統管理者 */
    SysLevel:()=>boolean,
     /** 編緝管理者 */
    editLevel:()=>boolean,
    /** 登入永久付費使用權 */
    PayLevel:()=>boolean,
    /**
     * message box (auto close)
     * @param mes 訊息
     * @param func 運行function
     * @param sec wait 訊訊秒數 預設3秒
     * @param imgicon get icon img
    */
    ViewAlertAtClose:(mes:string,func?:Function|null,sec?:Number,imgicon?:string)=>void,
    /**
     * message box
     * @param mes 訊息
     * @param func 運行function
     * @param imgicon get icon img
    */
    viewAlert:(mes:string,func?:Function,imgicon?:string)=>void,
    /**
     * message box yes false
     * @param mes 訊息
     * @param func yes 運行function
     * @param fu no 運行function
     * @param imgicon get icon img
    */
    viewConfirm:(mes:string,func:Function|null,fu:Function|null,imgicon?:string)=>void,

    /**
     * message box yes false(input)
     * @param mes 訊息
     * @param func yes 運行function
     * @param fu no 運行function
     * @param imgicon get icon img
    */
    ViewConfirmInput:(mes:string,func:(mark:string)=>void|null,fu:Function|null,imgicon?:string)=>void,
    /**
     * message box
     * @param title 標題
     * @param mes 訊息
     * @param func 運行function
     * @param imgicon get icon img
    */
    viewMes:(title:string,mes:string,func?:Function|null,imgicon?:string)=>void,
    /** 前往首頁 */
    chooseFirstPage:()=>void,
    /** model */
    $m:any
}
//----------------------end

//------共用 樣版 format
/** page 選擇器 */
export interface pageTool{
    /** 成員 page number */
    pageNu:number,
    /** total page  */
    pageCount:number,
    /** 外接 選頁後運行function */
    runAction:()=>void,
}
//-----end

//---------- enum catch list

/**  新聞分類庫名Title first 分類(操作view key)  */
export interface SERnctCtr extends jDB.NewsClassNameTitle
{
  /** 第二層分類 */
  cl: Array<jDB.NewsClassName>|[],
};

/**  新聞分類庫名Title first 分類(操作view key)  */
export interface nctCtr extends jDB.NewsClassNameTitle
{
  /** 第二層分類 */
  cl: Array<ncsCtr>|[],
  /** 顯示第二層分類 項目 */
  opencl:boolean|false,
  /** 輸入欄位 解除 禁用=true */
  firstinput:boolean|false,
};

/**  新聞分類庫二次 分類(操作view key)  */
export interface ncsCtr extends jDB.NewsClassName
{
  /** 輸入欄位 解除 禁用=true */
  firstinput:boolean|false,
};


/**  彩踩分類庫名Title first 分類(操作view key)  */
export interface SERnctccCtr extends jDB.NewsLClassNameTitle
{
  /** 第二層分類 */
  cl: Array<jDB.NewsLClassName>|[],
};

/**  彩踩分類庫名Title first 分類(操作view key)  */
export interface nctccCtr extends jDB.NewsLClassNameTitle
{
  /** 第二層分類 */
  cl: Array<ncsccCtr>|[],
  /** 顯示第二層分類 項目 */
  opencl:boolean|false,
  /** 輸入欄位 解除 禁用=true */
  firstinput:boolean|false,
};

/**  彩踩分類庫二次 分類(操作view key)  */
export interface ncsccCtr extends jDB.NewsLClassName
{
  /** 輸入欄位 解除 禁用=true */
  firstinput:boolean|false,
};


/**  商品分類庫名Title first 分類(操作view key)  */
export interface pctCtr extends jDB.ProductClassNameTitle
{
  /** 第二層分類 */
  cl: Array<pcsCtr>|[],
  /** 顯示第二層分類 項目-編緝class */
  opencl:boolean|false,
  /** 輸入欄位 解除 禁用=true-編緝class */
  firstinput:boolean|false,
};

/**  商品分類庫二次 分類(操作view key)  */
export interface pcsCtr extends jDB.ProductClassName
{
  /** 輸入欄位 解除 禁用=true */
  firstinput:boolean|false,
};

/** 支付狀態 ontainer*/
export interface payStatusContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}

/** 支付類別 container */
export interface payTypeContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}

/** 支付狀態 */
export function payStatusCT():Array<payStatusContainer> 
{
    let getPayStatus:Array<payStatusContainer> = [];
    Object.keys(jEnum.Enum_payStatus).filter(key=> typeof jEnum.Enum_payStatus[key as any] != "string").map(key =>
    {
        getPayStatus.push({
            nameAry:JSON.parse(jEnum.Enum_view_payStatus(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_payStatus[key as any])
        } as payStatusContainer);
    });
    return getPayStatus;
}

/** 支付類別 */
export function payTypeCT():Array<payTypeContainer>
{
    let getPayType:Array<payTypeContainer> = [];
    Object.keys(jEnum.Enum_payType).filter(key=> typeof jEnum.Enum_payType[key as any] != "string").map(key =>
    {
        getPayType.push({
            nameAry:JSON.parse(jEnum.Enum_view_payType(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_payType[key as any])
        } as payTypeContainer);
    });
    return getPayType
}

/** 所屬分類 限商店、線上 container */
export interface StoreContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}

/** 所屬分類 限商店、線上 container */
export function getStoreDataCT():Array<StoreContainer>
{
    let getStoredata:Array<StoreContainer> = [];
    Object.keys(jEnum.Enum_ProductStore).filter(key=> typeof jEnum.Enum_ProductStore[key as any] != "string").map(key =>
    {
        getStoredata.push({
            nameAry:JSON.parse(jEnum.Enum_view_ProductStore(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_ProductStore[key as any])
        } as StoreContainer);
    });
    return getStoredata;
};


/** 產品庫存屬性 TYPE container */
export interface productTypeContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}

/**  產品庫存屬性 分類 container */
export interface productClassContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}

/** 庫存 type container */
export function getProductTypeCT():Array<productTypeContainer>
{
    let getProductType:Array<productTypeContainer> = [];
    Object.keys(jEnum.Enum_ProductType).filter(key=> typeof jEnum.Enum_ProductType[key as any] != "string").map(key =>
    {
        getProductType.push({
            nameAry:JSON.parse(jEnum.Enum_view_ProductType(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_ProductType[key as any])
        } as productTypeContainer);
    });
    return getProductType;
};

/** 庫存 class container */
export function getProductClassCT():Array<productClassContainer>
{
    let getProductClass:Array<productClassContainer> = [];
    Object.keys(jEnum.Enum_ProductClass).filter(key=> typeof jEnum.Enum_ProductClass[key as any] != "string").map(key =>
    {
        getProductClass.push({
            nameAry:JSON.parse(jEnum.Enum_view_ProductClass(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_ProductClass[key as any])
        } as productClassContainer);
    });
    return getProductClass;
};

/**  會員等級name  container */
export interface leveNameContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}
/** 會員等級name */
export function leveNameDataCT():Array<leveNameContainer> 
{
    let getMBlevel:Array<leveNameContainer> = [];
    Object.keys(jEnum.Enum_MBLevel).filter(key=> typeof jEnum.Enum_MBLevel[key as any] != "string").map(key =>
    {
        getMBlevel.push({
            nameAry:JSON.parse(jEnum.Enum_view_MBLevel(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_MBLevel[key as any])
        } as leveNameContainer);
    });
    return getMBlevel;
};

/**  推薦商品選擇容器 container */
export interface giftOptionContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}
/** 推薦商品選擇容器 */
export function giftOptionCT():Array<giftOptionContainer> 
{
    let giftOption:Array<giftOptionContainer> = [];
    Object.keys(jEnum.Enum_giftOptin).filter(key=> typeof jEnum.Enum_giftOptin[key as any] != "string").map(key =>
    {
        giftOption.push({
            nameAry:JSON.parse(jEnum.Enum_view_giftOptin(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_giftOptin[key as any])
        } as giftOptionContainer);
    });
    return giftOption;
};
//----------end
//---------登入 ajax 容器
export interface asyncGet
{
     /**
      * send data (json object)
     */
    input:(json:any)=>asyncGet

    /**
      * send web head (json object)
     */
    head:(json:any)=>asyncGet,

    /**
     * ajax async
     */
     async:(obj:(e:any)=>void)=>void
}

/**
 * @param url Api 路經
*/
type goApi = (url:string)=>asyncGet;

/**
 * login ajax
 */
export interface ajax
{

    /**
     *  ajax post token
    */
    post:goApi,

    /**
     *  ajax post file token
     */
    file:goApi,
}

/**
 * ajax 排程 暫存
*/
export interface ajaxFun
{
    ajax:()=>asyncGet,
    fun:Function
}


/** login AJAX (API core)
* @param e ajax set type
* @param funobj ajax wait action function(ajax catch json)
*/
export type Login=(gx:(e:ajax)=>any,funobj:(json:any)=>void)=>void;
//-------------------- end


//-----file 文章 foramt
/** 
 文章format
 */
 export interface DocPathCtr extends jDB.DocPath
 {
    /** video input youtube url */
    ybeInput:string,
    /* 文章 file生成 (語系儲存容器)*/
    content:{[nameKey:string]:jDB.DocFileFormat},
    /** 是否已更動 */
    update:boolean,
    /** 是否上傳圖片 */
    IMGupdate:boolean,
    /** 欲上傳圖片base64 */
    imgfileAry:Array<imgFileObj>,
    /** 上傳圖片 容器 */
    imgfile:any|null,
    /** 圖片儲存肉呣 */
    objImg:jObjM,
 }

 /** 彩踩文章 語系 ctr */
 export interface NewsccCtr extends jDB.NewsL
 {
    /** 是否顯示文章 */
    show:boolean,
    /** 審核失敗view */
    showApprove:boolean,
    /** title 是否資料更動 */
    update:boolean,
    /** 標籤 是否資料更動 */
    LABELupdate:boolean,
    /** 其它標籤 是否資料更動 */
    EVENTLABELupdate:boolean,
    /** 目前已載入語系 */
    langLoad:Array<string>,
    /** 編緝模式 */
    edit:boolean,
    /** 是否已載入文章(語系) */
    loadDoc:[x:boolean],
    /** 之前文章載入 temp */
    bshow:boolean,
    /** 載入之前文章 */
    bContent:any|null,
    /** 後續文章載入 temp */
    afshow:boolean,
    /** 載入後續文章 */
    afContent:any|null,
    /** label animate name */
    val:string|null
    /** doc left border color */
    TagColor:number|null
    /** 文章附屬code number 編號=0=無上下追蹤 1=上一篇開起,2=下一篇開啟 (button) */
    TraceTpBF:number,
}

 /** 新聞文章 語系 ctr */
 export interface NewsCtr extends jDB.News
 {
    /** 是否顯示文章 */
    show:boolean,
    /** 審核失敗view */
    showApprove:boolean,
    /** title 是否資料更動 */
    update:boolean,
    /** 標籤 是否資料更動 */
    LABELupdate:boolean,
    /** 其它標籤 是否資料更動 */
    EVENTLABELupdate:boolean,
    /** 目前已載入語系 */
    langLoad:Array<string>,
    /** 編緝模式 */
    edit:boolean,
    /** 是否已載入文章(語系) */
    loadDoc:[x:boolean],
    /** 之前文章載入 temp */
    bshow:boolean,
    /** 載入之前文章 */
    bContent:any|null,
    /** 後續文章載入 temp */
    afshow:boolean,
    /** 載入後續文章 */
    afContent:any|null,
    /** label animate name */
    val:string|null
    /** doc left border color */
    TagColor:number|null
    /** 文章附屬code number 編號=0=無上下追蹤 1=上一篇開起,2=下一篇開啟 (button) */
    TraceTpBF:number,
}

/** 上傳圖檔暫存資訊 */
export interface imgFileObj
{
    /** base64檔案 */
    base64:string,
    /** 大小 單位名*/
    sizeName:string,
    /** 大小 */
    size:string,
    /** 檔名 */
    filename:string,
    /** 上傳運行資訊 */
    uploadmes:string,
    /** 重新上傳次數 */
    restart:number,
    /** 已上傳長度 */
    upsize:number,
    /** 總長度長度 */
    uptotalsize:number,
    /** 是否超出容量上傳限制 */
    over:boolean,
}

/** 文章段落img foramt */
export interface DocImgFileFormatCtr extends jDB.DocImgFileFormat
{
    /** 是否已更動 */
    update:boolean,
}

/** 標籤 */
export interface markPathCtr extends jDB.markPath
{
    /** 是否已更動 */
    update:boolean,
    /** 顯示文章 */
    show:boolean,
    /** 載入內容 */
    content:any|null,
    /** 文章被禁止閱讀 */
    lock:boolean
}

/** 文章標籤類別狀態 ontainer*/
export interface docTypeContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}


/** 文章標籤類別狀態 */
export function docTypeCT():Array<docTypeContainer> 
{
    let getDocType:Array<docTypeContainer> = [];
    Object.keys(jEnum.Enum_docType).filter(key=> typeof jEnum.Enum_docType[key as any] != "string").map(key =>
    {
        getDocType.push({
            nameAry:JSON.parse(jEnum.Enum_view_docType(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_docType[key as any])
        } as docTypeContainer);
    });
    return getDocType;
}

//---end

/** 文章標籤類別狀態 */
/** 支付銀行 */
interface bankTpContainer
{
    name:string,
    val:number
}
/** 支付銀行 */
export function bankCT():Array<bankTpContainer> 
{
    let getDocType:Array<bankTpContainer> = [];
    Object.keys(jEnum.Enum_bankSuport).filter(key=> typeof jEnum.Enum_bankSuport[key as any] != "string").map(key =>
    {
        getDocType.push({
            name:jEnum.Enum_view_bankSuport(key),
            val:Number(jEnum.Enum_bankSuport[key as any])
        } as bankTpContainer);
    });
    return getDocType;
}

/** 支付銀行img */
export function bankImg(img:jObjM,bank:number)
{
    switch(bank)
    {
        case jEnum.Enum_bankSuport.app:
            return img.src("coin.png");
        case jEnum.Enum_bankSuport.linePay:
            return img.src("line.png");
        case jEnum.Enum_bankSuport.tsbTo:
            return img.src("tsb.png");
        case jEnum.Enum_bankSuport.client:
            return img.src("mb.png");
         case jEnum.Enum_bankSuport.admin:
            return img.src("admin.png");
    }
}

/** 寄送狀態 ontainer*/
interface shtpStatusContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}
/** 寄送狀態 */
export function shtpStatusCT():Array<shtpStatusContainer> 
{
    let getStatus:Array<shtpStatusContainer> = [];
    Object.keys(jEnum.Enum_sttype).filter(key=> typeof jEnum.Enum_sttype[key as any] != "string").map(key =>
    {
        getStatus.push({
            nameAry:JSON.parse(jEnum.Enum_view_sttype(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_sttype[key as any])
        } as shtpStatusContainer);
    });
    return getStatus;
}

/** 寄送時段 ontainer*/
interface dTimeContainer
{
    /** 參數 */
    val:number,
    /** name lang */
    nameAry:Array<string>,
}
/** 寄送時段 */
export function dTimeCT():Array<dTimeContainer> 
{
    let getDtime:Array<dTimeContainer> = [];
    Object.keys(jEnum.Enum_DeliveryTime).filter(key=> typeof jEnum.Enum_DeliveryTime[key as any] != "string").map(key =>
    {
        getDtime.push({
            nameAry:JSON.parse(jEnum.Enum_view_DeliveryTime(key).replace(/'/g,"\"")) as Array<string>
            ,val:Number(jEnum.Enum_DeliveryTime[key as any])
        } as dTimeContainer);
    });
    return getDtime;
}

/**  運費總計 */
interface shfeeFormat
{
    /** 運費 */
    fee:number,
    /**
     * 包裝格式
    */
    foramt:string
}

/** 計算運費
* @param getPCar 商品
* @param getSh 運費陣列
*/
export function adrFeeSum(getPCar:Array<productCar>,getSh:Array<jDB.shipingAddressFee>,sumProductCash:number):shfeeFormat
{
   /** 包裝format name */
   let getShFormat:string="";
   /** 目前最大滿額 */
   let MaxFee:number=0;
   /** 滿額 */
   let cashMax:boolean =false;
   getSh.forEach((val,nu)=>{
       if(sumProductCash >= val.fee &&val.shfeecancel && MaxFee<=val.fee)
       {//滿額免運(選額度最大)
           getShFormat = val.name+",";
           MaxFee =val.fee;
           cashMax = true;
       }
   });

   /** 運費累計 */
   let shunitFee:number = 0;
   if(!cashMax)
   {
       /** 送單集合 */
       let aryShunit:Array<jDB.PayOptions> =[];

       getPCar.forEach((val,nu)=>
       {//重組清單
           aryShunit.push({pkey:val.key,count:val.count,shunit:val.shunit,cash:val.cash} as jDB.PayOptions);
       });

       /** 取非共通性運費 */
       let area:Array<jDB.shipingAddressFee> = [];
       /** 取共通性運費 */
       let pubSfee:Array<jDB.shipingAddressFee> = [];

       getSh.forEach((val,nu)=>{
           if(val.city!='all' && !val.shfeecancel)
           {
               area.push(val);
           }

           if(val.city=='all' && !val.shfeecancel)
           {
               pubSfee.push(val);
           }
       });

       /** 容積計算累積 */
       let shunit:number = 0;
       /** 取得運費key */
       let catchKey:String = "";
       /** 取全域運費key */
       let catchKeyPub:String = "";
       /** 最後一筆資料計數器 */
       let finalCount:number = 0;
       /** 商品容積異常 */
       let sizeError:boolean = false;
       aryShunit.forEach((n,nu)=>{
           var getdata=new Array(Number(n.count));

           for(let nu1=0;nu1<getdata.length; nu1++)
           {
               shunit += n.shunit;//當前容積
               let catchSfee:Array<jDB.shipingAddressFee> = [];
               //取最小
               let ctachBigSize:Array<jDB.shipingAddressFee> = [];
               //取最大
               area.forEach((val1,nu1)=>
               {
                   if(val1.shunit >= shunit)
                   {
                       if(catchSfee.length==0)
                       {
                           catchSfee.push(val1);
                       }
                       else if(catchSfee[0].shunit>val1.shunit)
                       {//選最小容積
                           catchSfee=[val1];
                       }

                       if(ctachBigSize.length==0)
                       {
                            ctachBigSize.push(val1);
                       }
                       else if(ctachBigSize[0].shunit<=val1.shunit)
                       {//選最大容積
                            ctachBigSize=[val1];
                       }
                   }
               });
               //取最小容積單位排序
               if (catchSfee.length > 0)
               {//區域性
                   catchKey = catchSfee[0].key;//當前包裝最小運費Key
                   if (finalCount + 1 == aryShunit.length && nu1 + 1 == Number(n.count)//為最後一筆存在容積
                   || ctachBigSize[0].shunit<= shunit+n.shunit)//已滿結算
                   {
                       shunitFee += ((ctachBigSize[0].shunit<= shunit+n.shunit)?ctachBigSize[0]:catchSfee[0]).fee;
                       getShFormat += ((ctachBigSize[0].shunit<= shunit+n.shunit)?ctachBigSize[0]:catchSfee[0]).name+",";
                       catchKey = "";//還原
                       shunit=0;
                   }
               }
               else
               {//取不到參數即為當前運費
                   if (catchKey != "" && area.length > 0)
                   {//區域性
                        let catchSfee2:Array<jDB.shipingAddressFee> = [];
                        //取最小
                        area.forEach((val1,nu1)=>
                        {
                            if(val1.key == catchKey)
                            {
                                catchSfee2.push(val1);
                            }
                        });
                       shunitFee += catchSfee2[0].fee;
                       getShFormat += catchSfee2[0].name+",";
                       catchKey = "";//還原
                       shunit = n.shunit;


                       let catchSfee1:Array<jDB.shipingAddressFee> = [];
                       //取最小
                       let ctachBigSize1:Array<jDB.shipingAddressFee> = [];
                       //取最大
                       area.forEach((val1,nu1)=>
                       {
                           if(val1.shunit >= shunit)
                           {
                               if(catchSfee1.length==0)
                               {
                                   catchSfee1.push(val1);
                               }
                               else if(catchSfee1[0].shunit>val1.shunit)
                               {//選最小容積
                                   catchSfee1=[val1];
                               }

                               if(ctachBigSize1.length==0)
                               {
                                    ctachBigSize1.push(val1);
                               }
                               else if(ctachBigSize1[0].shunit<=val1.shunit)
                               {//選最大容積
                                    ctachBigSize1=[val1];
                               }
                           }
                       });

                       if (finalCount + 1 == aryShunit.length && nu1 + 1 == Number(n.count)//為最後一筆存在容積
                       || ctachBigSize1[0].shunit<= shunit+n.shunit)//已滿結算
                       {
                           shunitFee += ((ctachBigSize[0].shunit<= shunit+n.shunit)?ctachBigSize1[0]:catchSfee1[0]).fee
                           getShFormat += ((ctachBigSize[0].shunit<= shunit+n.shunit)?ctachBigSize1[0]:catchSfee1[0]).name+",";
                           catchKey = "";//還原
                           shunit = 0;
                       }
                   }
                   else
                   {//全域式計算運費
                       let CatchpubSfee:Array<jDB.shipingAddressFee> = [];
                       //取最小
                       let ctachBigPubSize:Array<jDB.shipingAddressFee> = [];
                       //取最大
                       pubSfee.forEach((val1,nu1)=>
                       {    
                           if(val1.shunit >= shunit)
                           {
                               if(CatchpubSfee.length==0)
                               {
                                   CatchpubSfee.push(val1);
                               }
                               else if(CatchpubSfee[0].shunit>val1.shunit)
                               {//選最小容積
                                   CatchpubSfee=[val1];
                               }

                               if(ctachBigPubSize.length==0)
                               {
                                    ctachBigPubSize.push(val1);
                               }
                               else if(ctachBigPubSize[0].shunit<=val1.shunit)
                               {//選最大容積
                                  ctachBigPubSize=[val1];
                               }
                           }
                       });

                       if (CatchpubSfee.length > 0)
                       {
                           catchKeyPub = CatchpubSfee[0].key;//當前運費Key
                           if (finalCount + 1 == aryShunit.length && nu1 + 1 == Number(n.count)//為最後一筆存在容積
                           || ctachBigPubSize[0].shunit<= shunit+n.shunit)//已滿結算
                           {
                               shunitFee += ((ctachBigPubSize[0].shunit<= shunit+n.shunit)?ctachBigPubSize[0]:CatchpubSfee[0]).fee;
                               getShFormat += ((ctachBigPubSize[0].shunit<= shunit+n.shunit)?ctachBigPubSize[0]:CatchpubSfee[0]).name+",";
                               catchKeyPub = "";//還原
                               shunit = 0;
                           }
                       }
                       else if (catchKeyPub != "")
                       {
                           
                           let CatchpubSfee2:Array<jDB.shipingAddressFee> = [];
                           //取最小
                           pubSfee.forEach((val1,nu1)=>
                           {
                               if(val1.key ==catchKeyPub)
                               {
                                    CatchpubSfee2.push(val1);
                               }
                           });

                           shunitFee += CatchpubSfee2[0].fee;
                           getShFormat += CatchpubSfee2[0].name+",";
                           catchKeyPub = "";//還原
                           shunit = n.shunit;
                           
                           let CatchpubSfee3:Array<jDB.shipingAddressFee> = [];
                           let ctachBigPubSize3:Array<jDB.shipingAddressFee> = [];
                           pubSfee.forEach((val1,nu1)=>
                           {
                               if(val1.shunit >= shunit)
                               {
                                   if(CatchpubSfee3.length==0)
                                   {
                                       CatchpubSfee3.push(val1);
                                   }
                                   else if(CatchpubSfee3[0].shunit>val1.shunit)
                                   {//選最小容積
                                       CatchpubSfee3=[val1];
                                   }

                                   if(ctachBigPubSize3.length==0)
                                   {
                                       ctachBigPubSize3.push(val1);
                                   }
                                   else if(ctachBigPubSize3[0].shunit<=val1.shunit)
                                   {//選最大容積
                                       ctachBigPubSize3=[val1];
                                   }
                               }
                           });
                           if (finalCount + 1 == aryShunit.length && nu1 + 1 == Number(n.count)//為最後一筆存在容積
                           ||ctachBigPubSize3[0].shunit<= shunit+n.shunit)//已滿結算
                           {
                               
                               shunitFee += ((ctachBigPubSize[0].shunit<= shunit+n.shunit)?ctachBigPubSize3[0]:CatchpubSfee3[0]).fee;
                               getShFormat += ((ctachBigPubSize[0].shunit<= shunit+n.shunit)?ctachBigPubSize3[0]:CatchpubSfee3[0]).name+",";
                               catchKeyPub = "";//還原
                               shunit = 0;
                           }
                       }
                       else
                       {//商品容積異常
                           sizeError = true;
                       }
                   }
               }
           }
           finalCount++;
       });

       if (sizeError)
       {
          //運費運算異常
          getShFormat="";
          shunitFee=0;
       }
   }
   return {fee:shunitFee,foramt:getShFormat} as shfeeFormat;
}
/** 
 IP 限用名單
 */
export interface IPLock
{
 /** 
 * DB:主鍵 key */
 ip:string,

 /** 
 * DB:IP是否封鎖 */
 lock:boolean,

 /** 
 * DB:create date */
 date:number,

 /** 
 * DB:備註 (最後修改者) */
 mark:string,

 /** 
 * json:阻止次數 */
 preCount:number,


}

/** 
 會員帳戶
 */
export interface Member
{
 /** 
 * DB:帳戶 */
 mbid:string,

 /** 
 * json:登入使用(帳戶) */
 id:string,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:登入方式所屬 enum LoginTp */
 tp:number,

 /** 
 * DB:管理者-管理帳號(分享app分想) */
 mg:string,

 /** 
 * DB:確認綁定 */
 ck:boolean,

 /** 
 * DB:目前已綁定url 並且可使用之 auto key */
 autoAry:string,

 /** 
 * DB:利潤=單位% */
 profit:number,

 /** 
 * DB:可用點數-被使用 */
 MBCount:number,

 /** 
 * DB:目前起用點數-可歸還 */
 usCount:number,

 /** 
 * DB:支付費用時間 */
 pay:number,

 /** 
 * DB:取story權限 */
 story:boolean,

 /** 
 * DB:匿稱 */
 name:string,

 /** 
 * DB:店名更動權限 */
 store:boolean,

 /** 
 * DB:店名 */
 sname:string,

 /** 
 * DB:e-mainl 取回帳密用 */
 mail:string,

 /** 
 * DB:密碼 */
 pw:string,

 /** 
 * DB:system UID 副索引 */
 uid:string,

 /** 
 * DB:帳戶操作時間記錄 unix */
 activity:number,

 /** 
 * DB:權限 參閱 enum MBLevel */
 level:number,

 /** 
 * DB:app apns */
 token:string,

 /** 
 * DB:app 種類 */
 mobile:number,

 /** 
 * DB:備註 (最後修改者) */
 mark:string,


}

/** 
 商品折
 */
export interface ProductDiscount
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:起動 */
 display:boolean,

 /** 
 * DB:折 */
 discount:number,

 /** 
 * DB:商品 key */
 pkey:string,

 /** 
 * DB:折期間Start unix */
 start:number,

 /** 
 * DB:折期間End unix */
 end:number,

 /** 
 * DB:建置日期 unix */
 date:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 購得App
 */
export interface usApp
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:product 主鍵key */
 pkey:string,

 /** 
 * DB:所屬會員 */
 uid:string,

 /** 
 * DB:起動 */
 display:boolean,

 /** 
 * DB:已綁定個數 */
 count:number,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:建立日期 unix */
 date:number,


}

/** 
 app 功能 分享帳戶
 */
export interface usAppBindAccount
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:所屬會員 */
 uid:string,

 /** 
 * DB:建立日期 */
 date:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 商品分類庫名Title first 分類
 */
export interface ProductClassNameTitle
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:限商店 */
 store:number,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 商品分類庫名Group 二次分類
 */
export interface ProductClassName
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:限商店 */
 store:number,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:第一層 主鍵 key */
 fkey:string,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 商品套餐 options
 */
export interface ProductOptionSet
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * json:套餐 ceil 名 array */
 name:string,

 /** 
 * json:品名 list */
 nameAry:Array<string>,

 /** 
 * json:單位 array */
 unit:string,

 /** 
 * json:單位  list */
 unitAry:Array<string>,

 /** 
 * DB:所屬套餐 product key */
 pskey:string,

 /** 
 * DB:商品key */
 pkey:string,

 /** 
 * DB:被購入數設定 */
 count:number,

 /** 
 * DB:建立日期 */
 date:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 商品
 */
export interface Product
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:語系起用代號 */
 lang:string,

 /** 
 * DB:youtube iframe */
 ybe:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:推薦 order */
 giftorder:number,

 /** 
 * DB:審核代號 run=送審,''=未送審,runfail=送審失敗 */
 codekey:string,

 /** 
 * DB:商品建置帳號 */
 uid:string,

 /** 
 * DB:稅額/運費/手續費 表項顯示不列入計算 */
 fee:number,

 /** 
 * DB:單次購買數量限制 */
 countLimit:number,

 /** 
 * DB:容積單位 */
 shunit:number,

 /** 
 * DB:商品套餐開關 = true */
 set:boolean,

 /** 
 * DB:通路 Enum ProductStore */
 store:number,

 /** 
 * json:顯示分類主題 */
 pctkey:string,

 /** 
 * DB:顯示分類細項 */
 pckey:string,

 /** 
 * DB:產品庫存狀態 參閱 enum ProductType */
 type:number,

 /** 
 * DB:商品分類 */
 class:number,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:品名 array */
 name:string,

 /** 
 * json:品名 list */
 nameAry:Array<string>,

 /** 
 * json:商品圖 list */
 imgAry:Array<string>,

 /** 
 * DB:金額(單一價格) */
 cash:number,

 /** 
 * DB:單位 array */
 unit:string,

 /** 
 * json:單位 list */
 unitAry:Array<string>,

 /** 
 * DB:庫存 */
 Count:number,

 /** 
 * json:描述 list */
 descriptionAry:Array<string>,

 /** 
 * DB:審核失敗備註 */
 approve:string,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 當前付費使用者 - memory 格式
 */
export interface pay
{
 /** 
 * json:會員帳戶 uid */
 uid:string,

 /** 
 * json:使用期限 */
 paydate:number,

 /** 
 * json:會員階層 */
 level:number,

 /** 
 * json:點數 */
 count:number,


}

/** 
 寄送物品基本級距設定
 */
export interface shipingAddressFee
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:Size name */
 name:string,

 /** 
 * DB:國別 */
 country:string,

 /** 
 * DB:區域 城市 all=標準全部適用運費(國家為單位) */
 city:string,

 /** 
 * DB:容積單位 */
 shunit:number,

 /** 
 * DB:是否免運運費 true = 免運 */
 shfeecancel:boolean,

 /** 
 * DB:運費 */
 fee:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 pay 支付記錄
 */
export interface payRecord
{
 /** 
 * DB:訂單號 主鍵 key */
 key:string,

 /** 
 * DB:出貨單據 = true */
 shtp:boolean,

 /** 
 * DB:已處理單據 = true */
 ck:boolean,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:廢單=0(管理者) */
 display:number,

 /** 
 * DB:支付狀態 enum payStatus */
 status:number,

 /** 
 * DB:支付類別 for enum payType */
 type:number,

 /** 
 * DB:捐贈點 */
 gpoint:number,

 /** 
 * DB:商家贈點 */
 ppoint:number,

 /** 
 * DB:交握資訊 */
 bankMark:string,

 /** 
 * DB:是否免運運費 true = 免運 */
 shfeecancel:boolean,

 /** 
 * DB:運輸包裝name */
 sfname:string,

 /** 
 * DB:運費 */
 shfee:number,

 /** 
 * DB:寄送地址 */
 adr:boolean,

 /** 
 * DB:現場取貨 */
 adrnow:boolean,

 /** 
 * DB:實名個資 */
 pe:boolean,

 /** 
 * DB:聯絡資訊 */
 am:boolean,

 /** 
 * DB:寄送物品狀態 enump sttype */
 sttype:number,

 /** 
 * DB:交易序號/帳戶 */
 account:string,

 /** 
 * DB:銀行 enum bankSuport */
 bank:number,

 /** 
 * DB:收現 找零記錄 */
 cash:number,

 /** 
 * DB:金額 */
 amount:number,

 /** 
 * DB:套餐補差總額(記錄) */
 sfee:number,

 /** 
 * DB:手續費/稅額 */
 fee:number,

 /** 
 * DB:立單日 */
 date:number,

 /** 
 * DB:繳費期限 */
 limitDate:number,

 /** 
 * DB:訊息交握時間 */
 payDate:number,

 /** 
 * DB:活動報名稅額 */
 afee:number,

 /** 
 * DB:活動報名金額 */
 acash:number,

 /** 
 * DB:活動報名單據 */
 akey:string,

 /** 
 * DB:支付帳號 */
 uid:string,

 /** 
 * DB:user備註 */
 umark:string,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 套餐已選內容物(統計分析用)
 */
export interface PayOptionsSet
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:立單記錄-options */
 pokey:string,

 /** 
 * DB:商品 */
 pkey:string,

 /** 
 * DB:購買數量 */
 count:number,


}

/** 
 立單清單
 */
export interface PayOptions
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:稅額/手續費 */
 fee:number,

 /** 
 * DB:利潤=單位% */
 profit:number,

 /** 
 * DB:商品持有者 uid */
 uid:string,

 /** 
 * DB:商家贈點 */
 ppoint:number,

 /** 
 * DB:交握資訊 */
 bankMark:string,

 /** 
 * DB:廢單 */
 display:number,

 /** 
 * DB:金額(單品價格) */
 cash:number,

 /** 
 * DB:退款 */
 refundCash:number,

 /** 
 * DB:讓 */
 allowances:number,

 /** 
 * DB:折 */
 discount:number,

 /** 
 * DB:套餐 */
 set:boolean,

 /** 
 * DB:套餐用備註 */
 setmark:string,

 /** 
 * DB:報廢 */
 del:boolean,

 /** 
 * DB:贈 */
 gifts:boolean,

 /** 
 * DB:購買數量 */
 count:number,

 /** 
 * DB:所屬單據 */
 prkey:string,

 /** 
 * DB:單位array */
 unit:string,

 /** 
 * json:單位 list */
 unitAry:Array<string>,

 /** 
 * DB:商品 主鍵key */
 pkey:string,

 /** 
 * DB:商品名稱 array */
 name:string,

 /** 
 * json:商品名稱 list */
 nameAry:Array<string>,

 /** 
 * DB:create date unix */
 date:number,

 /** 
 * DB:套餐補差總額(記錄) */
 sfee:number,

 /** 
 * DB:套餐修改/原set 記錄(base64) */
 sdata:string,

 /** 
 * DB:容積單位 */
 shunit:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 套餐改單據使用格式
 */
export interface payItem
{
 /** 
 * json:主鍵 key */
 key:string,

 /** 
 * json:數量 */
 count:number,

 /** 
 * json:商品名稱 array */
 name:string,

 /** 
 * json:商品 name list */
 nameAry:Array<string>,

 /** 
 * json:單位 array */
 unit:string,

 /** 
 * json:單位 list */
 unitAry:Array<string>,

 /** 
 * json:金額 */
 cash:number,


}

/** 
 伴空間消息
 */
export interface Story
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:同步 活動報名 key */
 akey:string,

 /** 
 * DB:文章是否顯示 */
 display:boolean,

 /** 
 * DB:特顯色塊標題 */
 showt:boolean,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:主標題 array */
 title:string,

 /** 
 * json:主標題 list */
 titleAry:Array<string>,

 /** 
 * DB:副標題 array */
 title2:string,

 /** 
 * json:副標題 list */
 title2Ary:Array<string>,

 /** 
 * DB:語系 */
 lang:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * json:商品圖 list */
 imgAry:Array<string>,

 /** 
 * DB:照片牆模式 */
 imgwp:boolean,

 /** 
 * DB:描述 array */
 description:string,

 /** 
 * json:描述 list */
 descriptionAry:Array<string>,

 /** 
 * DB:前往url */
 url:string,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 最新消息
 */
export interface ProductDM
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:文章是否顯示 */
 display:boolean,

 /** 
 * DB:特顯大標題 */
 showt:boolean,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:主標題 array */
 title:string,

 /** 
 * json:主標題 list */
 titleAry:Array<string>,

 /** 
 * DB:副標題 array */
 title2:string,

 /** 
 * json:副標題 list */
 title2Ary:Array<string>,

 /** 
 * DB:語系 */
 lang:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * json:商品圖 list */
 imgAry:Array<string>,

 /** 
 * DB:照片牆模式 */
 imgwp:boolean,

 /** 
 * DB:描述 array */
 description:string,

 /** 
 * json:描述 list */
 descriptionAry:Array<string>,

 /** 
 * DB:前往url */
 url:string,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 新聞分類first
 */
export interface NewsClassNameTitle
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 新聞二次分類
 */
export interface NewsClassName
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:第一層 主鍵 key */
 fkey:string,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 新聞文章
 */
export interface News
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:語系起用代號 */
 lang:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * DB:審核代號 */
 codekey:string,

 /** 
 * DB:審核失敗備註 */
 approve:string,

 /** 
 * DB:之前文章 enum docType */
 btp:number,

 /** 
 * DB:之前文章 主鍵 key */
 bkey:string,

 /** 
 * DB:後續文章 主鍵 key */
 fkey:string,

 /** 
 * DB:後續文章 enum docType */
 ftp:number,

 /** 
 * DB:隱藏 */
 display:boolean,

 /** 
 * DB:標題 */
 title:string,

 /** 
 * json:title list */
 titleAry:Array<string>,

 /** 
 * DB:延申閱讀 短網址建立 array limit 9 */
 readPath:string,

 /** 
 * json:延申閱讀 短網址OR 網址引用 list */
 readPathAry:Array<markPath>,

 /** 
 * json:顯示分類first key */
 nctkey:string,

 /** 
 * DB:分類名 二次分類 key */
 nckey:string,

 /** 
 * DB:其它標籤 doc path limit 9 */
 mdoc:string,

 /** 
 * json:其它標籤 doc path limit 9 */
 mdocAry:Array<markPath>,

 /** 
 * DB:新聞內容 doc path-> format newsDoc */
 doc:string,

 /** 
 * json:新聞內容 doc path */
 docAry:Array<DocPath>,

 uid:string,

 /** 
 * DB:create 時間 */
 date:number,

 /** 
 * DB:發佈 新聞 -1=未發佈 負值為收回發佈 date=發佈時間 */
 publish:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 自動審核
 */
export interface AutoCK
{
 /** 
 * DB:被審核 uid */
 uid:string,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:管理者 uid */
 mguid:string,

 /** 
 * DB:開關 */
 ck:boolean,

 /** 
 * DB:更動日期 */
 date:number,


}

/** 
 彩踩分類first
 */
export interface NewsLClassNameTitle
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 彩踩二次分類
 */
export interface NewsLClassName
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:是否顯示 */
 display:boolean,

 /** 
 * DB:第一層 主鍵 key */
 fkey:string,

 /** 
 * DB:分類名 array */
 name:string,

 /** 
 * json:分類名 list */
 nameAry:Array<string>,

 /** 
 * DB:排序 */
 order:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 彩踩文章
 */
export interface NewsL
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:作者 */
 art:string,

 /** 
 * DB:語系起用代號 */
 lang:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * DB:審核代號 */
 codekey:string,

 /** 
 * DB:審核失敗備註 */
 approve:string,

 /** 
 * DB:之前文章 enum docType */
 btp:number,

 /** 
 * DB:之前文章 主鍵 key */
 bkey:string,

 /** 
 * DB:後續文章 主鍵 key */
 fkey:string,

 /** 
 * DB:後續文章 enum docType */
 ftp:number,

 /** 
 * DB:隱藏 */
 display:boolean,

 /** 
 * DB:標題 */
 title:string,

 /** 
 * json:title list */
 titleAry:Array<string>,

 /** 
 * DB:延申閱讀 短網址建立 array limit 9 */
 readPath:string,

 /** 
 * json:延申閱讀 短網址OR 網址引用 list */
 readPathAry:Array<markPath>,

 /** 
 * json:顯示分類first key */
 nctkey:string,

 /** 
 * DB:分類名 二次分類 key */
 nckey:string,

 /** 
 * DB:其它標籤 doc path limit 9 */
 mdoc:string,

 /** 
 * json:其它標籤 doc path limit 9 */
 mdocAry:Array<markPath>,

 /** 
 * DB:新聞內容 doc path-> format newsDoc */
 doc:string,

 /** 
 * json:新聞內容 doc path */
 docAry:Array<DocPath>,

 uid:string,

 /** 
 * DB:create 時間 */
 date:number,

 /** 
 * DB:發佈 新聞 -1=未發佈 負值為收回發佈 date=發佈時間 */
 publish:number,

 /** 
 * DB:備註 */
 mark:string,


}

/** 
 彩踩自動審核
 */
export interface AutoLCK
{
 /** 
 * DB:被審核 uid */
 uid:string,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:管理者 uid */
 mguid:string,

 /** 
 * DB:開關 */
 ck:boolean,

 /** 
 * DB:更動日期 */
 date:number,


}

/** 
 文章format
 */
export interface DocPath
{
 /** 
 * json:path:file format->DocFileFormat */
 path:string,

 /** 
 * json:youtube iframe */
 ybe:string,

 /** 
 * json:是否為 照片牆 */
 WallPaper:boolean,

 /** 
 * json:img path:file format->DocImgFileFormat */
 imgAry:Array<DocImgFileFormat>,

 /** 
 * json:img oder output file Convert to imgAry */
 img:Array<string>,


}

/** 
 文章標籤format
 */
export interface markPath
{
 /** 
 * json:前往路經 */
 path:string,

 /** 
 * json:標註名 */
 nameAry:Array<string>,

 /** 
 * json:enum docType 標籤分類 */
 tp:number,


}

/** 
 文章 img 檔案 內容 foramt
 */
export interface DocImgFileFormat
{
 /** 
 * json:出處標題/註/描述 */
 titleAry:Array<string>,

 /** 
 * json:img */
 path:string,


}

/** 
 文章 檔案段落 foramt
 */
export interface DocFileFormat
{
 /** 
 * json:標題 */
 title:string,

 /** 
 * json:文章內容 */
 content:string,


}

/** 
 監控server
 */
export interface PJEvn
{
 /** 
 * json:用途title */
 title:string,

 /** 
 * json:伺服器/API 名 */
 same:string,

 /** 
 * json:主機名 */
 name:string,

 /** 
 * json:是否起動 Thread */
 run:boolean,

 /** 
 * json:是否完成關閉 Thread */
 CloseComplete:boolean,

 /** 
 * json:能被開起 檔案數 */
 openFileVal:number,

 /** 
 * json:能被開起 執行緒總數 */
 MaxFileProcessVal:number,

 /** 
 * json:cpu 耗量 單位% */
 cpuVal:number,

 /** 
 * json:memory 耗量 單位% */
 memoryVal:number,

 /** 
 * json:cpu 核心數 每1核為100% */
 cpu:number,

 /** 
 * json:cpu product name */
 cpuModel:string,

 /** 
 * json:線程 */
 thread:number,

 /** 
 * json:記憶體(KB) */
 memoryKB:number,

 /** 
 * json:目前負載資訊 */
 uptime:Array<number>,

 /** 
 * json:偵測 狀態代碼 enum processError */
 error:number,

 /** 
 * json:資訊更新時間 */
 update:number,

 /** 
 * json:受偵聽程式 */
 process:Array<processMes>,


}

/** 
 監控app
 */
export interface processMes
{
 /** 
 * json:程式名 */
 name:string,

 /** 
 * json:cpu 耗量 單位% */
 cpu:number,

 /** 
 * json:memory 耗量 單位% */
 memory:number,

 /** 
 * json:memory 耗量 單位KB */
 memoryQ:number,

 /** 
 * json:能被開起 檔案數 */
 openFileVal:number,

 /** 
 * json:詳細資訊 */
 content:Array<string>,

 /** 
 * json:被連線數 */
 connectCount:number,

 /** 
 * json:能被開起 執行緒總數 */
 MaxFileProcessVal:number,

 /** 
 * json:指令所屬 enum processType */
 order:number,

 /** 
 * json:偵測 狀態代碼 enum processError */
 error:number,

 /** 
 * json:資訊更新時間 */
 update:number,


}

/** 
 API 監控format
 */
export interface urlCaul
{
 /** 
 * json:api path */
 url:string,

 /** 
 * json:error 計數 */
 error:number,

 /** 
 * json:request 計數 */
 count:number,

 /** 
 * json:阻擋 計數 */
 PrevCount:number,

 /** 
 * json:最後記錄時間 */
 date:number,


}

/** 
 ip proxy 進入統計
 */
export interface Proxy_mbIP
{
 /** 
 * json:IP address(proxy key [X-Forwarded-For=$proxy_add_x_forwarded_for;,X-Real-IP=$remote_addr]) */
 ip:string,

 /** 
 * json:user agent(proxy key [ User-Agent=$http_user_agent]) */
 useragent:string,

 /** 
 * json:language(proxy key [ Accept-Language=$http_accept_language]) */
 lang:string,

 /** 
 * json:version (cookie key ['psylipinfo'='version']) */
 appVersion:string,

 /** 
 * json:platform (cookie key 'psylipinfo'='platform']) */
 platform:string,

 /** 
 * json:vendor (cookie key ['psylipinfo'='vendor']) */
 vendor:string,

 /** 
 * json:create time */
 exist:number,

 /** 
 * json:被request 次數 */
 attk:number,


}

/** 
 書籤Bag
 */
export interface LabelBag
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:標籤流水號 */
 nu:number,

 uid:string,

 /** 
 * DB:標籤名 */
 name:string,

 /** 
 * DB:take 內容 */
 path:string,

 /** 
 * DB:enum docType 標籤分類 */
 tp:number,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 任務動作日誌
 */
export interface LogCk
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:log */
 log:string,

 /** 
 * DB:任務動作enum logTp */
 level:number,

 /** 
 * DB:任務指向enum logDocTB */
 tb:number,

 /** 
 * DB:更動參數 */
 val:string,

 /** 
 * DB:被調整審核狀態 */
 ck:boolean,

 /** 
 * DB:刪除任務 */
 del:boolean,

 /** 
 * DB:審核確立 */
 tag:boolean,

 /** 
 * DB:審核帳戶 */
 mbid:string,

 /** 
 * DB:任務指向ID */
 id:string,

 /** 
 * DB:審核日期 */
 ckdate:number,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 實名個資
 */
export interface Personal
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:身份識別碼 */
 id:string,

 /** 
 * DB:性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:實名 */
 name:string,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,

 /** 
 * DB:生日 */
 birthday:number,


}

/** 
 聯絡資訊
 */
export interface AMes
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:聯絡人 */
 name:string,

 /** 
 * DB:稱謂 */
 title:string,

 /** 
 * DB:gender 性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,


}

/** 
 寄送城址
 */
export interface Address
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:收貨人 */
 name:string,

 /** 
 * DB:gender 性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,

 /** 
 * DB:國家 */
 country:string,

 /** 
 * DB:城市 */
 city:string,

 /** 
 * DB:區域 */
 area:string,

 /** 
 * DB:區_號 */
 zip:string,

 /** 
 * DB:詳細地址 */
 address:string,

 /** 
 * DB:寄送時段 enum DeliveryTime */
 dtime:number,


}

/** 
 活動報名系統
 */
export interface ActivityIn
{
 /** 
 * DB:主鍵 key */
 key:string,

 /** 
 * DB:youtube iframe */
 ybe:string,

 /** 
 * DB:運費折抵 */
 shfee:number,

 /** 
 * DB:起動 */
 display:boolean,

 /** 
 * DB:寄送地址-功能 */
 adrCk:boolean,

 /** 
 * DB:實名個資-功能 */
 peCK:boolean,

 /** 
 * DB:聯絡資訊-功能 */
 amCK:boolean,

 /** 
 * DB:開通功能 */
 appck:boolean,

 /** 
 * DB:稅額/運費/手續費 表項顯示不列入計算 */
 fee:number,

 /** 
 * DB:語系起用代號 */
 lang:string,

 /** 
 * json:語系起用 list */
 langAry:Array<number>,

 /** 
 * DB:title array */
 title:string,

 /** 
 * json:title list */
 titleAry:Array<string>,

 /** 
 * json:活動圖 list */
 imgAry:Array<string>,

 /** 
 * json:商品 list */
 pAry:Array<string>,

 /** 
 * DB:活動費 */
 cash:number,

 /** 
 * DB:限額 */
 count:number,

 /** 
 * json:簡章 list */
 descriptionAry:Array<string>,

 /** 
 * DB:最小年齡限制 */
 ageM:number,

 /** 
 * DB:最大年齡限制 */
 ageX:number,

 /** 
 * DB:活動時間 */
 indate:number,

 /** 
 * DB:報名時間開始 */
 stdate:number,

 /** 
 * DB:報名時間結束 */
 edate:number,

 /** 
 * DB:備註 */
 mark:string,

 /** 
 * DB:日期 */
 date:number,


}

/** 
 單據-實名個資
 */
export interface PRPersonal
{
 /** 
 * DB:訂單號 主鍵 key */
 key:string,

 /** 
 * DB:身份識別碼 */
 id:string,

 /** 
 * DB:gender 性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:實名 */
 name:string,

 /** 
 * DB:生日 */
 birthday:number,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,


}

/** 
 單據-聯絡資訊
 */
export interface PRAMes
{
 /** 
 * DB:訂單號 主鍵 key */
 key:string,

 /** 
 * DB:聯絡人 */
 name:string,

 /** 
 * DB:稱謂 */
 title:string,

 /** 
 * DB:gender 性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,


}

/** 
 單據-寄送城址
 */
export interface PRAddress
{
 /** 
 * DB:訂單號 主鍵 key */
 key:string,

 /** 
 * DB:收貨人 */
 name:string,

 /** 
 * DB:gender 性別  0=女,1=男 */
 gender:number,

 /** 
 * DB:mobile 手機 */
 phone:string,

 /** 
 * DB:市話 */
 tel:string,

 /** 
 * DB:國家 */
 country:string,

 /** 
 * DB:城市 */
 city:string,

 /** 
 * DB:區域 */
 area:string,

 /** 
 * DB:區_號 */
 zip:string,

 /** 
 * DB:詳細地址 */
 address:string,

 /** 
 * DB:寄送時段 enum DeliveryTime */
 dtime:number,


}



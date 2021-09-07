/** 
 推薦
 */
export enum Enum_giftOptin
{
 /** 
 推薦 */
 only=1,

 /** 
 一般商品 */
 not=2,

 /** 
 推薦+一般商品 */
 gift=3,


}

/** 
 推薦
 */
export const Enum_view_giftOptin = (key:string)=>
{

  switch(key){
   case "only":
    return "['推薦商品','Recommend']";

   case "not":
    return "['一般商品','Normal Product']";

   case "gift":
    return "['全部商品','All Product']";


  }
  return 'null'
}

/** 
 支付類別
 */
export enum Enum_payType
{
 /** 
 銀行/現金轉帳 */
 bank=0,

 /** 
 信用卡 */
 directCare=1,

 /** 
 管理者 支付 */
 MG=2,

 /** 
 電商支付 */
 online=3,

 /** 
 超商 */
 store=4,

 /** 
 付現 */
 pay=5,

 /** 
 退款 */
 refund=6,


}

/** 
 支付類別
 */
export const Enum_view_payType = (key:string)=>
{

  switch(key){
   case "bank":
    return "['銀行/現金:轉帳','Bank/Cash:transfer']";

   case "directCare":
    return "['信用卡','Credit card']";

   case "MG":
    return "['後台','SYS GM']";

   case "online":
    return "['電商支付','E-commerce payment']";

   case "store":
    return "['超商','Store']";

   case "pay":
    return "['付現','Pay cash']";

   case "refund":
    return "['退款','Refund']";


  }
  return 'null'
}

/** 
 支付狀態
 */
export enum Enum_payStatus
{
 /** 
 成立單據 */
 create=0,

 /** 
 處理中 */
 wait=1,

 /** 
 完成交易 */
 complete=2,

 /** 
 完成退款-(client) */
 ReturnComplete=-5,

 /** 
 申請退款-(client) */
 Return=-4,

 /** 
 繳費時間已到期 */
 datelimit=-3,

 /** 
 取消-(client) */
 cancel=-2,

 /** 
 交易失敗 */
 fail=-1,


}

/** 
 支付狀態
 */
export const Enum_view_payStatus = (key:string)=>
{

  switch(key){
   case "create":
    return "['未交易','Unpaid']";

   case "wait":
    return "['驗證款項中','Dealing']";

   case "complete":
    return "['完成交易','Paid']";

   case "ReturnComplete":
    return "['完成退款','Refunded']";

   case "Return":
    return "['申請退款','Apply for refund']";

   case "datelimit":
    return "['已超過繳費時間','Be expired']";

   case "cancel":
    return "['取消','Cancel']";

   case "fail":
    return "['交易失敗','Payment failed']";


  }
  return 'null'
}

/** 
 寄送處理狀態
 */
export enum Enum_sttype
{
 /** 
 等候 */
 create=0,

 /** 
 處理中 */
 wait=1,

 /** 
 已寄送 */
 send=2,

 /** 
 取消寄送 */
 cancel=-1,


}

/** 
 寄送處理狀態
 */
export const Enum_view_sttype = (key:string)=>
{

  switch(key){
   case "create":
    return "['等候','Wait']";

   case "wait":
    return "['處理中','Dealing']";

   case "send":
    return "['已寄送','Send']";

   case "cancel":
    return "['取消','Cancel']";


  }
  return 'null'
}

/** 
 開放權限 通貨設定
 */
export enum Enum_ProductStore
{
 /** 
 僅限post system */
 store=0,

 /** 
 僅限 購物車 */
 line=1,

 /** 
 都存在 */
 all=2,


}

/** 
 開放權限 通貨設定
 */
export const Enum_view_ProductStore = (key:string)=>
{

  switch(key){
   case "store":
    return "['門市','only store']";

   case "line":
    return "['線上','only online']";

   case "all":
    return "['供貨','for us']";


  }
  return 'null'
}

/** 
 產品庫存屬性 分類
 */
export enum Enum_ProductClass
{
 /** 
 庫存無限制-系統生成類(必需消費商品) */
 app=0,

 /** 
 虛疑商品 */
 pApp=1,

 /** 
 實體商品 */
 product=2,


}

/** 
 產品庫存屬性 分類
 */
export const Enum_view_ProductClass = (key:string)=>
{

  switch(key){
   case "app":
    return "['APP點數','App cash']";

   case "pApp":
    return "['虛疑商品','Virtual']";

   case "product":
    return "['實體商品','Entity']";


  }
  return 'null'
}

/** 
 產品庫存屬性 TYPE
 */
export enum Enum_ProductType
{
 /** 
 庫存無限制 */
 NotLimit=0,

 /** 
 有限庫存 */
 Limit=1,

 /** 
 產品停用-庫存有限 */
 StopLimit=-2,

 /** 
 產品停用-庫存無限制 */
 StopNotLimit=-1,


}

/** 
 產品庫存屬性 TYPE
 */
export const Enum_view_ProductType = (key:string)=>
{

  switch(key){
   case "NotLimit":
    return "['無限','Inventory']";

   case "Limit":
    return "['有限','Limit Inventory']";

   case "StopLimit":
    return "['Vis-有限','Vis Limit Inventory']";

   case "StopNotLimit":
    return "['Vis-無限','Vis Inventory']";


  }
  return 'null'
}

/** 
 帳戶token所屬
 */
export enum Enum_mbidTokenType
{
 mobile=0,

 web=1,

 appToWeb=2,

 empty=-1,


}

/** 
 錯誤代號
 */
export enum Enum_SystemErrorCode
{
 /** 
 等候 */
 wait=0,

 /** 
 無驗證 */
 NotVerify=1,

 /** 
 無error */
 Null=1,

 /** 
 商品容積異常 */
 prdocutSizeError=-125,

 /** 
 上級驗證 */
 MGError=-124,

 /** 
 無時間使用權限 */
 paytimeError=-123,

 /** 
 無app點數 */
 notpointError=-122,

 /** 
 檔案損毀 */
 fileForamtError=-121,

 /** 
 維護中 */
 repairError=-120,

 /** 
 回傳格式異常 */
 responseError=-119,

 /** 
 站台線路異常 */
 errorLine=-118,

 /** 
 不存在扣除帳戶數 */
 notExistCount=-117,

 /** 
 品項 被使用 */
 prdocutUS=-116,

 /** 
 不存在app */
 notExistApp=-115,

 /** 
 function error */
 Func=-114,

 /** 
 輪入格式錯誤 */
 inputFormat=-113,

 /** 
 驗簽異常 */
 VerifyError=-112,

 /** 
 開單據失敗 */
 payFormFail=-111,

 /** 
 品項 不存在 */
 prdocutNotExist=-110,

 /** 
 偽裝attack */
 xsf=-109,

 /** 
 已存在data */
 ExistData=-108,

 /** 
 不存在帳號 、ID、key */
 notExistID=-107,

 /** 
 是否存在cookie */
 webNotCookies=-106,

 /** 
 權限不足 */
 limit=-105,

 /** 
 已被禁用 */
 NotLevel=-104,

 /** 
 Token Time out */
 Verify=-103,

 /** 
 防(token)多登入 token timeout(與當前DB不符)  */
 timeout=-102,

 /** 
 多登錯誤(已被後來登入所取代) */
 existlogin=-101,

 /** 
 失敗 */
 fail=-1,


}

/** 
 會員權限
 */
export enum Enum_MBLevel
{
 /** 
 一般使用者 */
 normal=0,

 /** 
 自由人 */
 pay=1,

 /** 
 公民店家 */
 MG=2,

 /** 
 系統管理者 */
 systemMG=3,

 /** 
 公民記者 */
 RG=5,

 /** 
 編緝者 */
 Edit=6,

 /** 
 cheif系統管理者 */
 superSystemMG=9,

 /** 
 停權編緝者 */
 StopEdit=-6,

 /** 
 停權公民記者 */
 StopRG=-5,

 /** 
 停權系統管理者 */
 StopSystemMG=-4,

 /** 
 停權店主 */
 StopMG=-3,

 /** 
 停權自由人 */
 StopPay=-2,

 /** 
 停權一般使用者 */
 StopNormal=-1,


}

/** 
 會員權限
 */
export const Enum_view_MBLevel = (key:string)=>
{

  switch(key){
   case "normal":
    return "['一般','Normal']";

   case "pay":
    return "['自由','Free']";

   case "MG":
    return "['公民店家','Store']";

   case "systemMG":
    return "['系統管理者','sys GM']";

   case "RG":
    return "['公民記者','Reporter']";

   case "Edit":
    return "['編緝','Editer']";

   case "superSystemMG":
    return "['cheif','chiefGM']";

   case "StopEdit":
    return "['停權edit','Disable Edit']";

   case "StopRG":
    return "['停權Reporter','Disable RG']";

   case "StopSystemMG":
    return "['停權系統管理者','Disable Sys MG']";

   case "StopMG":
    return "['停權店主','Disable store']";

   case "StopPay":
    return "['停權Free','Disable Free']";

   case "StopNormal":
    return "['停權一般','Disable Normal']";


  }
  return 'null'
}

/** 
 文章標籤分類
 */
export enum Enum_docType
{
 /** 
 新聞媒體-DB */
 News=0,

 /** 
 超連結 */
 url=1,

 /** 
 Story-DB */
 Story=2,

 /** 
 Product-DB */
 Product=3,

 /** 
 採踩地方-DB */
 Newscc=4,

 /** 
 伴空間活動-DB */
 Ativity=5,

 /** 
 商城-DB */
 pcar=6,


}

/** 
 文章標籤分類
 */
export const Enum_view_docType = (key:string)=>
{

  switch(key){
   case "News":
    return "['新聞媒體','News']";

   case "url":
    return "['超連結','Url']";

   case "Story":
    return "['伴空間訊息','伴Space']";

   case "Product":
    return "['最新消息','Hot News']";

   case "Newscc":
    return "['採踩地方','採踩News']";

   case "Ativity":
    return "['伴空間活動','伴Activity']";

   case "pcar":
    return "['合秝市集','Ho li Bazaar']";


  }
  return 'null'
}

/** 
 文章延讀或上下篇
 */
export enum Enum_docNextPre
{
 /** 
 資料正常 */
 data=0,

 /** 
 關閉權限-二次分類 */
 notnc=1,

 /** 
 關閉權限-first次分類 */
 notnct=2,

 /** 
 無限限閱讀文章 */
 notdata=3,


}

/** 
 監控程式App狀態
 */
export enum Enum_processType
{
 /** 
 Database */
 DB=0,

 /** 
 application */
 app=1,

 /** 
 web servies */
 servies=2,

 /** 
 Server VM */
 VM=3,


}

/** 
 監控程式異常code
 */
export enum Enum_processError
{
 /** 
 解析format error */
 format=0,

 /** 
 無異常 */
 ok=1,

 /** 
 未起動 */
 close=-2,

 /** 
 無法連線 */
 notcon=-1,


}

/** 
 任務日誌分級
 */
export enum Enum_logTp
{
 /** 
 編緝者修正 */
 repar=0,

 /** 
 系統管理者審核編緝者修正 */
 sys=1,

 /** 
 系統管理者修正 */
 sysRepar=2,

 /** 
 系統管理者調整 */
 sysModify=3,

 /** 
 會員修正 */
 mb=-1,


}

/** 
 任務日誌目標TB
 */
export enum Enum_logDocTB
{
 /** 
 會員 */
 Member=0,

 /** 
 採踩地方 */
 NewsL=1,

 /** 
 採踩地方自動審核 */
 AutoLCK=2,

 /** 
 商品 */
 Product=3,

 /** 
 訂單單據 */
 payRecord=4,

 /** 
 活動報名 */
 Activity=5,

 /** 
 運費級距 */
 sff=6,

 /** 
 會員申請身份 */
 MemberApply=-1,


}

/** 
 支付商家
 */
export enum Enum_bankSuport
{
 /** 
 LinePay */
 linePay=0,

 /** 
 client */
 client=1,

 /** 
 app */
 app=2,

 /** 
 台新帳簿 */
 tsbTo=3,

 /** 
 admin */
 admin=-1,


}

/** 
 支付商家
 */
export const Enum_view_bankSuport = (key:string)=>
{

  switch(key){
   case "linePay":
    return "Line Pay";

   case "client":
    return "Client";

   case "app":
    return "App Point";

   case "tsbTo":
    return "台新銀行";

   case "admin":
    return "Admin";


  }
  return 'null'
}

/** 
 登入方式代號
 */
export enum Enum_LoginTp
{
 /** 
 本機系統 */
 sys=0,

 /** 
 Line 登入 */
 lineid=1,

 /** 
 Facebook 登入 */
 fbid=2,

 /** 
 Google 登入 */
 gid=3,
 /** 
 github 登入 */
 github = 4
}

/** 
 配送時段
 */
export enum Enum_DeliveryTime
{
 /** 
 上午 */
 Morning=0,

 /** 
 下午 */
 Afternoo=1,

 /** 
 不指定 */
 not=2,


}

/** 
 配送時段
 */
export const Enum_view_DeliveryTime = (key:string)=>
{

  switch(key){
   case "Morning":
    return "['上午','Morning']";

   case "Afternoo":
    return "['下午','Afternoon']";

   case "not":
    return "['不指定','Not specify']";


  }
  return 'null'
}



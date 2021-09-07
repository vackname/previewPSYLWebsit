import * as jDB from "../../../JsonInterface/db";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** 真實個資 */
export interface perCtr extends jDB.Personal
{
    /** input 個資生日年 */
    inputY:number,
    /** input 個資生日月 */
    inputM:number,
    /** input 個資生日日 */
    inputD:number,
    /** 個資生日 年 */
    runYear:Array<number>,
    /** 個資生日月 */
    runMonth:Array<number>,
    /** 個資生日 區間 今年月份 1~12 day create date container us */
    runMonthDayMax:Array<number>,
    /** 個資生日 日號  */
    runMonthDay:Array<number>,
}

/** 修改輸入欄位 */
export interface mbditInput extends jDB.Member
{
    /** 密碼 */
    pw:string,
    /** 密碼輸入驗證 */
    repassword:string,
    /** 語系簡述 */
    storyData:{[nameKey:string]:string},
    /** 照片容器 */
    objImg:jObjM,
    photo:Array<string>
    /** 是否已更動資料 */
    update:boolean,
    /** file 匯流檔 */
    imgfile:any,
    /** 圖片上傳格式 */
    imgfileAry:Array<pub.imgFileObj>,
}

/** 銀行資訊修改輸入欄位 */
export interface bankInput
{
    /** 照片容器 */
    objImg:jObjM,
    photo:Array<string>
    /** 是否已更動資料 */
    update:boolean,
    /** file 匯流檔 */
    imgfile:any,
    /** 圖片上傳格式 */
    imgfileAry:Array<pub.imgFileObj>,
}

/** view 錯誤提示 */
interface inputError
{
    /** 舊密碼錯誤提示 */
    pw:number|-1,
     /** 新登入密碼*/
    pw2:number|-1,
    /** 新登入密碼輸入驗證 */
    repassword:number|-1,
    /** 登入密碼(修改密碼)*/
    pw3:number|-1,
    /** e-main 錯誤提示 */
    mail:number|-1,
}

/** 帳戶資訊修改樣版 */
export interface mbditTemp
{
    /** 銀行資訊 */
    BankInput:bankInput,
    /** 申請會員權限 等級 */
    apply:number,
    /** 個資資料序列 */
    perData:perCtr,
    /** 舊密碼(修改密碼) */
    pw2:string,
    /** 密碼(修改資訊密碼) */
    pw:string,
    /** 帳戶資訊修改欄位 */
    input:mbditInput,
    /** 處理中 提示(完成=true)(OR 使用於get set 重新觸發 mbditInput data) */
    load:boolean,
    /** 是否已載入 圖片 false=正在載入 */
    imgload:boolean,
    /** 驗證密碼修改是否有誤 有誤=false */
    AllCKpw:boolean,
    /** 是否驗證無誤 有誤=false */
    AllCK:boolean,
    /** 錯誤提示 */
    ckType:inputError
    mainTemp:pub.mainTemp,
    main:pub.main,
    /** about me當前已載入語系 */
    langLoad:Array<string>,
    /** 載入語系 */
    lang:jObjM,
}
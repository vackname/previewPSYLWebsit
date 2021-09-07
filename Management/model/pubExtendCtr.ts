import * as jDB from "../../JsonInterface/db";
import {jObj as jObjM} from "../../models/Jobj/interface";
import * as pub from "../../JsonInterface/pub";

/** 活動報名 */
export interface acCtr extends jDB.ActivityIn
{
    /** video youtube url input */
    ybeInput:string,
    /** 加購商品 */
    pdataAry:Array<pub.productCar>,
    /** 加購商品圖片儲存容器 */
    productImg:jObjM,
    /** 現場取貨-樣本功能取用 */
    adrnow:boolean,

    /** 費用相關設定 */
    feePanel:boolean,

    /** 編緝模式 */
    openEdit:boolean,

    /** Banner choose 是否顯示控製器設定 */
    imgPanel:boolean,

    /** 報名資訊填寫設定是否顯示 */
    runPanel:boolean,
    /** 加購商品設定是否顯示 */
    pdPanel:boolean,
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
    /** 儲存已知下載語系   */
    langLoad:Array<string>,

    /** Time choose 是否顯示控製器設定 */
    timePanel:boolean,

    /** input 活動年 */
    inputY:number,
    /** input 活動月 */
    inputM:number,
    /** input 活動日 */
    inputD:number,
    /** input 活動日 */
    inputH:number,

    /** input 報名A年 */
    inputAT_YA:number,
    /** input 報名A月 */
    inputAT_MA:number,
    /** input 報名A日 */
    inputAT_DA:number,
    /** input 報名A時 */
    inputAT_HA:number,

    /** input 報名B年 */
    inputAT_YB:number,
    /** input 報名B月 */
    inputAT_MB:number,
    /** input 報名B日 */
    inputAT_DB:number,
    /** input 報名A時 */
    inputAT_HB:number,

    /** 活動 年 */
    runYear:Array<number>,
    /** 活動 月 */
    runMonth:Array<number>,
    /** 活動 區間 今年月份 1~12 day create date container us */
    runMonthDayMax:Array<number>,
    /** 活動 日號  */
    runMonthDay:Array<number>,
    /** 報名 區間 今年 年份及之後 create date container us */
    atYear:Array<number>,
    /**  報名 區間 月[時間區段A 時間區段B] */
    atMonth:Array<Array<number>>,
    /**  報名 區間 今年月份 1~12 day create date container us    每個月份日[時間區段A 時間區段B] */
    atMonthDayMax:Array<Array<number>>,
    /**   報名 區間 日[時間區段A 時間區段B] ex:[[結束日號,開始日號],[結束日號,開始日號]] */
    atMonthDay:Array<Array<number>>,
};

/** 商品 */
export interface pCtr extends jDB.Product
{
    /** video youtube url input */
    ybeInput:string,
    /** 有限/無限庫存選擇器  */
    typeCtr:number,
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
    /** 已載入語系 */
    langLoad:Array<string>,
};


/** Member-個資 */
export interface perCtr extends jDB.Personal
{
    /** 銀行資訊img儲存容器 */
    objImg:jObjM,
    /** 銀行資訊img */
    BankPhoto:Array<string>,
}

/** Member */
export interface mbCtr extends jDB.Member
{
    /** 個資 */
    per:perCtr,
    /** show 個資 */
    openPer:boolean,
}
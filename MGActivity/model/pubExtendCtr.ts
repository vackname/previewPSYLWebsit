
import * as jDB from "../../JsonInterface/db";
import * as pub from "../../JsonInterface/pub";
import {jObj as jObjM} from "../../models/Jobj/interface";
/** Qrcode model */
import QRCodeM from "../../models/qrcode/interface";

/** 活動報名 */
export interface acCtr extends jDB.ActivityIn
{
    /** 加購商品 */
    pdataAry:Array<pub.productCar>,
    /** 加購商品圖片儲存容器 */
    productImg:jObjM,
    /** 圖片儲存容器 */
    objImg:jObjM,
    /** 儲存已知下載語系   */
    langLoad:Array<number>,
    /** 其它備註 */
    usermark:string,
    /** 現場取貨 */
    adrnow:boolean,
    /** QRCode img 載入 */
    QR:QRCodeM|null
};

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
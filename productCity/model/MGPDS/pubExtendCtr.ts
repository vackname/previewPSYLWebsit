import * as jDB from "../../../JsonInterface/db";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import * as pub from "../../../JsonInterface/pub";

/** 商品-編緝使用 */
export interface pCtr extends jDB.Product
{
    /** video youtube url input */
    ybeInput:string,
    /** 折數資訊暫存 */
    discountAry:Array<jDB.ProductDiscount>,
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

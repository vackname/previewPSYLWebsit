import * as jDB from "../../JsonInterface/db";


/** 套餐項目設定 format  ex:extend:add:[[set1],[set2]] */
export interface pSetFormat
{
    /** 新加入項目 */
    add:Array<Array<jDB.payItem>>,
    /** 刪除項目 */
    del:Array<Array<jDB.payItem>>,
    /** 原有項目 */
    old:Array<Array<jDB.payItem>>
}

/** 選入商品 */
export interface poCtr extends jDB.PayOptions
{
    /** 折數資訊暫存 */
    discountAry:Array<jDB.ProductDiscount>,
    /** 套餐項目設定 format  ex:extend:add:[[set1],[set2]] */
    setdata:pSetFormat,
}

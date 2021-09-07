self.data = {
     history:[],
     closeDay:"",//結帳日
     year:"1970",//年份開始查詢
     YearInput:"-1",//年份選擇器
     MonthInput:"-1",//結帳日 for 月份選擇器
     InputSer:"",//搜尋關鍵字
     statusInput:"999",//選擇單據狀態
     typeInput:"999",//一般單據 OR 後台廢單
     input:{
        YearInput:"-1",//年份選擇器
        MonthInput:"-1",//結帳日 for 月份選擇器
        InputSer:"",//搜尋關鍵字
        statusInput:"999",//選擇單據狀態
        typeInput:"999",//一般單據 OR 後台廢單
     },
     sumObjCash:[],//收入結帳日支付分類總額運算
     sumCash:0,//收入總額
     getTypeCount:[],//收入結帳狀態 group
     ShmentSumObjCash:[],//進貨結帳日支付分類總額運算
     SHSumCash:0,//進貨總額
     getSHTypeCount:[],//進貨結帳狀態 group
     NotShmentSumObjCash:[],//進貨未結帳狀態 group
     NotSHSumCash:0,//進貨未結帳總額
};

self.tsc=["model/MGPDtsc"];
self.completed = function($t,tscAry)
{
     $t["$m"] = tscAry[0];
};
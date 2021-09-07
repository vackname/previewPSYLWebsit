self.data = {
    dataList:[],//商品
    discountList:[],//折扣
    productcs:[],//顯示商品分類名list edit us
    productcsSec:[],//顯示商品細項 select input
};

self.tsc=["model/index"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    $t.$m.main.productClass();//first 分類-初始化
};
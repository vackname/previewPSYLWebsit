//data bind (self.data)
self.data = {
        serTool:{//搜尋工具
                productcs:[],//顯示商品分類名list
                ser:"",//關鍵字搜尋-搜尋條件
                selfclassmain:"333",//顯示商品名細大分類-搜尋條件
                productcs:[],//顯示商品分類名list
                selfclass:"999",//顯示商品項目分類名細-搜尋條件
                productcsSec:[],//顯示商品項目分類名細 array
                filter:false,//套餐=true-搜尋條件
                gift:3,//推薦模式-搜尋條件
                giftList:[],//推薦 select list
                peclass:2,//商品所屬(實體、app life、虛擬)
                ptypeclassList:{
                        t:[],//庫存所屬
                        c:[]//商品所屬
                },//商品所屬分類
        },
        product:{//商品選擇工具
           list:[],//商品list
           chooseList:[],
           Documents:null,//單據-結帳後
           page:0,
           dataCount:0,//資料庫資料總筆數-回填 serTool us
        },
        SetProduct:{//套餐商品選擇工具
                list:[],//商品list
                chooseList:[],
                page:0,
                dataCount:0,//資料庫資料總筆數-回填 serTool us
             },
};

self.tsc = ["model/postSysFromtsc"];//typescript model import

self.completed = function($t,tscAry){
        $t.$m = tscAry[0];
};

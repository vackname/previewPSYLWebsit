this.vue = {
    data:{
        load:false,//api ajax load type
        giftModel:false,//切換推薦設定或搜尋模式
        serinput:"",//search add options
        pageNu:0,//目前分頁
        pageCount:0,//分頁總數
        setOptions:[],//套餐設定list
        dataList:[],//已設定推薦
//----------↓已設定推薦
        productcsSec:[],//顯示商品細項 select input
        productClassList:[],//所屬類別 list
        pageNuSet:0,//已設定推薦目前分頁
        pageCountSet:0,//已設定推薦分頁總數
        selfclassmain:"333",//顯示商品類別
        selfclass:"999",//顯示商品細項
        InputSer:"",//搜尋關鍵字
        InputClass:"999",//所屬產品類別
        input:{
             selfclassmain:"333",//顯示商品類別
             selfclass:"999",//顯示商品細項
             InputSer:"",//搜尋關鍵字
             InputClass:"999",//所屬產品類別
        }
    },
    watch:{
        selfclassmain:function(value){
            var _this=this;
            _this.selfclass = "999";
            _this.main$m.$m.main.selfCatchClass(value,function(e){
                _this.productcsSec = [];
                _this.productcsSec = e;
            });
        }
    },
    init:function($t,$temp){
       $t.main$m.$m.gt.setOptions(true);
    },
    temp:function($t){ 
        return {

            }
    },
    methods:{
        nowRemoveCount:function()
        {//目前已排除count- 搜尋新增模式
            var setCountRemove = 0;
            this.setOptions.forEach(function(val,nu){
                if(!val.us)
                {
                    setCountRemove++;
                }
            });
            return setCountRemove;
        }
    }
};

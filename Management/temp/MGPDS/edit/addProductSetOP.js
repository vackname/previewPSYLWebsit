this.vue = {
    data:{
        key:"",//目前Pkey
        load:false,//api ajax load type
        addModel:false,//切換 add view
        serinput:"",//search add options
        pageNu:0,//目前分頁
        pageCount:0,//分頁總數
        setOptions:[],//套餐設定list
        dataList:[],//已設定套餐設定
    },
    init:function($t,$temp){

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

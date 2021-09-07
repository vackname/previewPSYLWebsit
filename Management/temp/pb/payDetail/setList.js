this.vue = {
    data:{
       open:false,//show view
       chooseNu:-1,//組別
       obj:{nameAry:[],count:0,sdata:{old:[],del:[],add:[]}},//商品套餐主要框架
    },
    init:function($t,$temp){

    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        close:function()
        {//關閉套餐 list
            this.open = false;
            this.chooseNu = -1;
            this.obj = null;
            this.obj = {nameAry:[],count:0,sdata:{old:[],del:[],add:[]}};
        },
        getOldList:function()
        {//排除{old}=0之商品
            var getRow = [];
            this.obj.sdata.old[this.chooseNu].forEach(function(val,nu){
                if(val.count>0)
                {
                    getRow.push(val);
                } 
            });
            return getRow;
        },
        getLang:function(str)
        {//語系設定取得
            return this.main$m.lang.get(str);
        }
    }
};

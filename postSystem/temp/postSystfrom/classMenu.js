this.vue = {
    data:{
        secPanel:false,//切換分類(false=first,true=sec)                       
    },
    watch:{
        "data.selfclassmain":function(value){
            var _this=this;
            _this.data.selfclass = "999";
            this.main$m.$m.ser.selfCatchClass(value,function(e)
            {
                _this.data.productcsSec = [];
                _this.data.productcsSec = e;
            });
        }
    },
    init:function($t,$temp){
        $t.main$m.$m.ser.classFirstList();//類別放入
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
        getLang:function(str)
        {
            return this.main$m.getLang(str);
        },
        chooseFirst:function(val)
        {//選擇first 類別
            this.data.selfclassmain = val;
            if(this.data.selfclassmain!="333")
            {
                this.secPanel=true;//前往第二選類
            }
            else
            {
                this.main$m.$m.ser.productListGet(true);//搜尋
            }
        },
        chooseSec:function(val)
        {//選擇二次分類
            this.data.selfclass = val;
            this.main$m.$m.ser.productListGet(true);//搜尋
        }
    }
};

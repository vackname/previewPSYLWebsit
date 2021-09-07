this.vue = {
    data:{
       adr:{
        country:"TW",
        city:"all",
        shfeecancel:"0",
       },
       ser:"",//搜尋
       list:[],//data
       adrLoad:null,//住址選擇器載入
    },
    init:function($t,$temp){
        $t.adrLoad = new Jobj();
        $t.adrChoose();
    },
    temp:function($t){
        return {

            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        adrChoose:function()
        {//載入住址選擇器
            var _this=this;
            this.adrLoad.load("Address."+this.adr.country,function(e)
            {//初始化
                _this.adr.city = "all";
            });
        },
    }
};

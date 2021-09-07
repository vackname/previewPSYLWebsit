this.vue = {
    data:{
        selfclassmain:"333",//顯示類別
        selfclass:"999",//顯示細項
        InputSer:"",//搜尋關鍵字
        newsctcsSec:[],//顯示細項 select input
    },
    watch:{
        selfclassmain:function(value){
            var _this=this;
            _this.selfclass = "999";
            _this.main$m.$m.main.selfCatchClass(value,function(e){
                _this.newsctcsSec = [];
                _this.newsctcsSec = e;
            });
        }
    },
    init:function($t,$temp){

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

    }
};

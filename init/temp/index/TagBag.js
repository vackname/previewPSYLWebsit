this.vue = {
    data:{
                                    
    },
    init:function($t,$temp)
    {

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
        {//關閉view
            this.mainTemp.showTagBag=false;
            this.mainTemp.NuView=this.mainTemp.gotoPageHistory;
        },
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
    }
};

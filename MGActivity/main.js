this.vue = {
    data:{
        VueName:"",
        toPay:false,//前往報名結帳
        key:"",//前往報名key-單載使用
        OutInto:false,//外部連動Page = true
        indexGoto:false,//經由此project 進入報名結帳
        lang:null,
    },
    init:function($t,$temp)
    {
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("Activity."+$t.main.pub.lang,function(e)
            {
            });
        }
        $t.main.pub.langEventAddFunc("Activity",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
        $t.VueName="";// 入口AcVue
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            AcVue:$t.import("@view/index").exportVue({//活動報名首頁-伴空間
                lang:$t.lang,
                pj:$t,
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            AcPayVue:$t.import("@view/pay").exportVue({//活動報名首頁-伴空間
                lang:$t.lang,
                pj:$t,
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp})
        };
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {
      
    },
    methods:{

    }
};
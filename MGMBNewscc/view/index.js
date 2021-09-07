this.vue = {
    data:{
        MonthAry:["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
        colorBG:["#AA7700","#BBBB00","#00AAAA","#0000AA","#227700","#FFBB00","#5599FF","#9955FF","#FF7744","#CCBBFF","#BB5500","#770077","#FFB7DD","#FFDDAA","#99FF99","#880000"],//月份顏色
        newsopenSearch:false,//搜尋功能列顯示-news
        load:true,
    },
    tsc:["animateModel/News"],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        $t.$an = tscAry[0];
        $temp();
    },
    init:function($t,$temp)
    {
        importLoad.m.js["qrcode"](function(e)
        {////載入Qrcode Model

        });
    },
    temp:function($t){ 
        return {
            toolvue:$t.import("@temp/index/tool")//文章搜尋 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            Newsvue:$t.import("@temp/index/index")//文章document
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            mbPreview:$t.import("turnweb@temp/indexPage/pub/mbPreview")//文章作者preview
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            })
        }
    },
    methods:{
        getLangcc:function(str)
        {//語系設定取得
            return this.langcc.get(str);
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        }
    }
};
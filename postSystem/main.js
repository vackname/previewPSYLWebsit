this.vue = {
    data:{
        historyModel:false,//開起歷史訂單搜尋
        lang:null,//post system lang
        langLoadComplete:false,//這系載入完成($temp 取用)
    },
    init:function($t,$temp){
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("postsystem."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete = true;
            });
        }
        $t.main.pub.langEventAddFunc("postsystem",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
        function loadLangCompleteFun()
        {//等候完整載入
            setTimeout(function()
            {
                if($t.langLoadComplete)
                {
                    $temp();
                }
                else
                {
                    loadLangCompleteFun();
                }
            },100);
        }
        loadLangCompleteFun();
    },
    temp:function($t){
        return {
            postFrom:$t.import("@view/postSystFrom")//post system 打單
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$self:$t,
                lang:$t.lang
            }),
            pHistory:$t.import("@view/history")//post system 打單記錄
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$self:$t,
                lang:$t.lang
            })
        };
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{

    }
};

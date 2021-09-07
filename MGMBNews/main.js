
//新聞媒體
this.vue = {
    data:{
        lang:null,//語系
        langcc:null,//彩踩語系
        VueName:"",
        langLoadComplete:false,//這系載入完成($temp 取用)
    },
    init:function($t,$temp){
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("MGMBNews."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete=true;
            });
        }
        $t.main.pub.langEventAddFunc("MGMBNews",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();

        $t.langcc = new Jobj();
        var getFuncc = function()
        {//放入主系統語系
            $t.langcc.load("MGMBNewscc."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("MGMBNewscc",getFuncc);//注入載入語系(被取用或重覆載入(memory))
        getFuncc(); 
        $t.mainTemp.$m.h.ncc.MGNewsccLoad(function()
        {//載入 新聞 取共版-預載
            var getLoadTemp = function()
            {
                if($t.langLoadComplete){
                    $temp();
                }
                else
                {
                    setTimeout(function(){
                        getLoadTemp();
                    },100);
                }
            }
            getLoadTemp();
        });
    },
    temp:function($t){
        return {
            newsvue:$t.import("@view/index").exportVue({//新聞首頁
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                lang:$t.lang,
                langcc:$t.langcc,
            }),
            mgvue:$t.import("@view/MGNews").exportVue({//新聞稿
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                lang:$t.lang,
                langcc:$t.langcc,
            }),
                
        };
    },
    methods:{

    }
};

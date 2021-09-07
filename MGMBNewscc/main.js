
//彩彩
this.vue = {
    data:{
        langcc:null,//彩踩語系
        lang:null,//語系
        VueName:"",
        langLoadComplete:false,//這系載入完成($temp 取用)
    },
    init:function($t,$temp)
    {
        $t.lang = new Jobj();
        var getFun = function()
        {//新聞放入主系統語系
            $t.lang.load("MGMBNews."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("MGMBNews",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
        //載入 語系
        $t.mainTemp.$m.h.ns.MGNewsLoad(function()
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


        $t.langcc = new Jobj();
        var getFuncc = function()
        {//採踩放入主系統語系
            $t.langcc.load("MGMBNewscc."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete=true;
            });
        }
        $t.main.pub.langEventAddFunc("MGMBNewscc",getFuncc);//注入載入語系(被取用或重覆載入(memory))
        getFuncc();
       
    },
    temp:function($t){
        return {
            newsccvue:$t.import("@view/index").exportVue({//新聞首頁
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                langcc:$t.langcc,
                lang:$t.lang
            }),
            mgccvue:$t.import("@view/MGNews").exportVue({//新聞稿
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                langcc:$t.langcc,
                lang:$t.lang
            }),
                
        };
    },
    methods:{

    }
};

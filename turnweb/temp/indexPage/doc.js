this.vue = {
    data:{
      tag:{//tag 文章format
          path:"",
          tp:-1,
          content:null,
          show:false,
          langcc:null,//彩踩新聞語系
          lang:null,//新聞語系
      }
    },
    init:function($t,$temp){
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系-新聞
            $t.lang.load("MGMBNews."+$t.main.pub.lang,function(e){
            });
        }
        $t.main.pub.langEventAddFunc("MGMBNews",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun(); 


        $t.langcc = new Jobj();
        var getFuncc = function()
        {//放入主系統語系-彩踩
            $t.langcc.load("MGMBNewscc."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("MGMBNewscc",getFuncc);//注入載入語系(被取用或重覆載入(memory))
        getFuncc(); 
        setTimeout(function(){
            $t.mainTemp.$m.h.ns.MGNewsLoad(function()
            {//載入 新聞 取共版-預載
                $t.mainTemp.$m.h.ncc.MGNewsccLoad(function()
                {//載入 新聞 取共版-預載
                    $temp();
                });
            });
        },300);
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            newslivue:$t.import("MGMBNews@temp/pub/newsli")//標籤新聞文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:{
                    getLang:$t.getLang,
                    getLangcc:$t.getLangcc,
                    $m:$t.main$m.$m,
                    $an:$t.main$m.$an
                    }
            }),
            newscclivue:$t.import("MGMBNewscc@temp/pub/newsli")//標籤踩踩文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:{
                    getLang:$t.getLang,
                    getLangcc:$t.getLangcc,
                    $m:$t.main$m.$m,
                    $an:$t.main$m.$an
                    }
            }),
            pDMliVue:$t.import("@temp/indexPage/pub/pDMli")
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            storyliVue:$t.import("@temp/indexPage/pub/storyli")
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            })
            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        getLang:function(str,getLang)
        {//新聞語系設定取得
            if(getLang==undefined || getLang==null)
            {
                return this.lang.get(str);
            }
            else
            {//自定義語系
                return this.lang.get(getLang);
            }
        },
        getLangcc:function(str,getLang)
        {//新聞語系設定取得
            if(getLang==undefined || getLang==null)
            {
                return this.langcc.get(str);
            }
            else
            {//自定義語系
                return this.langcc.get(getLang);
            }
        }
    }
};

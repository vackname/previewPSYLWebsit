this.vue = {
    data:
    {
        VueName:'',//page Name(載入樣版代碼)
        lang:null,//語系
        openEdit:false,//店舖主商品編緝頁
        openEditLoad:false,//載入商品編緝頁
        showProtal:false,//show 首頁 商品購物
        openPay:false,//開啟結帳頁
        key:"",//明細key
        showDetail:false,//show 商品明細
        OutInto:false,//外部連動Page = true
        langLoadComplete:false,//語系載入完成($temp 取用)
    },
    init:function($t,$temp)
    {
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("productcity."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete=true;
            });
        }
        $t.main.pub.langEventAddFunc("productcity",getFun);//注入載入語系(被取用或重覆載入(memory))
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
            pDetailTemp:$t.import("@view/productDetail").exportVue({//商品名細
                pj:$t,//指自己
                main:$t.main,
                mainTemp:$t.mainTemp,
                lang:$t.lang,
            }),
            productTemp:$t.import("@view/index").exportVue({//購物車首頁
                pj:$t,//指productTemp
                main:$t.main,
                mainTemp:$t.mainTemp,
                lang:$t.lang
            }),
            payTemp:$t.import("@view/pay").exportVue({//結帳
                pj:$t,//指productTemp
                main:$t.main,
                mainTemp:$t.mainTemp,
                lang:$t.lang
            }),
            MgPs: $t.import("@view/MGProductSet").exportVue({//店主商品設定
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                lang:$t.lang
            }),

        };
    },
    methods:{

    }
};
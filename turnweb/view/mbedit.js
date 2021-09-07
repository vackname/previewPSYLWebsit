this.vue = {
    data:{
        load:false,
        AllCK:false,//是否驗證無誤
        AllCKpw:false,//驗證密碼修改是否有誤
        ckType:{//判斷是否通過驗證
            pw:-1,
            pw2:-1,//修改資訊-登入密碼
            pw3:-1,//修改密碼-登入密碼
            repassword:-1,
            mail:-1
        },
        langLoad:[],// 已曾載入語系    
        lang:null,//語系
    },
    init:function($t,$temp)
    {
        $t["$m"] = null;
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("mbedit."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("mbedit",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
    },
    tsc:[],
    completed : function($t,tscAry,$temp)
    {
        $temp();
        var showAnimate=function()
        {
            if(pb.el.id("mbeditPage").exist){
                pb.el.id("mbeditPage").style({"opacity":"0"});
                pb.el.id("mbeditPage").animate({"duration":3,"delay":0,"count":1},
                {//漸顯動畫
                    "0%":{"opacity": "0.3"},
                    "100%":{"opacity": "1"},
                }).remove();
            }
            else
            {
                setTimeout(function(){
                    showAnimate();
                },100)
            }
        };
        showAnimate();
    },
    temp:function($t){ 
        return {
            QRVue:$t.import("@temp/mbedit/QR")
            .exportVue({//會員 登入 token
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            mbinfoVue:$t.import("@temp/mbedit/mbdata")
            .exportVue({//會員簡述資訊
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            bankinfoVue:$t.import("@temp/mbedit/bankinfo")
            .exportVue({//銀行交易資訊
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            personVue:$t.import("@temp/mbedit/person")
            .exportVue({//申請轉換身份 填寫個資
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            runLoad:$t.import("init@temp/pb/loadAnimate")//load動畫
            .exportVue({
                content:"loading"
            })
        };
    },
    methods:{
        loginImg:function()
        {//登入模式 icon
            if(this.mainTemp.head.mbdata.tp>0){
                switch(this.mainTemp.head.mbdata.tp)
                {
                    case 4://google
                    return 'github.png';
                    case 3://google
                        return 'google.png';
                    case 2://facebook;
                        return 'facebook.png';
                    case 1://line
                        return 'line.png';
                }
            }
            return "";
        }
    }
};

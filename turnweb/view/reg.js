this.vue = {
    data:{
        load:false,//處理中
        priv:false,//同意書
        AllCK:false,//是否驗證無誤
        ckType:{
            priv:-1,
            name:-1,
            pw:-1,
            repassword:-1,
            mbid:-1,
            mail:-1,
        },
        lang:null,//語系    
    },
    init:function($t,$temp){
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
    },
    temp:function($t){ 
        return {
            regConsent:$t.import("@temp/reg/regConsent")//聲明書
            .exportVue({
                main:$t.main,
                reg: $t
            }),
            runLoad:$t.import("init@temp/pb/loadAnimate")//load動畫
            .exportVue({
                content:"處理中"
            })
        };
    },
    methods:{
        privOpenView:function(){//閱讀隱私
            pb.v(this,'regConsent').async(function(e){
                e.openView();
            });
        }
    }
};

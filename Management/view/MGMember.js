this.vue = {
    data:{
        headPortal:null,//注入Head
        appckser:"0",//1為搜尋異動帳戶
        mblevelList:[],//mblevel filter
        scrolltop:0,//定位畫面
        img:null,//銀行Img
        langPer:null,//個資語系
    },
    init:function($t,$temp)
    {
        $t.img = new Jobj();
        $t.img.loadlib("bank",function(e){//載入img 銀行
      
        });

        $t.langPer = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langPer.load("mbedit."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("mbeditMG",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
    },
    temp:function($t){ 

        $t.$m.mb.MBLevelContainer();
        pb.AddPrototype($t.mbset,{//帳戶設定
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
        });

        pb.AddPrototype($t.paylList ,{
            main:$t.main,
            mainTemp:$t.mainTemp,
            main$m:$t,//指自己
        });
        return {
            "AccountSet":$t.import("@temp/MGMB/AccountSet").exportVue($t.mbset),//帳戶設定
            pagetool:$t.import("init@temp/pb/PageTool")//分頁
            .Vue,
            payHY:$t.import("@temp/MGMB/payhistory")//歷史支付
            .exportVue($t.paylList),
        };
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {
        var waitLoad = function()
        {
            if($t.headPortal!=null)
            {
                vueComponent($t).Name("mgmb").Add($t.import("@temp/MGMB/MBList")//會員 list
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                }));
                $temp();
            }
            else
            {
                setTimeout(function(){
                    waitLoad();
                },5);
            }
        }
        waitLoad();
    },
    methods:{
        limitName :function(value)
        {//帳戶等級 filter
            var $t = this;
            var str ="未知";
            this.mblevelList.forEach(function(val,nu){
                if(value*1==val.val*1){
                    str = $t.main.pub.catchLangName(val.nameAry);
                }
            });
            return str;
        }
    }
};

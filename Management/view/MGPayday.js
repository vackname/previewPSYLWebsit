this.vue = {
    data:{
        showSearchPage:false,//show 營業單據管理
        shtp:2,//進貨=1 銷貨=0,2=一般進銷貨
        dealCount:0,//未處理計數
        pageCount:0,//分頁總數
        openMarkAdd:false,//tag活動模式Vue
        connectionAC:{name:"",key:""},//tag活動模式
        statusfilter:[],//支付狀態
        typefilter:[],//支付類別
        openDay:false,//顯示月結總合明細tb
        lang:null,//支付 lang
        langLoadComplete:false,//這系載入完成($temp 取用)
        loadImg:false,
        img:null,//載入銀行圖
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
            fpaytype:function(value){//支付類別
                var str="";
                $t.typefilter.forEach(function(val,nu){
                    if(value*1==val.val*1){
                        str= $t.main.pub.catchLangName(val.nameAry);
                    }

                });
                return str;
            },
            fpaystatus:function(value){//支付狀態
                var str="";
                $t.statusfilter.forEach(function(val,nu){
                    if(value*1==val.val*1){
                        str= $t.main.pub.catchLangName(val.nameAry);
                    }

                });
                return str;
            },
            fdate:function(value){
                return pb.reunixDate(value);
            }
        };
    },
    init:function($t,$temp){
        $t.img = new Jobj();
        $t.img.loadlib("bank",function(e){//載入img 銀行
            $t.loadImg = true;
        });
    },
    tsc:[],
    completed : function($t,tscAry,$temp){
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langLoadComplete = false;
            $t.lang.load("pay."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete = true;
            });
        }
        $t.main.pub.langEventAddFunc("payMGPayDay",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
        
        function loadLangCompleteFun()
        {//等候完整載入
            setTimeout(function()
            {
                if($t.langLoadComplete)
                {
                    $temp();
                    $t.$m.main.historyInit();
                }
                else
                {
                    loadLangCompleteFun();
                }
            },100);
        }
        loadLangCompleteFun();
    },
    temp:function($t)
    {
        return {
            pChartView:$t.import("@temp/MGPD/analytics").exportVue({//商品分析圖
                main:$t.main,
                main$m:$t
            }),
            detail:$t.import("@temp/pb/payDetail").exportVue({//票據商品明細
                main:$t.main,
                main$m:$t
            }),
            detailDate:$t.import("@temp/pb/payDetailDate").exportVue({//票據期限明細
                main:$t.main,
                main$m:$t,
                mainTemp:$t.mainTemp
            }),
            takLabelvue:$t.import("@temp/MGPD/takLabel")//標籤新增tool
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
        };
    },
    methods:{
        showAddMark:function(markAryFun,opentp)
        {//show 新增標標籤工具-openview
            this.openMarkAdd = true;
            pb.v(this,"takLabelvue").async(function(e)
            {
                e.tp = opentp;//顯示能放入之標籤
                e.insertFun=markAryFun;//繼承標籤陣列 insert function
            });
        },
        closeAcTag:function()
        {//結束伴空間連結模式
            this.connectionAC.key='';
        },
        reTitle:function(val)
        {/** 文碼編緝-title 伴空間活動 */
            if(val.titleAry.length>0)
            {
                if(val.langAry.indexOf(this.main.pub.langNu)>-1)
                {
                    return this.main.pub.catchLangName(val.titleAry).replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
                }
                else
                {
                    try
                    {
                        return val.titleAry[val.langAry[0]].replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
                    }
                    catch(e)
                    {
                        return "(null)";
                    }
    
                }
            }
            return "(null)";
        },
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        },
        statusColor:function(nu){//支付狀態顏色
            switch(nu*1){
                case 0:
                    return "color:#AAA;";
                case 1:
                    return "color:#FF8800;";
                case 2:
                    return "color:#227700;";
                case -1:
                    return "color:#FF3300;";
                case -2:
                    return "color:#AAA;";
                case -3:
                    return "color:#AAA;";
            }
        },
        openDetail:function(obj)
        {//載入 明細頁
            obj.open = true;
            pb.v(this,"detailDate").async(function(e){
                e.showUser = true;//show user
            });
        },
        openDayF:function()
        {//顯示月結總合明細tb
            this.openDay=!this.openDay;
        },
        getVal:function(val)
        {//重組json( 單據備註)
            var getObj = {};//斷開繼承重取 account
            pb.AddPrototype(getObj,val.recode);
            getObj.account = val.account;
            getObj.name = val.name;
            return getObj;
        },
        getLang:function(str)
        {//語系設定取得
            try
            {
                return this.lang.get(str);
            }
            catch(e)
            {
                return "";
            }
        },
        bankName:function(valNu)
        {//銀行名
            var name = "-";
            this.$m.main.bankSu().forEach(function(val,nu){
                if(val.val!=-1 && valNu==val.val)
                {
                    name=val.name;
                }
            });
            return name;
        },
        shName:function(valNu)
        {//寄送狀態
            var name = ["","","","","","","","","","",""];
            this.$m.main.shStatus().forEach(function(val,nu){
                if(valNu==val.val)
                {
                    name=val.nameAry;
                }
            });
            return this.main.pub.catchLangName(name);
        },
        Dtime:function(valNu)
        {//送達時段
            var name = ["","","","","","","","","","",""];
            this.$m.main.getDtime().forEach(function(val,nu){
                if(valNu==val.val)
                {
                    name=val.nameAry;
                }
            });
            return this.main.pub.catchLangName(name);
        }
    }
};

this.vue = {
    data:{
      open:false,
      pageTagetNu:0,
      load:true,//data 載入狀態載入完成(true)
      lang:null,//支付 lang
      langLoadComplete:false,//語系載入完成($temp 取用)
      loadImg:false,
      img:null,//載入銀行圖
    },
    watch:{
        history:function(){
            setTimeout(function(){//init
                window.scrollTop = 0;//scroll bar
            },200);
        }//資料更動復歸
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
                        str=$t.main.pub.catchLangName(val.nameAry);
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
    init:function($t,$temp)
    {
        $t.img = new Jobj();
        $t.img.loadlib("bank",function(e){//載入img 銀行
            $t.loadImg = true;
        });
    },
    temp:function($t){
        return {
                detail:$t.import("Management@temp/pb/payDetail")//票據商品明細
                .exportVue({
                    main:$t.main,
                    main$m:$t
                }),
                detailDate:$t.import("Management@temp/pb/payDetailDate").exportVue({//票據期限明細
                    main:$t.main,
                    main$m:$t,
                    mainTemp:$t.mainTemp
                }),
                pagetool:$t.import("init@temp/pb/PageTool")//分頁 tool
                .Vue,//page choose tool bar
            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langLoadComplete = false;
            $t.lang.load("pay."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete = true;
            });
        }
        $t.main.pub.langEventAddFunc("payturnweb",getFun);//注入載入語系(被取用或重覆載入(memory))
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
       $t.mainTemp.$m.h.MG.MGLoad(function(pjName)
       {
           //載入Management Project 取樣版
            loadLangCompleteFun();
        });
    },
    methods:
    {
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
            switch(nu){
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
            this.$m.bankSu().forEach(function(val,nu){
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
            this.$m.shStatus().forEach(function(val,nu){
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
            this.$m.getDtime().forEach(function(val,nu){
                if(valNu==val.val)
                {
                    name=val.nameAry;
                }
            });
            return this.main.pub.catchLangName(name);
        }
    }
};
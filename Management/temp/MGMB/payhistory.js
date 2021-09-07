/*pay history list(單據)*/
this.vue = {
    data:{
      open:false,
      pageTagetNu:0,
      load:true,//data 載入狀態載入完成(true)
      lang:null,//支付 lang
      langLoadComplete:false,//這系載入完成($temp 取用)
    },
    watch:{
            history:function(){
                setTimeout(function(){//init
                    pb.el.id("MGMB_PHTB").get.scrollTop = 0;//scroll bar
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
                        str=$t.main.pub.catchLangName(val.nameAry);
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
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langLoadComplete = false;
            $t.lang.load("pay."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete = true;
            });
        }
        $t.main.pub.langEventAddFunc("payMGMB",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
        
        function loadLangCompleteFun()
        {//等候完整載入
            setTimeout(function()
            {
                if($t.langLoadComplete)
                {
                    $temp();
                    $t.main$m.$m.ph.historyInit();
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
                detail:$t.import("@temp/pb/payDetail").exportVue({//票據商品明細
                    main:$t.main,
                    main$m:$t
                }),
                detailDate:$t.import("@temp/pb/payDetailDate").exportVue({//票據期限明細
                    main:$t.main,
                    main$m:$t,
                    mainTemp:$t.mainTemp
                }),
                pagetool:$t.import("init@temp/pb/PageTool").Vue//page choose tool bar
            }
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
        },
        ViewOpen:function()
        {// view
            this.open=true;
        },
        close:function(){
            this.open=false;
            window.scroll(0, this.main$m.scrolltop);//位移至定位畫面
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
            this.main$m.$m.ph.bankSu().forEach(function(val,nu){
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
            this.main$m.$m.ph.shStatus().forEach(function(val,nu){
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
            this.main$m.$m.ph.getDtime().forEach(function(val,nu){
                if(valNu==val.val)
                {
                    name=val.nameAry;
                }
            });
            return this.main.pub.catchLangName(name);
        }
    }
};

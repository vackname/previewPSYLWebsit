this.vue = {
    data:{
        inLoad:true,//支付未起動
        adrnow:false,//現場取貨
        productImg:null,//圖片容器
        adrLoad:null,//住址選擇器載入
        step:0,
        sumfee:0,//總合稅額
        sumProductCash:0,//show 目前cash 總合
        imgBK:null,//載入銀行圖片容器
        langPay:null,//pay 語系
        getShFormat:"",//運送包裝 foramt
        shFee:0,//運費
    },
    watch:{
        "adr.country":function()
        {
            this.adrChoose();
        },
        "adr.area":function()
        {
            this.adrChooseAreaZip();
        },
        step:function(value)
        {
            if(value=="2")
            {//載入運費計算
                if(!this.adrnow)
                {
                    this.$m.main.adrFee();
                }
                else
                {
                    this.getShFormat = "";
                    this.shFee = 0;
                }
            }
        }
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){

                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            }
        }
    },
    init:function($t,$temp)
    {
        $t.$m=null;
        $t.imgBK = new Jobj();
        $t.imgBK.loadlib("bank",function(e){//載入銀行 img

        });

        $t.adrLoad = new Jobj();
        $t.adrChoose();

        $t.langPay = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langPay.load("pay."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete=true;
            });
        }
        $t.main.pub.langEventAddFunc("productcityPay",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {
        $temp();
    },
    temp:function($t){
        return {
            bankVue:$t.import("init@temp/pb/pay")//支付銀端選擇
            .exportVue({
                getPay:function(e){
                    $t.$m.main.pay(e.bank,e.payOK);
                },
                bankImg:$t.$m.main.bankImg,
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp
            }),
        }
    },
    methods:{
        reContent:function(val,dataAry)
        {/** 文碼編緝(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//選擇可開起語系
                return this.main.pub.catchLangName(dataAry).replace(/\r/g, "").replace(/\n/g, "");
            }
            else
            {
                try
                {
                    return dataAry[val.langAry[0]].replace(/\r/g, "").replace(/\n/g, "");
                }
                catch(e)
                {
                    return "(null)";
                }
 
            }
        },
        pay:function()
        {//前往支付銀端
            pb.v(this,"bankVue").async(function(e){
                e.getPay(e);
            });
        },
        discountFun:function(val)
        {//目前折數即時
            this.$m.main.discountFun(val);
            return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get("index."+str);
        },
        getLangPay:function(str)
        {//語系設定取得
            return this.langPay.get(str);
        },
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
        adrChoose:function()
        {//載入住址選擇器
            var _this=this;
            this.adrLoad.load("Address."+this.adr.country,function(e)
            {//初始化
                _this.adr.city = "-";
                _this.adr.area = "-";
                _this.adr.zip = "-";
            });
        },
        adrChooseArea:function()
        {//選擇住址區域
            var getArea=[];
            var _this=this;
            var getData = ((this.adrLoad!=null)?((this.adrLoad.get('data')!="null")?this.adrLoad.get('data'):[]):[]);
            getData
            .forEach(function(val,nu){
                if(_this.adr.city == val.city)
                {
                    getArea=val.area;
                }
            });
            return getArea;
        },
        adrChooseAreaZip:function()
        {//選擇區域號
            var _this=this;
            var getData = ((this.adrLoad!=null)?((this.adrLoad.get('data')!="null")?this.adrLoad.get('data'):[]):[]);
            getData
            .forEach(function(val,nu){
                if(_this.adr.city == val.city)
                {
                    val.area.forEach(function(val2,nu2){
                        if(val2.n == _this.adr.area)
                        {
                            _this.adr.zip = val2.z;
                        }
                    });
                }
            });
        },
    }
};

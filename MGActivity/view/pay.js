this.vue = {
    data:{
      sumfee:0,//總合稅額
      sumProductCash:0,//總額計算
      ckAgree:false,//確認簡章內容
      adrLoad:null,//住址選擇器載入
      loadModel:false,//載入Model
      inLoad:true,//報名中
      imgBK:null,//載入銀行圖片容器
      langPay:null,//pay 語系
      stepMark:[''],//step mark 'ck' 'info' 'cinfo' 'addr' 'pay'
      loadMark:[],//step 已載入data
      gotoStep:0,
      getShFormat:"",//運送包裝 foramt
      shFee:0,//運費
      getAdrfeeList:[],//運費計算載入
    },
    watch:
    {
        "main.pub.langNu":function()
        {//語系切換取文章
            var _this=this;
            if(_this.data.langLoad.indexOf(_this.main.pub.langNu)==-1)
            {/** 阻止已曾經載入語系 */
                _this.$m.main.catchDoc(_this.data,false);
            }
        },
        "adr.country":function()
        {
            this.adrChoose();
        },
        "adr.area":function()
        {
            this.adrChooseAreaZip();
        },
        "gotoStep":function(val)
        {//個別載入喚動資訊


            if(this.stepMark[val]=='ck')
            {//反回至簡章 擇反確認
                this.ckAgree=false;
            }

            if(this.stepMark[val]=='info' && this.loadMark.indexOf('info')==-1)
            {
                this.loadMark.push('info');
                this.$m.main.loadPer();//載入個資
            }

            if(this.stepMark[val]=='cinfo'&& this.loadMark.indexOf('cinfo')==-1)
            {
                this.loadMark.push('cinfo');
                this.$m.main.loadAmes();//載入關系聯絡人
            }

            if(this.stepMark[val]=='addr'&& this.loadMark.indexOf('addr')==-1)
            {
                this.loadMark.push('addr');
                this.$m.main.loadAdr();//載入寄件住址
            }

            if(this.stepMark[val]=='pay'&& this.loadMark.indexOf('pay')==-1)
            {
                this.loadMark.push('pay');
                this.$m.p.PrivewProduct();//載入加購
            }
        },
        "ckAgree":function(val)
        {//確認簡章自動移動
            if(val)
            {
                if(this.stepMark.indexOf('ck')>-1)
                {
                    this.gotoStep =1;
                }
                else
                {
                    this.gotoStep =0;
                }
            }
            else
            {
                this.gotoStep =0;
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
        $t.imgBK = new Jobj();
        $t.imgBK.loadlib("bank",function(e){//載入銀行 img

        });

        importLoad.m.js["qrcode"](function(e)
        {////載入Qrcode Model

        });

        $t.langPay = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.langPay.load("pay."+$t.main.pub.lang,function(e){
                
            });
        }

        $t.main.pub.langEventAddFunc("activityPay",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();

        $t.ckAgree = false;
        $t.adrLoad = new Jobj();
        $t.adrChoose();
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
    tsc:["animateModel/pay"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];
        $temp();
    },
    methods:
    {
        discountFun:function(val)
        {//加購商品 目前折數即時
            try{
                this.$m.p.discountFun(val);
                return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
            }
            catch(e)
            {
                return 1;
            }
        },
        getLangPay:function(str)
        {//語系設定取得-pay
            return this.langPay.get(str);
        },
        ckTagBag:function(obj)
        {//商品 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==5 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        pay:function()
        {//前往支付銀端
            pb.v(this,"bankVue").async(function(e){
                e.getPay(e);
            });
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
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
        returnList:function(val)
        {//反回報名活動data list
            this.pj.toPay=false;
            if((this.mainTemp.SysLevel() || this.mainTemp.editLevel()) && !this.mainTemp.gotoTagBag)
            {//系統管理者進入-後台
                this.mainTemp.NuView = 1;//反回後台代號 init(PJ) pubExtendCtr enum_pag
                pb.v(this.mainTemp,"Management").async(function(topj)
                {
                    pb.v(topj,"MgAc").async(function(e)
                    {
                        setTimeout(function(){
                            window.scroll(0, e.ScrollTop);//位移至定位畫面
                        },100);
                    });
                });
            }
            else if(this.mainTemp.gotoTagBag)
            {//bag 進入
                this.pj.OutInto = false;
                this.mainTemp.showTagBag = true;
                this.mainTemp.gotoTagBag = false;
            }
            else if(this.pj.OutInto)
            {//外部 進入開起原緩存專案
                this.pj.OutInto = false;
                this.mainTemp.NuView = this.mainTemp.gotoPageHistory;
                this.mainTemp.loadTurnWeb=true;//起動載入首頁網站(url 進入)
            }
            else
            {//-般進入
                var _this = this;
                pb.v(this.pj,"AcVue").async(function(e)
                {
                    _this.pj.indexGoto = false;
                    setTimeout(function(){
                        window.scroll(0, e.ScrollTop);//位移至定位畫面
                    },200);
                });
            }
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        },
        reTitle:function(val)
        {/** 文碼編緝-title(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//開起語系
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
        },
        reContent:function(val,dataAry,multiple)
        {/** 文碼編緝(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//選擇可開起語系
                return this.main.pub.catchLangName(dataAry).replace(/\r/g, ((multiple)?"<br/>":"")).replace(/\n/g, ((multiple)?"<br/>":""));
            }
            else
            {
                try
                {
                    return dataAry[val.langAry[0]].replace(/\r/g, ((multiple)?"<br/>":"")).replace(/\n/g, ((multiple)?"<br/>":""));
                }
                catch(e)
                {
                    return "(null)";
                }
 
            }
        },
        month:function(val)
        {//月份翻譯
            return ((this.main.pub.langNu!=0)?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"][Number(val)-1]:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"][Number(val)-1]);
        },
        week:function(val)
        {//星期
            var nu = Math.ceil(((val/60)/60)/24+2)%7;
            return {
                w:((this.main.pub.langNu!=0)?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][nu]:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"][nu]),
                nu:nu
            };
        },
        nowTime:function(val)
        {//到數開始報名、報名截止
            if(val.stdate>pb.unixReNow())
            {//報名開放時間
                var catchTime = val.stdate-pb.unixReNow();
                var getdata ="";
                if(((catchTime/60)/60)/24>=1)
                {
                    getdata = Math.ceil(((catchTime/60)/60)/24)+((this.main.pub.langNu==0)?"天":"Day");
                }
                else if((catchTime/60)/60>=1)
                {
                    getdata = Math.ceil((catchTime/60)/60)+((this.main.pub.langNu==0)?"小時":"Hour");
                }
                else if((catchTime/60)>=1)
                {
                    getdata = Math.ceil(catchTime/60)+((this.main.pub.langNu==0)?"分鐘":"Minute");
                }else
                {
                    getdata = ((this.main.pub.langNu==0)?"1分鐘":"1Minute");
                }
                return this.getLang("opentime")+getdata;
            }
            else if(val.edate>pb.unixReNow())
            {//報名截止時間
                var catchTime = val.edate-pb.unixReNow();
                var getdata ="";
                if(((catchTime/60)/60)/24>=1)
                {
                    getdata = Math.ceil(((catchTime/60)/60)/24)+((this.main.pub.langNu==0)?"天":"Day");
                }
                else if((catchTime/60)/60>=1)
                {
                    getdata = Math.ceil((catchTime/60)/60)+((this.main.pub.langNu==0)?"小時":"Hour");
                }
                else if((catchTime/60)>=1)
                {
                    getdata = Math.ceil(catchTime/60)+((this.main.pub.langNu==0)?"分鐘":"Minute");
                }else
                {
                    getdata = ((this.main.pub.langNu==0)?"1分鐘":"1Minute");
                }
                return this.getLang("stoptime")+getdata;
            }
            return "";
        },
        getUrl:function(val)
        {//取得網址
            try
            {
                return this.$m.main.getUrl(val);
            }
            catch(e)
            {
                return "";
            }
        },
        loadQR:function(val)
        {//下載QRCode img
            this.mainTemp.viewConfirm("Download of QRCode Img？",function()
            {
                var oa = document.createElement('a');
                oa.href = pb.el.id('acqr'+val.key).get.getElementsByTagName("img")[0].src;
                oa.download = 'Activity'+val.key;//通過A標籤 設定檔名
                oa.click();
            },null,this.main.pub.lib.src('qr.png'));
        },
        copyUrl:function(val)
        {//複url
            var _this=this;
            this.mainTemp.viewConfirm("Copy of URL？",function()
            {
                var node = pb.el.id('acqrurl'+val.key).get;
                if (document.body.createTextRange) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(node);
                    range.select();
                    document.execCommand("copy");
                    _this.mainTemp.viewAlert("Copy URL!!",function(){},_this.main.pub.lib.src('copyurl.png'));
                } else if (window.getSelection) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(node);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand("copy");
                    _this.mainTemp.viewAlert("Copy URL!!",function(){},_this.main.pub.lib.src('copyurl.png'));
                } else {
                    _this.mainTemp.viewAlert("Not Copy URL!!<br/>Not support of browser ",function(){},_this.main.pub.lib.src('errorMes.png'));    
                }
            },null,this.main.pub.lib.src('copyurl.png'));
        }
    }
};

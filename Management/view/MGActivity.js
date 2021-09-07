this.vue = {
    data:
    {
        openMarkAdd:false,//新增標籤 加購商品
        nowYear:[],//今年 年份及之後 create date container us
        nowMonth:[[],[]],//月[時間區段A 時間區段B]
        nowMonthDayMax:[[0,31,28,31,30,31,30, 31,31,30,31,30,31],[0,31,28,31,30,31,30,31,31,30,31,30,31]],//今年月份 1~12 day create date container us    每個月份日[時間區段A 時間區段B]
        nowMonthDay:[[0,0],[0,0]],//日[時間區段A 時間區段B] ex:[[結束日號,開始日號]]
        ser:"",//搜尋
        lang:null,//活動報名語系
        ScrollTop:0,//反回原本定位
    },
    watch:{
        "main.pub.lang":function()
        {//語系切換取文章
            var _this=this;
            _this.list.forEach((val,nu)=>
            {
                if(val.langLoad.indexOf(_this.main.pub.lang)==-1)
                {/** 阻止已曾經載入語系 */
                    val.langLoad.push(_this.main.pub.lang);
                    _this.$m.main.catchDoc(val);
                }
            });
        }
    },
    init:function($t,$temp){
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系-新聞
            $t.lang.load("Activity."+$t.main.pub.lang,function(e){
            });
        }
        $t.main.pub.langEventAddFunc("Activity",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();

        importLoad.m.js["qrcode"](function(e)
        {////載入Qrcode Model

        });
        
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            takLabelvue:$t.import("@temp/MGActivity/takLabel")//標籤新增tool
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            }
    },
    tsc:["animateModel/MGActivity"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];
        $temp();
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
        discountFun:function(val)
        {//加購商品 目前折數即時
            this.$m.p.discountFun(val);
            return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
        },
        openclosePD:function(val)
        {//加購商品設定顯示
            val.pdPanel=!val.pdPanel;
            if(val.pdPanel)
            {//載入已取用商品陣列
                this.$m.p.PrivewProduct(val);
            }
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
        goPay:function(val)
        {//前往報名privew
            var _this = this;
            this.ScrollTop = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
            this.mainTemp.$m.h.ac.MGActivityLoad(function()
            {
                _this.mainTemp.NuView = 6;//反回後台代號 init(PJ) pubExtendCtr enum_pag
                _this.mainTemp.$m.h.ChangePj(_this.mainTemp.NuView,"MGActivity");
                pb.v(_this.mainTemp,"MGActivity").async(function(topj)
                {
                    topj.tagBag = false;
                    topj.indexGoto = true;
                    topj.key=val.key;
                    topj.toPay=true;
                    pb.v(topj,"AcPayVue").async(function(e)
                    {
                        e.data=null;
                        e.data = val;
                    });
                });
            });
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        },
        opeImageFile:function(el)
        {//open fileuplad image view
            pb.el.id('newofileACIn_'+el).get.click();
        },
        setContent:function(val)
        {//設定內容 openView
            val.openEdit  = !val.openEdit;
            if(val.langLoad.indexOf(this.main.pub.lang)==-1)
            {/** 阻止已曾經載入語系 */
                val.langLoad.push(this.main.pub.lang);
                this.$m.main.catchDoc(val);
            }
        },
        reContent:function(dataAry)
        {/** 文碼編緝(\r \n) */
            return this.main.pub.catchLangName(dataAry).replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
        }
        ,updateMark:function(val)
        {//更動資料mark
            val.update  = true;
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
        getYoutube:function(val,Project)
        {//新增Youtube url
            val.ybe=this.$an.char.YoutubeChar(val.ybeInput);
            this.$m.main.editDocVideoYoutube(val);
        },
        cancelYoutube:function(val)
        {//取消youtube
            var _this = this;
            this.mainTemp.viewConfirm("Remove?",function()
            {
                val.ybe="";
                _this.$m.main.editDocVideoYoutube(val);
            },null,this.main.pub.lib.src('delete.png'));
        }
    }
};

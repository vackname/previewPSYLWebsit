this.vue = {
    data:{
        ser:"",//搜尋
        ScrollTop:0,//反回原本定位
    },
    init:function($t,$temp){

    },
    temp:function($t)
    {
        return {

            };
    },
    tsc:["animateModel/index"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];
    },
    methods:{
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
        {//前往報名
            if(this.mainTemp.NormalLevel())
            {
                this.pj.OutInto=false;
                this.pj.indexGoto = true;
                this.ScrollTop = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
                this.pj.key=val.key;
                this.pj.toPay=true;
                pb.v(this.pj,"AcPayVue").async(function(e)
                {
                    val.QR = null;
                    e.data=null;
                    e.data = val;
                });
            }
            else if(!this.mainTemp.head.singCK)
            {//秀登入介面 (未登入)
                this.mainTemp.$m.h.urlset.singupView();
            }
            else
            {
                this.mainTemp.viewAlert("系統管理者不能參與報名！");
            }
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        },
        reTitle:function(val)
        {/** 文碼編緝-title(\r \n) */
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
        ,
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
        }
    }
};

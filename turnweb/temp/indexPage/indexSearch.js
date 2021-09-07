this.vue = {
    data:{
        img:null,
        lang:null,
        langcc:null
    },
    init:function($t,$temp)
    {
        $t.img= new Jobj();
        $t.img.loadlib("indexSer",function(e){//載入img
        });

        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系-新聞
            $t.lang.load("MGMBNews."+$t.main.pub.lang,function(e){
            });
        }

        $t.main.pub.langEventAddFunc("MGMBNews",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun(); 


        $t.langcc = new Jobj();
        var getFuncc = function()
        {//放入主系統語系-彩踩
            $t.langcc.load("MGMBNewscc."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("MGMBNewscc",getFuncc);//注入載入語系(被取用或重覆載入(memory))
        getFuncc(); 

        setTimeout(function(){
            $t.mainTemp.$m.h.ns.MGNewsLoad(function()
            {//載入 新聞 取共版-預載
                $t.mainTemp.$m.h.ncc.MGNewsccLoad(function()
                {//載入 採踩 取共版-預載
                    $temp();
                });
            });
        },300);
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            newslivue:$t.import("MGMBNews@temp/pub/newsli")//標籤新聞文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:{
                    getLang:$t.getLang,
                    getLangcc:$t.getLangcc,
                    $m:$t.main$m.$m,
                    $an:$t.main$m.$an
                    }
            }),
            newscclivue:$t.import("MGMBNewscc@temp/pub/newsli")//標籤踩踩文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:{
                    getLang:$t.getLang,
                    getLangcc:$t.getLangcc,
                    $m:$t.main$m.$m,
                    $an:$t.main$m.$an
                    }
            }),
            pDMliVue:$t.import("@temp/indexPage/pub/pDMli")
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            storyliVue:$t.import("@temp/indexPage/pub/storyli")
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            })
        }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:
    {
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
        ckTagBag:function(obj)
        {//url tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==1 && val.path==obj.url)
                {
                    ck=true;
                }
            });
            return ck;
        },
        NewsckTagBag:function(obj)
        {//新聞文章 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==0 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        NewsccckTagBag:function(obj)
        {//採踩地方 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==4 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        reTitle:function(val)
        {/** 伴空間活動 文碼編緝-title(\r \n) */
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
        },
        acTagBag:function(obj)
        {//伴空間活動
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==5 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        pcarTagBag:function(obj)
        {//市集 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==6 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        STckTagBag:function(obj)
        {//品牌故事 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==2 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        PPckTagBag:function(obj)
        {//商品文宣 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==3 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        LangTitle:function(str)
        {//PJ page config 語系
            console.log(this.main.pub.config.get("page"));
            return this.main.pub.config.get("page")[str];
        },
        getLang:function(str,getLang)
        {//新聞語系設定取得
            if(getLang==undefined || getLang==null)
            {
                return this.lang.get(str);
            }
            else
            {//自定義語系
                return this.lang.get(getLang);
            }
        },
        getLangcc:function(str,getLang)
        {//新聞語系設定取得
            if(getLang==undefined || getLang==null)
            {
                return this.langcc.get(str);
            }
            else
            {//自定義語系
                return this.langcc.get(getLang);
            }
        },
        copyUrl:function(name,val)
        {//copy url
            var _this=this;
            this.mainTemp.viewConfirm("Copy of URL？",function()
            {
                var node = pb.el.id(name+val.key).get;
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

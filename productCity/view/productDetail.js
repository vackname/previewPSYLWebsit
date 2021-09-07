this.vue = {
    data:{
        geNu:0,//初始圖片序號
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            }
        }
    },
    watch:
    {
        "main.pub.lang":function()
        {//語系切換取商品描述
            if(this.data.key!="")
            {
                if(this.data.langLoad.indexOf(this.main.pub.lang)==-1)
                {/** 阻止已曾經載入語系 */
                    this.data.langLoad.push(this.main.pub.lang);
                    this.$m.main.productDoc();
                }
            }
        }
    },
    init:function($t,$temp)
    {
        importLoad.m.js["qrcode"](function(e)
        {//載入Qrcode Model

        });
    },
    tsc:["animateModel/productDetail"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an = tscAry[0];
    },
    temp:function($t){ 
        return {

            }
    },
    methods:{
        getLang:function(str)
        {//語系設定取得
            return this.lang.get("index."+str);
        },
        discountFun:function(val)
        {//目前折數即時
            if(val.discountAry!=null)
            {
                try
                {
                    this.$m.main.discountFun(val);
                }catch(e)
                {

                }
                return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
            }
            return 1;
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
        ckTagBag:function(obj)
        {//商品 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==6 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
        returnList:function(val)
        {//反回商城
            this.pj.showDetail=false;
            if(this.mainTemp.gotoTagBag)
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
            {//-般進入/bag 進入
                pb.v(this.pj,"payTemp").async(function(e)
                {
                    setTimeout(function(){
                        window.scroll(0, e.ScrollTop);//位移至定位畫面
                    },200);
                });
            }
        },
        imgLeft:function()
        {//圖層切換左
            if(this.geNu-1>=0)
            {
                this.geNu--;
            }
            else
            {
                this.geNu= this.data.imgAry.length-1;
            }
        },
        imgRight:function()
        {//圖層切換右
            if(this.geNu+1<this.data.imgAry.length)
            {
                this.geNu++;
            }
            else
            {
                this.geNu= 0;
            }
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
                oa.href = pb.el.id('pcqr'+val.key).get.getElementsByTagName("img")[0].src;
                oa.download = 'ProductCar'+val.key;//通過A標籤 設定檔名
                oa.click();
            },null,this.main.pub.lib.src('qr.png'));
        },
        copyUrl:function(val)
        {//複url
            var _this=this;
            this.mainTemp.viewConfirm("Copy of URL？",function()
            {
                var node = pb.el.id('pcqrurl'+val.key).get;
                try{//複制
                    navigator.clipboard.writeText(node.innerHTML)
                }
                catch(e)
                {

                }
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

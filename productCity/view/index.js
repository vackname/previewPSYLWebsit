this.vue = {
    data:{
        load:true,
        showSerBar:false,
        productImg:null,//商品圖片 容器
        filter:false,//是否過瀘套餐
        selfclassmain:"333",//顯示商品類別
        selfclass:"999",//顯示商品細項
        InputSer:"",//搜尋關鍵字
        input:{
             selfclassmain:"333",//顯示商品類別
             selfclass:"999",//顯示商品細項
             InputSer:"",//搜尋關鍵字
        },
        pageNu:0,//目前所在分頁
        ScrollTop:0,//頁面定位
    },
    watch:{
        filter:function(value)
        {
            this.$m.main.productListSer(true);
        },
        selfclassmain:function(value)
        {//偵聽 first class 選項切換
            this.selfclass = "999";
            this.$m.main.productClassSec(value);
        }
    },
    init:function($t,$temp)
    {
        $t.productImg = new Jobj();//宣告商品圖層存儲
        $temp();
    },
    tsc:["animateModel/index"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an = tscAry[0];
        $t.$an.searchBar(function(){
            $t.showSerBar=true;
        },function(){
            $t.showSerBar=false;
        });//演示動畫
        window.addEventListener('scroll',function(event){
            $t.showSerBar=false;
        });
        $t.$m.main.productListSer(true);
    },
    temp:function($t){ 
        return {
            pagetool:$t.import("init@temp/pb/PageTool").Vue//page choose tool bar
        };
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
        discountFun:function(val)
        {//目前折數即時
            this.$m.main.discountFun(val);
            return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get("index."+str);
        },
        goProduct:function(val)
        {//前往商品明細
            this.ScrollTop = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
            this.pj.key=val.key;
            this.pj.showDetail = true;
            this.pj.OutInto=false;
            pb.v(this.pj,"pDetailTemp").async(function(e)
            {
                e.data=null;
                e.data = val;
            });
        }
    }
};

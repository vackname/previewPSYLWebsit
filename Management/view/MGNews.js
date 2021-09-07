
this.vue = {
    data:{
        showView:"editvue",   
        lang:null,//語系注入
        langcc:null//踩彩      
    },
    init:function($t,$temp)
    {
        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("MGMBNews."+$t.main.pub.lang,function(e){
                //載入 語系
            });
        }
        $t.main.pub.langEventAddFunc("MGMBNews",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();

        $t.langcc = new Jobj();
        var getFuncc = function()
        {//放入主系統語系
            $t.langcc.load("MGMBNewscc."+$t.main.pub.lang,function(e){

            });
        }
        $t.main.pub.langEventAddFunc("MGMBNewscc",getFuncc);//注入載入語系(被取用或重覆載入(memory))
        getFuncc(); 
    },
    tsc:["animateModel/MGNews"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];
        $temp();
    },
    temp:function($t){ 
        return {
            toolvue:$t.import("@temp/MGNews/tool")//文章搜尋 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            autoeditvue:$t.import("@temp/MGNews/autoedit")//自動審核設定
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            classvue:$t.import("@temp/MGNews/class")//文章分類設定
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            editvue:$t.import("@temp/MGNews/edit")//審核文章
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            }
    },
    methods:{
        getLang:function(str,getLang)
        {//語系設定取得
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
        {//彩踩語系設定取得
            if(getLang==undefined || getLang==null)
            {
                return this.langcc.get(str);
            }
            else
            {//自定義語系
                return this.langcc.get(getLang);
            }
        }
    }
};
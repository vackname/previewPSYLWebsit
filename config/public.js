
//取預設定語系
var getSysLang = function()
{
    var SysLang=navigator.language.toLowerCase();
    var nowLangVal="ch"
    if(SysLang.indexOf("zh-")>-1)
    {
        if(SysLang.indexOf("-cn")>-1)
        {//簡體
            nowLangVal="sch";
        }
        else
        {//繁體
            nowLangVal="ch";
        }
    }
    else if(SysLang.indexOf("en-")>-1)
    {//英語系國家
        nowLangVal="en";
    }
    else if(SysLang == "ja")
    {//日語
        nowLangVal="jp";
    }

    return nowLangVal;
}

//---
//載入 物件序列化
//---
var configDataList = function(){
    //config & public libary
    this.setPublic=function(loadf)
    {//宣告 載入 data
        var inLibary = {
            config:new Jobj(),lib:new Jobj(),
            adrAry:[{val:"TW",key:"台灣"}],//目前address 支持國家
            lang:"ch" ,//目前選擇語言
            langAry:[{val:"ch",key:"繁體"},{val:"sch",key:"簡体"},{val:"en",key:"English"},{val:"jp",key:"日文"}],//目前語言系統分類
            langFun:function()
            {//切換語系function
                inLibary.langAry.forEach(function(val,nu)
                {//注入lang序號
                    if(val.val==inLibary.lang)
                    {
                        inLibary.langNu = nu;
                    }
                });
                inLibary.config.load("config."+inLibary.lang,function(e){//載入 config

                });
                inLibary.langEventFunc.forEach(function(val,nu){
                    var waitLang = function(){
                        try
                        {
                            val.fun();
                        }
                        catch(e)
                        {
                            setTimeout(function(){
                                waitLang();
                            },10);
                        }
                    }
                    waitLang();
                });
            },
            langEventFunc:[],//其它語系function切換或載入
            langEventAddFunc:function(key,fun)
            {//add LangFunction
                var Exist = false;
                inLibary.langEventFunc.forEach(function(val,nu){
                    if(val.key==key)
                    {
                        Exist = true;
                        val.fun=fun;//取代function
                    }
                });
                if(!Exist)
                {
                    inLibary.langEventFunc.push({key:key,fun:fun});
                }
            },
            langNu:0,//當前語系序號 對應資料庫
            catchLangName:function(obj)
            {//語系資料對應 list
                try
                {
                    if(obj[inLibary.langNu]!=null && obj[inLibary.langNu]!=undefined && obj[inLibary.langNu]!="")
                    {
                        if(obj[inLibary.langNu]!="^null^")
                        {// 排除不支持語言
                            return obj[inLibary.langNu];
                        }
                    }
                    
                    //無儲存位置語系資料
                    return obj[0];
                }
                catch(e)
                {//無任何資訊 錯誤
                    return "(null)";
                }
            },
            catchLangNameNu:function(obj,nu)
            {//語系資料對應直接控制語系 list
                try
                {
                    if(obj[nu]!=null && obj[nu]!=undefined && obj[nu]!="")
                    {
                        return obj[nu];
                    }
                    return "(null)";
                }
                catch(e)
                {
                    return "(null)";
                }
            },
            scroll:[],//滑動事件注入-否定重新渲染 {key:'',fun:function(){}}
            scrollAddFun:function(key,fun)
            {//add 滑動事件注入
                var Exist = false;
                inLibary.scroll.forEach(function(val,nu){
                    if(val.key==key)
                    {
                        Exist = true;
                        val.fun=fun;//取代function
                    }
                });
                if(!Exist)
                {
                    inLibary.scroll.push({key:key,fun:fun});
                }
            },
        };
        inLibary.lang = getSysLang();//注入預設值語系
        window.addEventListener('scroll', function()
        {//滑動事件觸發
            inLibary.scroll.forEach(function(val,nu)
            {
                val.fun();
            });
        });

        var loadCount = 0;//載入完成計數
        inLibary.config.load("config."+inLibary.lang,function(e){//載入 config
            loadCount++;
            if(loadCount==2){
                loadf();
            }
        });
        inLibary.lib.loadlib("pub",function(e){//載入img
            loadCount++;
            if(loadCount==2){
                loadf();
            }
        });

        return inLibary;//生成陣列
    };
};
this.vue = {
    data:{
        oldIncon:-0.369,//舊 point
        nowIncon:-0.00369,//現在 point
        load:0,//初始化站台(登入wait)
        searchTextBox:"",//搜尋input
        searchBox:false,//搜尋bar
        payCar:true,//購物車小圖提示
        targetPageName:"index",
        maintainList:[],//maintain page recode API lock
        MenuList:[],//Menu head list
        MenuList2:[],//Menu head list
        MenuList3:[],//Menu head list
        MenuList4:[],//Menu head list
        toolOpen:"",//開起工具箱 "doc" "tool"
        facebookMesLoad:false,//偵聽facebook message 是否載入
    },
    watch:
    {
        targetPageName:function(val)
        {
            if(this.maintainList.indexOf(val)>-1)
            {//判斷是否取得維API
                this.mainTemp.maintain = true;
            }
        }
    },
    init:function($t,$temp)
    {
        $temp();
    },
    temp:function($t)
    {
        return {
                pcarTemp:$t.import("@temp/sildeView/ProductCar")//購物list 小清單
                .exportVue({//繼承 data
                    main:$t.main,
                    main$m:$t,//取得宣告專案入口點 us
                    mainTemp:$t.mainTemp
                })
            };
    },
    tsc:["animateModel/head"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates
        importLoad.m.js["facebookMes"]((e)=>
        {//載入facebook model
            $t.facebookMesLoad = true;
        });

    },
    methods:
    {
        toPage:function(val)
        {//開起分頁箱
            if(this.toolOpen==val)
            {
                this.toolOpen ='';
            }
            else
            {
                this.toolOpen =val;
            }
        },
        openBag:function()
        {//顯示標籤頁
            this.mainTemp.showTagBag=true;
            if(this.mainTemp.showTagBag)
            {//記錄檔前緩存區
                this.mainTemp.gotoPageHistory=this.mainTemp.NuView;//記錄反回緩存區
            }
        },
        getLange:function(str){//語系 web頁
            return this.main.pub.config.get("page")[str];
        },
        getTragetLable:function(key,web)
        {//辦識未選擇
            //reset 維護
            if(this.maintainList.indexOf(this.targetPageName)==-1)
            {//unlock maintain model
                this.mainTemp.maintain = false;
            }
            return ((this.targetPageName==key)?((this.mainTemp.scrollTop>6 && web)?'color:#666;':''):((!web)?'color:#AAA;font-size:15px;':'color:'+((this.mainTemp.scrollTop>6)?'#00754A':"#D4E9E2")+';font-size:12px;'));
        },
        useAppLevel:function()
        {//使用App階級
           return this.singCK && (this.mbdata.level==1 || this.mbdata.level==2 || this.mbdata.level==5);
        },
        PayLevel:function(){//登入永久付費使用權
            return this.singCK && this.mbdata.level==1;
        },
        NormalLevel:function(){//一般使用權
            return this.singCK && (this.mbdata.level<=2 || this.RgLevel()) && this.mbdata.level>-1;
        },
        MGLevel:function(){//商家登入使用權
            return this.singCK &&this.mbdata.level==2;
        },
        SysLevel:function(){//系統管理者
            return this.singCK &&this.mbdata.level==3;
        },
        RgLevel:function(){//寫手
            return this.singCK &&this.mbdata.level==5;
        },
        editLevel:function(){//編緝 管理者
            return this.singCK &&this.mbdata.level==6;
        },
        chiefSysLevel:function()
        {//最高權限管理者
            return this.singCK &&this.mbdata.level==9;
        },
        levelName:function(value){//權限使用者名稱
            var $t = this;
            var str="";
            this.mbLevelNameList.forEach(function(val,nu){
                if(value*1==val.val*1)
                {
                    
                    str = $t.main.pub.catchLangName(val.nameAry);
                }
            });
            return str;
        }
    }
};
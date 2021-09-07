var tempObj = {};
this.vue = {
    data:{
        pcarShow:false,//show 購物車清單
        loadMark:[],//緩儲已載入陣列
        NuView:0,//緩緒切換頁 enum model/pubExtendCtr enum_pag
        loginopen:false,//緩開 未登入狀況不載入 login view model
        VueName:"",
        maintain:false,//是否開啟maintain model
        maintain_exist:false,//是否曾經載入 maintain
        gotoPageHistory:0,//NuView 經由 TagBag進入點之記錄
        showTagBag:false,//show 目前標籤設定
        gotoTagBag:false,//標籤前往遮閉無相關資訊連結
        loadPJVue:false,//檢查登入後再載入專案
        loadTurnWeb:true,//預設載入turnWeb pj (url 進入 將不載入)
        topRemove:0,//錯視位移運算
        topRemove2:0,//錯視位移運算
        scrollTop:0,//目前scroll 位置
    },
    init:function($t,$temp)
    {
        window.addEventListener('scroll', function(e) {/* 偵聽高度是否被位移 */
            var nowVal = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
            if(nowVal>=6 &&  nowVal < 100 || nowVal < 6)
            {
                 $t.scrollTop =  nowVal;
            }

            try{//錯視位移 高度偵聽
                if(document.body.clientWidth>900)
                {
                    var topscroll = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
                    if(topscroll>600)
                    {
                        $t.topRemove=200;
                    }
                    else if(topscroll>0)
                    {
                        $t.topRemove= 200*(topscroll/600);
                    }
                    else
                    {
                        $t.topRemove=0;
                    }

                    if(topscroll>1500)
                    {//第二區段位移
                        $t.topRemove2=200;
                    }
                    else if(topscroll>900)
                    {
                        $t.topRemove2= 200*((topscroll-900)/600);
                    }
                    else
                    {
                        $t.topRemove2=0;
                    }
                }
            }
            catch(e)
            {
                $t.topRemove=0;
                $t.topRemove2=0;
            }
        });
    },
    watch:
    {
        maintain:function(val)
        {
            this.maintain_exist = true;
        }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {
        var loadPJ = "";//載入需求 對專案
        pb.LogindelCookie("oautotoken");//清除mark
        switch($t.main.urlName){
            default://入口點-主要首頁
                loadPJ = "turnweb";
                break;
        }
        importLoad.p[loadPJ](function(e){//載入load Project
            //--------login------------
            pb.AddPrototype($t.login,{//bind data for user page
                main: $t.main,
                mainTemp:$t,//取得宣告專案入口點 us
            });
            
            tempObj["maintain_temp"] = $t.import("@temp/index/maintain").exportVue({//繼承 data
                main:$t.main,//專案 入口點
                mainTemp:$t//index temp
            });//維護提示頁面

            tempObj["login"] = $t.import("@temp/index/login").exportVue($t.login);
            //-------login-end
            var PJ = this[loadPJ].main;
            tempObj[loadPJ]=PJ.exportVue({//繼承 data
                main:$t.main,//專案 入口點
                mainTemp: $t//index temp
            });
            $t.VueName = loadPJ;//選擇樣版
            $temp();
        });
    },
    temp:function($t){
        
        pb.AddPrototype($t.head,{//繼承 data
            main:$t.main,
            mainTemp:$t,//取得宣告專案入口點 us
        });
        
        pb.AddPrototype($t.foot,{//繼承 data
            main:$t.main,
        });
        tempObj["TagBagVue"] =  $t.import("@temp/index/TagBag")
        .exportVue({//標籤背包
            main:$t.main,
            mainTemp:$t,
        });
        tempObj["head_temp"] =  $t.import("@temp/index/head").exportVue($t.head);
        tempObj["foot_temp"] =  $t.import("@temp/index/foot").exportVue($t.foot);
        tempObj["author_temp"] = $t.import("@temp/index/author").exportVue({//繼承 data
            main:$t.main,
        });//作者頁
        tempObj["mesbox_temp"] =  $t.import("@temp/pb/MesBox").exportVue({//繼承 data
            main:$t.main,
        });
        return tempObj;
    },
    methods:{
        ViewAlertAtClose:function(mes,func,sec,imgicon)
        {//message box (auto close)
            pb.v(this,"mesbox_temp").async(function(e)
            {
                e.imgicon = "";
                e.ViewAlertClose(mes,func,sec,imgicon);
            });
        },
        viewAlert:function(mes,func,imgicon)
        {//message box
            pb.v(this,"mesbox_temp").async(function(e)
            {
                e.imgicon = "";
                e.ViewAlert(mes,func,imgicon);
            });
        },
        ViewConfirmInput:function(mes,func,fu,imgicon)
        {//message box yes false
            pb.v(this,"mesbox_temp").async(function(e)
            {
                e.imgicon = "";
                e.ViewConfirmInput(mes,func,fu,imgicon);
            });
        },
        viewConfirm:function(mes,func,fu,imgicon)
        {//message box yes false
            pb.v(this,"mesbox_temp").async(function(e)
            {
                e.imgicon = "";
                e.ViewConfirm(mes,func,fu,imgicon);
            });
        },
        viewMes:function(title,mes,func,imgicon)
        {//message box
            pb.v(this,"mesbox_temp").async(function(e)
            {
                e.imgicon = "";
                e.ViewOpen(title,mes,func,imgicon);
            });
        },
        chooseFirstPage:function()
        {//前往首頁
            this.VueName="turnweb";
            pb.v(this,this.VueName).async(function(e){
                e.VueName = "index";
            });
            pb.v(this,'head_temp').async(function(e){
                e.firstHome=false;
            });
        },
        pageV:function(pagename)
        {//緩儲渲染(不顯示擇不載)
            return  ((this.loadMark.indexOf(pagename)>-1)?this.v[pagename]:'');
        },
        addTag:function(tp,path,title)
        {//Add Tag
            this.$m.t.insert(tp,path,title);
        },
        delTag:function(tp,path)
        {//取消Tag
            var _this=this;
            this.tagbag.forEach(function(val,nu){
                if(tp == val.tp && val.path==path)
                {
                    _this.$m.t.del(val);
                }
            });
        },
        useAppLevel:function()
        {//使用App Level
            return this.head.singCK && (this.head.mbdata.level==1 || this.head.mbdata.level==2 || this.head.mbdata.level==5);
        },
        NormalLevel:function()
        {//一般使用權
            return this.head.singCK && (this.head.mbdata.level<=2 || this.head.mbdata.level==5) && this.head.mbdata.level>-1;
        },
        PayLevel:function(){//登入永久付費使用權
            return this.head.singCK && this.head.mbdata.level==1;
        },
        SysLevel:function(){//系統管理者
            return this.head.singCK &&this.head.mbdata.level==3;
        },
        editLevel:function(){//編緝 管理者
            return this.head.singCK && this.head.mbdata.level==6;
        },

    }
};
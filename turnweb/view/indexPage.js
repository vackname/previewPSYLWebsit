this.vue = {
    data:
    {
        sid:"",//socketID
        load:false,//首畫動畫是否動作完畢
        openBag:false,//show bag link
        openDoc:false,//最新消息文章開起
        scrollTop:0,//當前畫面位置
        inviteImg:null,//合夥聯絡資訊img
        inviteimgload:false,//合夥聯絡資訊img load complete
    },
    init:function($t,$temp){
        
        $t.inviteImg= new Jobj();
        $t.inviteImg.loadlib("Invite",function(e){//載入img合夥
            $t.inviteimgload=true;
        });
        $t.searchResult=[];//清空
    },
    tsc:["animateModel/indexPage"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates
        $t.$an.main.protalImgLoad();//載入首頁輪播動畫
        $temp();
    },
    temp:function($t){
        return {
            docVue:$t.import("@temp/indexPage/doc")//tag bag文章
            .exportVue({
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            indexSearch:$t.import("@temp/indexPage/indexSearch")//已搜尋資訊Page
            .exportVue({
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            imgBG:$t.import("@temp/indexPage/indexBG")
            .exportVue({//首頁背景 logo
                main:$t.main,
                mainTemp:$t.mainTemp,
                img:$t.indexImg,
                main$m:$t,
            }),
            protalVue:$t.import("@temp/indexPage/protal")//首頁
            .exportVue({
                main$m:$t,
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            storyVue:$t.import("@temp/indexPage/story")
            .exportVue({//故事
                main:$t.main,
                mainTemp:$t.mainTemp,
                img:$t.indexImg,
                main$m:$t
            }),
            pdmVue:$t.import("@temp/indexPage/pDM").exportVue({//商品文宣
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t
            }),
        };
    },
    methods:{
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
        toIndex:function()
        {//反回page
            if(this.openBag)
            {//反回bag
                this.openBag=false;
                this.mainTemp.showTagBag = true;
                this.mainTemp.gotoTagBag = false;
            }
            else
            {//由Page最新消息反回 首頁
                this.openDoc = false;
            }
            var _this =this;
            pb.el.id("indexPage")
            .animate({"duration":1,"delay":0,"count":1},
            {//漸顯
                "0%":{"opacity": "0"},
                "100%":{"opacity": "1"},
            }).remove();
            this.mainTemp.scrollTop = _this.scrollTop;//head 更色切換
            setTimeout(()=>
            {//避開vue 渲染時間
                window.scroll(0, _this.scrollTop);//位移至定位畫面
            },100);
        }
    }
};
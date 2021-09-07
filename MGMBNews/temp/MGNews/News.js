this.vue = {
    data:{
        selfclassmain:"333",//顯示類別
        selfclass:"999",//顯示細項
        newsctcsSec:[],//顯示細項 select input
        nowDataLang:"",//現在語系名(切換)
        openMarkAdd:false,//show 新增mark 介面
        openImgPreview:false,//預覽大圖
        ybeInput:"",//youtube input catch
    },
    watch:{
        selfclassmain:function(value){
            var _this=this;
            _this.selfclass = "999";
            _this.main$m.$m.main.selfCatchClass(value,function(e){
                _this.newsctcsSec = [];
                _this.newsctcsSec = e;
            });
        },
        "main.pub.lang":function()
        {//語系切換取文章
            var _this=this;
            this.main$m.datalist.forEach(function(val,nu)
            {//新增資料
                if(val.langLoad.indexOf(_this.main.pub.lang)==-1)
                {/** 阻止已曾經載入語系 */
                    val.langLoad.push(_this.main.pub.lang);
                    /** 分段式載入 */
                    let waitTime=nu*100;
                    setTimeout(()=>{
                        _this.main$m.$m.main.getFileFirst(val,()=>{

                        });
                    },waitTime);
                }
            });
        }
    },
    init:function($t,$temp)
    {
        $t.main$m.$m.s.startReSave();//是否重新儲存
        $temp();
    },
    temp:function($t){
        return {
            takLabelvue:$t.import("@temp/MGNews/News/takLabel")//標籤新增tool
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            newslivue:$t.import("@temp/pub/newsli")//標籤新聞文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            newscclivue:$t.import("MGMBNewscc@temp/pub/newsli")//標籤踩踩文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            pDMliVue:$t.import("turnweb@temp/indexPage/pub/pDMli")//商品文宣
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            storyliVue:$t.import("turnweb@temp/indexPage/pub/storyli")//牌品故事
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            newsliIMGvue:$t.import("@temp/pub/newsli/imgPreview")//標籤新聞圖片工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            })
        }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        getContent:function(obj)
        {//段落內容
            var _this = this;
            obj.forEach(function(val,nu){
                if(val.content[_this.main.pub.lang]==null)
                {
                    var catchContent = null;
                    Object.keys(val.content).map((key,nu2)=>
                    {//取其一被同步用
                        if(catchContent==null)
                        {
                            catchContent=val.content[key];
                        }
                        return false;
                    });

                    val.content[_this.main.pub.lang] = {title:"",content:""};//create未創建語系資料
                }
            });
            return obj;
        },
        opeImageFile:function(el)
        {//open fileuplad image view
            pb.el.id('newofile_'+el).get.click();
        },
        limitEdit:function(val)
        {//3天內 文章才可以編緝-判斷
            
            if(Math.abs(val.publish)>9 && val.codekey != 'fail' && val.codekey != '')
            {
                return Math.abs(val.publish)+24*60*60*3>pb.unixReNow();
            }
            return true;
        },
        showAddMark:function(markAryFun)
        {//show 新增標標籤工具-openview
            this.openMarkAdd = true;
            pb.v(this,"takLabelvue").async(function(e)
            {
                e.insertFun=markAryFun;//繼承標籤陣列 insert function
            });
        },
        publishTime:function(val)
        {/*發佈時間計算*/
           if(Math.abs(val.publish)-pb.unixReNow()>0){
              var totalTime =  Math.abs(val.publish)-pb.unixReNow();
              if(totalTime/60/60/24>1)
              {
                  return (totalTime/60/60/24).toFixed(2)+" days";
              }
              else if(totalTime/60/60>1)
              {
                  return (totalTime/60/60).toFixed(2)+" hours";
              }
              else if(totalTime/60>1)
              {
                return (totalTime/60).toFixed(2)+" minutes";
              }
            }
            else
            {
                return 0;
            };
        },
        getYoutube:function(val,mainVal)
        {//新增Youtube url
            val.ybe=this.main$m.$an.char.YoutubeChar(val.ybeInput);
            this.main$m.$m.s.editDocVideoYoutube(mainVal,val);
        },
        cancelYoutube:function(val,mainVal)
        {//取消youtube
            var _this = this;
            this.mainTemp.viewConfirm("Remove?",function()
            {
                val.ybe="";
                _this.main$m.$m.s.editDocVideoYoutube(mainVal,val);
            },null,this.main.pub.lib.src('delete.png'));
        },
        openImgView:function(val,nu)
        {//開起圖片預覽
            this.openImgPreview = true;
            pb.v(this,"newsliIMGvue").async(function(e){
                e.closeView=true;
                e.objImg = val.objImg;
                e.imgAry = val.imgAry;
                e.nu = nu;
            });
        }
    }
};

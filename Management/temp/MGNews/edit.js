this.vue = {
    data:{
        openImgPreview:false,//預覽大圖
        openMBPreview:false,//作者資訊預覽
    },
    init:function($t,$temp)
    {
        $t.main$m.$m.cl.classFirstList(true);//載入 class first

        $t.mainTemp.$m.h.ns.MGNewsLoad(function()
        {//載入 news 取共版
            $t.mainTemp.$m.h.ncc.MGNewsccLoad(function()
            {//載入 採踩 取共版
                $temp();
                $t.main$m.$m.main.serData(true);//first 文章
            });  
        });
    },
    temp:function($t)
    {
        return {
            newslivue:$t.import("MGMBNews@temp/pub/newsli")//標籤新聞文章 工具
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
            newsliIMGvue:$t.import("MGMBNews@temp/pub/newsli/imgPreview")//標籤新聞圖片工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
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
            })
        };
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    watch:{
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

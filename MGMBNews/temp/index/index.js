this.vue = {
    data:{
        nowDataLang:"",//現在語系名(切換)
        openImgPreview:false,//預覽大圖
        openMBPreview:false,//作者資訊預覽
    },
    init:function($t,$temp)
    {
        $t.main$m.$m.main.initLoad();//載入 class first/init
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
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
            newsliIMGvue:$t.import("@temp/pub/newsli/imgPreview")//標籤新聞圖片工具
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
        }
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
        openImgView:function(val,nu)
        {//開起圖片預覽
            this.openImgPreview = true;
            pb.v(this,"newsliIMGvue").async(function(e){
                e.closeView=true;
                e.objImg = val.objImg;
                e.imgAry = val.imgAry;
                e.nu = nu;
            });
        },
        ckTagBag:function(obj)
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

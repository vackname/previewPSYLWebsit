this.vue = {
    data:
    {
        openImgPreview:false,
        openMBPreview:false,//作者資訊預覽
        tagColor:["#EEE","#00AEAE","#7373B9"]//層級boder color
    },
    watch:{
        "main.pub.lang":function()
        {//語系切換取文章
            
            if(this.page.langLoad.indexOf(this.main.pub.lang)==-1)
            {/** 阻止已曾經載入語系 */
                this.page.langLoad.push(this.main.pub.lang);
                this.main$m.$m.main.NewsLabelMoreData(this.page,this.page.val);
            }
        }
    },
    init:function($t,$temp)
    {
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            newscclivue:$t.import("@temp/pub/newsli")//標籤踩踩新聞文章 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            newslivue:$t.import("MGMBNews@temp/pub/newsli")//標籤新聞文章 工具
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
            }),
            mbPreviewVue:$t.import("turnweb@temp/indexPage/pub/mbPreview")//文章作者preview
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
        /*init $temp() run to completed or not exist init*/
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
        openMB:function(uid)
        {/** 開起坐者資訊 */
            this.openMBPreview = true;
            this.main$m.$m.main.showMB(this,uid);
            pb.v(this,"mbPreviewVue").async(mbTemp=>
            {
                mbTemp.show=true;
            });
        },
        ckTagBag:function(obj)
        {//新聞文章 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==4 && val.path==obj.key)
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

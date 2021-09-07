this.vue = {
    data:{
        openImgPreview:false,       
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            protalIMGvue:$t.import("@temp/indexPage/pub/imgPreview")//大圖圖片工具
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
        reContent:function(val,dataAry)
        {/** 文碼編緝(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//已開起語系
                return this.main.pub.catchLangName(dataAry).replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
            }
            else
            {
                try
                {
                    return dataAry[val.langAry[0]].replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
                }
                catch(e)
                {
                    return "(null)";
                }
 
            }
        },
        openImgView:function(val,nu)
        {//開起圖片預覽
            this.openImgPreview = true;
            pb.v(this,"protalIMGvue").async(function(e)
            {
                e.anName = pb.unixReNow();
                e.closeView=true;
                e.objImg = val.objImg;
                e.imgAry = val.imgAry;
                e.nu = nu;
            });
        },
        ckTagBag:function(obj)
        {//故事 tagBag 驗證
            var ck=false;
            this.mainTemp.tagbag.forEach(function(val,nu){
                if(val.tp ==2 && val.path==obj.key)
                {
                    ck=true;
                }
            });
            return ck;
        },
        gotoUrl:function(url)
        {//前往 url
            window.open(url);
        }
    }
};

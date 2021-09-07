this.vue = {
    data:{
        openImgPreview:false,
    },
    init:function($t,$temp){
        $t.objImg = new Jobj();
        $t.main$m.$m.st.serData(true);//初始化搜尋
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            protalIMGvue:$t.import("turnweb@temp/indexPage/pub/imgPreview")//大圖圖片工具
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
        opeImageFile:function(el)
        {//open fileuplad image view
            pb.el.id('newofileStory_'+el).get.click();
        },
        setContent:function(val)
        {//設定內容 openView
            val.openEdit  = !val.openEdit;
        },
        reContent:function(dataAry)
        {/** 文碼編緝(\r \n) */
           return this.main.pub.catchLangName(dataAry).replace(/\r/g, "<br/>").replace(/\n/g, "<br/>");
        },
        updateMark:function(val)
        {//更動資料mark
            val.update  = true;
        },
        openImgView:function(val,nu)
        {//開起圖片預覽
            this.openImgPreview = true;
            pb.v(this,"protalIMGvue").async(function(e){
                e.closeView=true;
                e.objImg = val.objImg;
                e.imgAry = val.imgAry;
                e.nu = nu;
            });
        }
    }
};

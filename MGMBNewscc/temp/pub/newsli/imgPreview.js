this.vue = {
    data:{
        closeView:false,
       nu:0,//圖片號
       objImg:null,//圖片容器
       imgAry:[{titleAry:["","","","","",""],path:""}],//圖片data
    },
    init:function($t,$temp){
        this.objImg = new Jobj();
    },
    temp:function($t)
    {
        return {

            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        close:function()
        {//關閉view
            this.main$m.openImgPreview = false;
            this.closeView=false;
        },
        right:function()
        {//右邊資訊
            var _this =this;
            if(pb.el.id('preViewNewsccImg').exist)
            {
                if(pb.el.id("NewsccPreviewPhotodescription").exist)
                {
                    pb.el.id("NewsccPreviewPhotodescription").animate({"duration":0.2,"delay":0,"count":1},
                    {//退閃
                        "0%":{"opacity":"1"},
                        "100%":{"opacity":"0.3"}
                    }).frame(function(e){
                        e.animate({"duration":0.3,"delay":0,"count":1},
                        {//漸顯
                            "0%":{"opacity":"0.3"},
                            "100%":{"opacity":"1"}
                        }).remove();
                    });
                }

                pb.el.id('preViewNewsccImg').animate({"duration":0.2,"delay":0,"count":1},
                {//退閃
                    "0%":{"opacity":"1"},
                    "100%":{"opacity":"0.3"}
                }).frame(function(e){
                    if( _this.imgAry.length-1> _this.nu)
                    {
                        _this.nu++;
                    }
                    else
                    {
                        _this.nu=0;
                    }
                    e.animate({"duration":0.3,"delay":0,"count":1},
                    {//漸顯
                        "0%":{"opacity":"0.3"},
                        "100%":{"opacity":"1"}
                    }).remove();
                });
            }
        },
        left:function()
        {//左邊資訊
            var _this =this;
            if(pb.el.id('preViewNewsccImg').exist)
            {
                if(pb.el.id("NewsccPreviewPhotodescription").exist)
                {
                    pb.el.id("NewsccPreviewPhotodescription").animate({"duration":0.2,"delay":0,"count":1},
                    {//退閃
                        "0%":{"opacity":"1"},
                        "100%":{"opacity":"0.3"}
                    }).frame(function(e){
                        e.animate({"duration":0.3,"delay":0,"count":1},
                        {//漸顯
                            "0%":{"opacity":"0.3"},
                            "100%":{"opacity":"1"}
                        }).remove();
                    });
                }
                pb.el.id('preViewNewsccImg').animate({"duration":0.2,"delay":0,"count":1},
                {//退閃
                    "0%":{"opacity":"1"},
                    "100%":{"opacity":"0.3"}
                }).frame(function(e){
                    if( _this.nu>0)
                    {
                        _this.nu--;
                    }
                    else
                    {
                        _this.nu= _this.imgAry.length-1;
                    }
                    e.animate({"duration":0.3,"delay":0,"count":1},
                    {//漸顯
                        "0%":{"opacity":"0.3"},
                        "100%":{"opacity":"1"}
                    }).remove();
                });
            }
        },
    }
};

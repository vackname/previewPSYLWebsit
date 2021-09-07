this.vue = {
    data:{
        anName:"",//動畫唯一key
        closeView:false,
        nu:0,//圖片號
        objImg:null,//圖片容器
        imgAry:[],//圖片data      
    },
    init:function($t,$temp){

    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        close:function()
        {//關閉view
            this.main$m.openImgPreview = false;
            this.closeView =false;
        },
        right:function()
        {//右邊資訊
            var _this =this;
            if(pb.el.id('preViewprotalImg'+this.anName).exist)
            {

                pb.el.id('preViewprotalImg'+this.anName).animate({"duration":0.2,"delay":0,"count":1},
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
            if(pb.el.id('preViewprotalImg'+this.anName).exist)
            {
                pb.el.id('preViewprotalImg'+this.anName).animate({"duration":0.2,"delay":0,"count":1},
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

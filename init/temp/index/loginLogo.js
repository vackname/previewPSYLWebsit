this.vue = {
    data:{
        load:false,
    },
    init:function($t,$temp){
        $t.mainTemp.img.loadlib("login",function(e){
            $t.load=true;
            setTimeout(function()
            {//wait圖片load 框架
                $t.mainTemp.$an.loginManAn(true);//login運行動畫
            },50);
        });
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{

    }
};

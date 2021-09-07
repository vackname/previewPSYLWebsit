this.vue = {
    data:{
       img:null,//維護圖片載入                 
    },
    init:function($t,$temp)
    {
        $t.img = new Jobj();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:["animateModel/index/maintain"],
    completed:function($t,tscAry,$temp)
    {
        $t["$an"] = tscAry[0];
        $t.img.loadlib("waitservice",function(e)
        {
            setTimeout(function(){
                $t.$an.run();//起動圖層動畫
            },300);
        });
    },
    methods:{

    }
};

this.vue = {
    data:{
        searchBox:false,//搜尋box
        INDEOXimgary:["a2.jpeg","a3.jpeg","a5.jpg","a6.jpeg","a7.jpeg","a8.jpeg","a9.jpeg","a10.jpeg","a11.jpeg","a12.jpeg","a13.jpeg","a4.jpg","a14.jpeg","a1.jpeg"],
        //首頁播播動畫檔案名
        protalImg:null,//首頁輪播動畫容器
        indexNu:0,
        showAbout:true
    },
    init:function($t,$temp)
    {
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            about:$t.import("@temp/indexPage/protal/about")//認識我
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m
            }),
            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        
    },
    methods:{
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        }
    }
};

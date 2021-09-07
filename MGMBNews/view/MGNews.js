this.vue = {
    data:{
        docTypeList:[],//文章標籤狀態陣列
        openUploadView:false,//開啟儲存進度view
    },
    init:function($t,$temp){
      
    },
    temp:function($t){

        return {
            toolvue:$t.import("@temp/MGNews/tool")//文章搜尋 工具
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            Newsvue:$t.import("@temp/MGNews/News")//文章document
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            uploadvue:$t.import("@temp/MGNews/upload")
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            })
        };
    },
    tsc:["animateModel/MGNews"],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        $t.$an = tscAry[0];
        $temp();
        $t.$m.main.getDocType();//載入標籤狀態
    },
    methods:{
        getLangcc:function(str)
        {//語系設定取得
            return this.langcc.get(str);
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        }
    }
};
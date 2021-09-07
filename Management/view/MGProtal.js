this.vue = {
    data:
    {
        saveRun:false,//是否有正在執行儲存動無之程序
        recode:["storyVue"],//已開啟下載完成記錄
        showName:"storyVue",//目前開起view
    },
    watch:{
        showName:function(val)
        {
            if(this.recode.indexOf(val)==-1)
            {//mark 已載入成功
                this.recode.push(val);
            }
        }
    },
    init:function($t,$temp){
       
    },
    temp:function($t){
        return {
            storyVue:$t.import("@temp/MGProtal/story").exportVue({//首頁文宣
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t
            }),
            pdmVue:$t.import("@temp/MGProtal/pDM").exportVue({//商品文宣
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t
            }),
        }
    },
    tsc:["animateModel/MGProtal"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];
        $temp();
    },
    methods:{

    }
};

this.vue = {
    data:{
        pageTagetNu:-1,//當下頁碼
        InputSer:"",//搜尋欄
        RecodeInputSer:"",//記錄搜尋字串
        mbList:[],//mb list
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){
        return {
            pagetool:$t.import("init@temp/pb/PageTool")//分頁
            .Vue,
            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{

    }
};

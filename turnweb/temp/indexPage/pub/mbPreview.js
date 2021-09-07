this.vue = {
    data:{
        show:false,
        photo:[],//圖片路徑
        objImg:null,//圖像容器
        content:"",//簡介內容
        limit:false,//作者是否開起權限
        exist:false,//作者是否有寫簡介
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
            this.show=false;
            this.main$m.openMBPreview = false;
        },
    }
};

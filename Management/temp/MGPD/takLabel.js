this.vue = {
    data:{
        tp:0,//顯示能放入之標籤
    },
    watch:
    {

    },
    init:function($t,$temp){

    },
    temp:function($t){
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        insertFun:function(adddata)
        {/*被繼承 insert function 緩儲 
            adddata = 新增資料
            */
        },
        close:function()
        {//關閉視窗
            this.main$m.openMarkAdd = false;
        }
    }
};

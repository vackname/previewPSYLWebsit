this.vue = {
    data:{
        url:"",//超連結欄位
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
            pb.v(this.main$m,"Newsvue").async(function(e){
                e.openMarkAdd = false;
            });
        }
    }
};

this.vue = {
    data:{
        applyShow:false,//開啟申請單
        apply:5,//申請權限帳戶Model 5=記者    
    },
    watch:{
        applyShow:function(val)
        {
            if(val)
            {//載入個資
                this.main$m.$m.pe.loadMB();
            }
        },
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
        langGet:function(str)
        {
            return this.main$m.lang.get(str);
        }
    }
};

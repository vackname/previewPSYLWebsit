this.vue = {
    data:{
        getMoney:0,//金額    
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
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return ((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
        };
    },
    methods:{
        getVal:function(val)
        {//數字盤給數字
            if(val!=-2)
            {
                if(val!=-1)
                {
                    this.getMoney+=val*1;
                }
                else
                {//clear setting
                    this.getMoney=0;
                }
                this.main$m.$an.NumberClick( "nuCashChangePanel"+val);//按鈕動畫
                this.main$m.cash = this.getMoney;
            }
            else
            {//結帳
                this.getMoney = 0;
                this.main$m.$m.main.pay();
            }
        },
        close:function()
        {//退回贈讓頁
            this.main$m.stepPanel=1;
            this.getMoney = 0;
        }
    }
};

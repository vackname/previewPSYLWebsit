this.vue = {
    data:{
        change:false,
        sc:0,//前鏡頭後 境頭切換
        cash:500,//購買金額
        allowances:16//折讓金額運算%
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
        };
    },
    init:function($t,$temp)
    {
        $t.main$m.$an.addPoint.toScreen();//起動screen

    },
    temp:function($t){
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
     
    },
    methods:
    {
        Close:function()
        {
            this.main$m.$an.addPoint.closeScreen();
            this.main$m.CloseAddPointScreen = true;
        },
        ChangeScreen:function()
        {
            this.main$m.$an.addPoint.changeScreen();
        }
    }
};

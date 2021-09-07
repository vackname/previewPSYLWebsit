this.vue = {
    data:{
        openSetView:false,//開起套餐選擇模式
        open:false,//是否顯示
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
        };
    },
    init:function($t,$temp){

        $temp();
    },
    temp:function($t)
    {
        return {
            addAllowancesToolView:$t.import("@temp/postSystfrom/payMenu/allowances")//讓-數字選擇器
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            setMenuToolView:$t.import("@temp/postSystfrom/payMenu/setMenu")//套餐選擇器
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
        };
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        
    },
    methods:{
        addAllowancesShowFun:function(val)
        { //讓數字器 
            var $t = this;
            pb.v($t,"addAllowancesToolView").async(function(e)
            {
                e.open=true;
                e.obj=null;
                e.obj=val;//放入需修改商品項目
                e.getMoney="0";
            });
        },
        giftChange:function(val)
        {//贈
            val.gifts=!val.gifts
            var $t = this.main$m;
            setTimeout(()=>
            {//延遲暫存已選 項目
                sessionStorage.setItem("postProduct", JSON.stringify($t.product.chooseList));
            },200);
        },
        floatModel:function()
        {//是否進入 viewBox model(選商品模式)
            return this.main$m.stepPanel==0 || this.main$m.stepPanel==4;
        },
        sum:function(val)
        {//此商品金額總計
            var sum = val.count*val.cash*this.main$m.discountFun(val)+val.sfee;
            if(val.allowances *1 > sum)
            {//重新計算讓額(max)
                val.allowances = sum;
            }
            return sum - val.allowances *1;
        }
    }
};

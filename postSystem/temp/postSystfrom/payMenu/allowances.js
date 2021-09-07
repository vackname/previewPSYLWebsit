this.vue = {
    data:{
        open:false,//view show
        getMoney:"0",//金額
        obj:{cash:0,count:0,discountAry:[],nameAry:[],allowances:0},//被繼承商品(讓)
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
            if(val!=-1)
            {
                this.getMoney+=val;
                var nowMaxCash = this.obj.cash*this.obj.count * this.main$m.discountFun(this.obj);
                this.obj.allowances  =  ((nowMaxCash>=this.getMoney*1)?this.getMoney*1:nowMaxCash);
                this.main$m.$an.allowancesClick( "nuAddPanel"+val);//按鈕動畫
            }
            else
            {//clear setting
                this.getMoney="0";
                this.obj.allowances = 0;
            }
            var $t = this.main$m;
            setTimeout(()=>
            {//延遲暫存已選 項目
                sessionStorage.setItem("postProduct", JSON.stringify($t.product.chooseList));
            },300);
        },
        close:function()
        {//關閉view
            this.open =false;
        }
    }
};

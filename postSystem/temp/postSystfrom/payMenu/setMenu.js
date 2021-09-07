this.vue = {
    data:{
       group:[],//商品組別取得
       setList:[],//清單list
       menuModel:"old",//menu 模式(add,del,old)
       chooseNu:-1,//目前修改陣列
       pkey:"",//product key
       Pnu:-1,//controller product.chooseList number indexof
       ckCashError:false//是否非贈 或 因套餐全退商品而造成金額為零狀態(折讓以外)
    },
    watch:
    {
        menuModel:function(val)
        {
            this.catchProduct();
            this.chooseModel();
        },
        chooseNu:function(val)
        {
            this.chooseModel();
        }
    },
    init:function($t,$temp)
    {
        
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {

    },
    methods:
    {
        close:function()
        {//關閉套餐edit
            if(!this.ckCashError)
            {
                this.chooseNu=-1;
                this.Pnu=-1;
                this.setList = [];
                this.group = [];
                pb.v(this.main$m,"payMenuView").async(function(e)
                {
                    e.openSetView = false;
                });
            }
        },
        gotoChooseMenu:function()
        {//前往選購添加商品至套餐
            this.main$m.stepPanel=4;
            this.main$m.nowNu = -1;
            this.main$m.serTool.dataCount = this.main$m.SetProduct.dataCount;//初始化
            this.main$m.serTool.filter=false;//不能選取套餐商品
            this.main$m.$an.set.productcarAddBt();//加入套餐鈕動畫
        },
        catchProduct:function()
        {//輸出目前group 組對應
            if(this.Pnu!=-1)
            {
                if(this.main$m.product.chooseList.length > this.Pnu)
                {
                    var data = this.main$m.product.chooseList[this.Pnu].setdata;
                    this.group = ((data[this.menuModel].length>0)?data[this.menuModel]:[]);
                }
                else
                {
                    this.group = [];
                }
            }
            else
            {
                this.group = [];
            }
        },
        chooseModel:function()
        {
            //輸出取套餐資料menu(add,old,del)
            if(this.group.length > this.chooseNu)
            {
                this.setList = ((this.chooseNu!=-1)?this.group[this.chooseNu]:[]);
                this.main$m.$an.set.productcarAddGoBt();//前往加入套餐鈕動畫
            }
            else
            {
                this.setList = [];
            }
        },
        menuModelFun:function()
        {//menu model ctr
            this.menuModel = ((this.menuModel=="add")?"old":"add");
            this.main$m.$an.set.menuModel();
        }
    }
};

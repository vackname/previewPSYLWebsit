this.vue = {
    data:{
        open:true,//show(由套餐-list開關)
        watch:false,//觀看detail
        list:[],//商品項目清單
        checkOutDocument:{//單據框架
            display:1,//是否廢單
            amount: 0,//計算總額
            cash: 0,//收現金額
            date: 0,//建立日期
            fee: 0,//手續費/稅額
            key: "",//訂單號
            mark: "",//備註
            status: 0,//支付狀態 fillter: fpaystatus
            type: 0,//支付類別 fillter:fpaytype
        }
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t)
    {
        return {
            setMenuListView:$t.import("@temp/pb/checkOut/setList")//套餐選擇記錄
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
        }
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
            fpaytype:function(value){//支付類別
                var str="";
                $t.main$m.typefilter.forEach(function(val,nu){
                    if(value*1==val.val*1){
                        str= $t.main.pub.catchLangName(val.nameAry);
                    }

                });
                return str;
            },
            fpaystatus:function(value){//支付狀態
                var str="";
                $t.main$m.statusfilter.forEach(function(val,nu){
                    if(value*1==val.val*1){
                        str= $t.main.pub.catchLangName(val.nameAry);
                    }

                });
                return str;
            },
        };
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        statusColor:function(nu){//支付狀態顏色
            switch(nu*1){
                case 0:
                    return "color:#AAA;";
                case 1:
                    return "color:#FF8800;";
                case 2:
                    return "color:#227700;";
                case -1:
                    return "color:#FF3300;";
                case -2:
                    return "color:#4400CC;";
            }
        },
        close:function()
        {/*
            結束結帳狀態-需定義結束function
            */
        },
        setOpen:function(val)
        {//套餐細項 list view open;
            this.open = false;//暫時不顯示
            pb.v(this,"setMenuListView").async(function(e){
                e.open = true;
                e.obj =null;
                e.obj = val;
                e.chooseNu = 0;
            });
        }
    }
};

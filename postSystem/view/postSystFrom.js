this.vue = {
    data:{
        CloseAddPointScreen:true,
        cash:0,//找零計使用
        stepPanel:0,//找零=2, 結帳=3,0=重回打單,1=商品贈 讓設定,4=套餐點選
        itemAddName:"",//打單提示Name animate
        nowNu:-1,
        statusfilter:[],//支付狀態
        typefilter:[],//支付類別
    },
    init:function($t,$temp)
    {

    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
        };
    },
    temp:function($t){
        return {
                serToolView:$t.import("@temp/postSystfrom/search")//搜尋器
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                    data:$t.serTool,//controller 繼承
                }),
                classToolView:$t.import("@temp/postSystfrom/classMenu")//商品分類
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                    data:$t.serTool,//controller 繼承
                }),
                productView:$t.import("@temp/postSystfrom/product")//商品
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                }),
                payMenuView:$t.import("@temp/postSystfrom/payMenu")//已選打單項目
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                }),
                checkoutView:$t.import("@temp/pb/checkOut")//結帳頁面
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                    data:$t.product,//controller 繼承
                }),
                cashChangeView: $t.import("@temp/postSystfrom/cashChange")//找零頁面
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                    data:$t.product,//controller 繼承
                }),
                QRScreenView:$t.import("@temp/postSystfrom/QRScreenAddPoint")//現場充值/扣款
                .exportVue({
                    main:$t.main,
                    mainTemp:$t.mainTemp,
                    main$m:$t,//指自己
                }),
            };
    },
    tsc:["animateModel/postSysfrom"],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        $t.$an = tscAry[0];
        $t.$m.main.documentType();//支付型別取得(代碼轉文字)
        $t.$an.set.closeSetBt();//套餐選購模式close鈕特效動畫
        if (sessionStorage.getItem("poststepPanel") != null)
        {//回復之前點單資訊-step
            $t.stepPanel = sessionStorage.getItem("poststepPanel")*1;
        }
        if (sessionStorage.getItem("postProduct") != null)
        {//回復之前點單資訊-choose produc
            $t.product.chooseList = JSON.parse(sessionStorage.getItem("postProduct"));
        }
        if (sessionStorage.getItem("postDocument") != null)
        {//回復之前點單資訊-checkout
            setTimeout(function(){
                pb.v($t,"checkoutView").async(function(e)
                {
                    $t.$m.main.checkOut(JSON.parse(sessionStorage.getItem("postDocument")));
                });
            },100);
        }

        $temp();
    },
    methods:{
        openAddPoint:function()
        {/** 開啟充值鏡頭 */
            this.CloseAddPointScreen=false;
        },
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        },
        openPayMenu:function()
        {//開起目前已選清單
            pb.v(this,"payMenu").async(function(e){
                e.open=true;
            });
        },
        discountFun:function(val)
        {//目前折數即時
            var discount=1;
            if(val.discountAry.length>0)
            {
                var nowTime = pb.unixReNow();
                val.discountAry.forEach(function(val2,nu2)
                {
                    if(discount>val2.discount
                        && val2.end >= nowTime && val2.start <= nowTime
                        )
                    {//選擇最小折數
                        discount=val2.discount;
                    }
                });
            }
            return discount;
        },
        sumfee:function()
        {//總額計算
            var sum=0;
            var $t = this;
            this.product.chooseList.forEach(function(val,nu)
            {
                sum+=val.fee*val.count;
            });

            return sum;
        },
        sum:function()
        {//總額計算
            var sum=0;
            var $t = this;
            this.product.chooseList.forEach(function(val,nu)
            {
                sum+=((!val.gifts)?val.count * val.cash *$t.discountFun(val)-val.allowances*1+val.sfee:0);
            });

            return sum;
        },
        pObj:function()
        {// 商品選擇(0)/套餐商品選擇(4)
            return ((this.stepPanel!=4)?this.product:this.SetProduct);
        },
        closeSetModel:function()
        {//套餐模式取消
            this.nowNu=-1;
            this.stepPanel=1;
        }
    }
};
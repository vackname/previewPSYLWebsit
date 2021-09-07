this.vue = {
    data:{
        scrolltop:0,//畫面定位
        productImg:null,//商品圖層暫儲容器
        pageNu:0,//目前分頁
        pageCount:0,//分頁總數
        load:true,
        selfclassmain:"333",//顯示商品類別
        selfclass:"999",//顯示商品細項
        InputSer:"",//搜尋關鍵字
        InputType:"999",//商品 所屬庫存類別                                
    },
    watch:{
        selfclassmain:function(value)
        {
            this.selfclass = "999";
            var _this=this;
            _this.$m.cl.selfCatchClass(value,function(e){
                _this.productcsSec = [];
                _this.productcsSec = e;
            });
        }
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
            },
            nuFormat:function(value){//數字
                return pb.MoneyFormat(Math.ceil(value));
            },
            typeFilter:$t.typeFilter,
        }
    },
    init:function($t,$temp){
        $t.productImg = new Jobj();//宣告商品圖層存儲
    },
    temp:function($t){
        return {
            editview:$t.import("@temp/MGPDS/edit")//product edit
            .exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
                val:$t.product,//bind 格式使用
            }),
            ctrToolView:$t.import("@temp/MGPDS/tool")//商品設定 搜尋/add tool
            .exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            }
    },
    tsc:["animateModel/MGPDS"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates
        $t.$m.main.productListSer(true,function()
        {
            $temp();   
        });//first search
    },
    methods:{
        getClassname:function(obj)
        {//顯示選擇class名
            var $t = this;
            var getClassName = "";
            $t.productcs.forEach(function(val,nu){
                if(val.key==obj.pctkey && getClassName =="")
                {
                    $t.$m.cl.selfCatchClass(val.key,function(e){
                        e.forEach(function(val2,nu2){
                            if(val2.key==obj.pckey){
                                getClassName = $t.main.pub.catchLangName(val.nameAry)+"→"+$t.main.pub.catchLangName(val2.nameAry);
                            }
                        });
                    });
                }
            });
            return getClassName;
        },
        discountFun:function(val)
        {//目前折數即時
            this.$m.main.discountFun(val);
            return ((this.main.pub.langNu==0)?val.discount:(1-val.discount)).toFixed(2);//非中文改為off
        },
        typeFilter:function(value)
        {//maping 庫存type
            var $t=this;
            var str="-";
            var getVal=((value==0 || value==-1)?0:1);//轉正數(與隱藏商品功能解析)
            this.productTypeList.forEach(function(val,nu){
                if(val.val==getVal){
                    str = $t.main.pub.catchLangName(val.nameAry);
                }
            });
            return str;
        },
        langP:function(str)
        {//商品設定語系
            return this.lang.get("pEdit."+str);
        },
        langM:function(str)
        {//商品Alert語系
            return this.lang.get("mes."+str);

        }
    }
};
this.vue = {
    data:{
        scrolltop:0,//畫面定位
        productImg:null,//商品圖層暫儲容器
        pdType:"product",//設定功能選擇 "product" "gift" "class" "sf"
        pageNu:0,//目前分頁
        pageCount:0,//分頁總數
        load:true,
        selfclassmain:"333",//顯示商品類別
        selfclass:"999",//顯示商品細項
        InputSer:"",//搜尋關鍵字
        InputType:"999",//商品 所屬庫存類別
        InputClass:"999",//所屬產品類別
        appck:false,//審核模式=1=true(Search us)
        input:{
             selfclassmain:"333",//顯示商品類別
             selfclass:"999",//顯示商品細項
             InputSer:"",//搜尋關鍵字
             InputType:"999",//商品 所屬類別
             InputClass:"999",//所屬產品類別
            }
    },
    watch:{
        selfclassmain:function(value){
            var _this=this;
            _this.selfclass = "999";
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
            filterClass:$t.filterClass,
            typeFilter:$t.typeFilter,
            fdate:function(value){//日期
                return pb.reunixDate(value);
            },
            discountFilter:function(value){//折%
                return (value*100)+"%";
            },
            storeName:function(value)
            {//使用所屬 商店、線上
                var str ="";
                $t.storedatalist.forEach(function(val,nu){
                    if(val.val==value)
                    {
                        str = $t.main.pub.catchLangName(val.nameAry);
                    }
                });
                return str;
            }
        }
    },
    init:function($t,$temp){
        $t.productImg = new Jobj();//宣告商品圖層存儲
    },
    tsc:["animateModel/MGPDStsc"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates

        $t.$m.main.getStoreData();//注入商店 線上使用分類

        $t.$m.main.getTypeClassData();//注入分類list
        $t.$m.main.productListSer(true,function()
        {
            $temp();   
        });//first search

    },
    temp:function($t){ 
        return {
            GiftView:$t.import("@temp/MGPDS/gift").exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,
                val:$t.product//bind 格式使用
            }),
            classview:$t.import("@temp/MGPDS/class")//product class edit
            .exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            editview:$t.import("@temp/MGPDS/edit")//product edit
            .exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
                val:$t.product//bind 格式使用
            }),
            ctrToolView:$t.import("@temp/MGPDS/tool")//商品設定 搜尋/add tool
            .exportVue({main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,//指自己
            }),
            sfView:$t.import("@temp/MGPDS/sf").exportVue({main:$t.main,//商品推薦
                mainTemp:$t.mainTemp,
                main$m:$t,
                val:$t.product//bind 格式使用
            }),
        };
    },
    methods:{
        getClassname:function(obj)
        {//顯示選擇class名
            var $t = this;
            var getClassName = "";
            if(obj.pctkey!=null)
            {
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
            }
            return getClassName;
        },
        showdiscountList:function(pkey)
        {//catch目前運行折扣
            var ary=[];
            this.discountList.forEach(function(val,nu){
                if(val.pkey==pkey){
                    ary.push(val);
                }

            });
            return ary;
        },
        filterClass:function(value)
        {//maping product class
            var $t=this;
            var str="";
            this.productClassList.forEach(function(val,nu){
                
                if(val.val*1==value*1){
                    str = $t.main.pub.catchLangName(val.nameAry);
                }
            });
            return str;
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
        }
    }
};

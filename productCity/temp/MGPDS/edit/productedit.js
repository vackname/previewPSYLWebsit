this.vue = {
    data:{
        addCount:10,//庫存數量增減
        val:null,
        selfclassmain:"333",//顯示商品名細大分類
        selfclass:"999",//顯示商品項目分類名細
        productcsSec:[],//顯示商品項目分類名細 array
        imgEditShow:false,//開起編緝product圖片
    },
    watch:{
        selfclassmain:function(value){
            var _this=this;
            _this.selfclass = "999";
            this.main$m.$m.cl.selfCatchClass(value,function(e)
            {
                _this.productcsSec = [];
                _this.productcsSec = e;
            });
        }
    },
    init:function($t,$temp)
    {
        for(var a=0;a<$t.main.pub.langAry.length;a++)
        {
            $t.EditData.val.unitAry.push("");//補語系位置
            $t.EditData.val.nameAry.push("");
        }

        $temp();
    },
    funcFilters:function($t){
        return {
            cashFormat:function(value){//價格
                try
                {
                    return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
                }catch(e)
                {
                    return "";
                }
            },
            filterClass:$t.main$m.filterClass,
            typeFilter:$t.main$m.typeFilter,
            fdate:function(value){//日期
                return pb.reunixDate(value);
            }
        };
    },
    temp:function($t)
    {
        return {
            pPhotoImgEditView: $t.import("@temp/MGPDS/edit/productedit/imgEdit")//product photo img edit
            .exportVue({//編緝已 upload img
                pe:$t,//指編緝商品此self
                EditData:$t.EditData,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指 edit temp self
                main:$t.main})
        };
    },
    methods:{
        notUsInput:function()
        {//類別-不可更動(不顯示輸入欄位) [app]
           return [0].indexOf(this.EditData.val.class)==-1;
        },
        langP:function(str)
        {//編緝商品語系
            return this.main$m.langP(str);
        },
        getClassname:function(obj)
        {//商品分類 name
            return this.main$m.getClassname(obj);
        }
    }
};
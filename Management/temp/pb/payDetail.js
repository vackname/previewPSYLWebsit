/* 單據細項*/
this.vue = {
    data:{
        val:null,//單據 object json
        dataList:[],//取得商品清單
    },
    init:function($t,$temp){
        $t.detail($t.val,function(e)
        {//init data(外部需註入DetailFunction)
            $t.dataList = e;
        });
        $temp();
    },
    filters:{
        cashFormat:function(value){
            return " $NT "+((value.toFixed(3).split('.')[1]*1==0)?pb.MoneyFormat(value.toFixed(3)).split('.')[0]:pb.MoneyFormat(value.toFixed(3)));
        }
    },
    temp:function($t){ 
        return {
            setMenuListView:$t.import("@temp/pb/payDetail/setList")//商品名細(套餐)
            .exportVue({
                main:$t.main,
                main$m:$t.main$m,//指自己
            }),
        }
    },
    methods:
    {
        setOpen:function(val)
        {//套餐細項 list view open;
            pb.v(this,"setMenuListView").async(function(e)
            {
                e.open = true;
                e.obj =null;
                e.obj = {nameAry:val.nameAry,count:val.count,sdata:JSON.parse(pb.Base64ToUTF8(val.sdata))}
                e.chooseNu = 0;
            });
        },
        getLang:function(str)
        {//語系設定取得
            return this.main$m.lang.get(str);
        }
    }
};
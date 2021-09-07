this.vue = {
    data:{
        openCheckOut:false,//結帳頁面
        statusfilter:[],//支付狀態
        typefilter:[],//支付類別
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            serToolView:$t.import("@temp/history/serTool")//搜尋器
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
            pagetool:$t.import("init@temp/pb/PageTool").Vue,//page choose tool bar
        }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        $t.$m.main.documentType();//支付型別取得(代碼轉文字)
    },
    methods:{
        getLang:function(str)
        {//語系設定取得
            return this.lang.get(str);
        }
    }
};

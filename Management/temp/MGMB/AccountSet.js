/*使用者設定*/
this.vue = {
    data:{
        getAppPage:"profit",
       open:false,
       changePwd:{
           sendmail:false//send mail load type
       },
       pay:{
        chooseDate:"empty",//支付選擇時間
        chooseCount:"empty",//支付選擇個數
        paystatus:-1,//支付狀態
        options:[//讓 贈 設定 -格式初始化
            {pkey:"a", gifts:false, allowances:0,refundCash:0},//帳戶count數 key,是否增,讓金額,退款金額
            {pkey:"b", gifts:false, allowances:0,refundCash:0}//期限
        ]
       },
       getDateList:[],//支付器 期間 choose input array data
       getCountList:[],//支付器 帳號個數 choose input array data
    },
    funcFilters:function($t){
        return {
            limitName: $t.main$m.limitName//取 MGMember methods
        };
    },
    init:function($t,$temp){
       $t.main$m.$m.ma.getDateData(function(e){
           $t.getDateList = e;
       });

       $t.main$m.$m.ma.getCountData(function(e){
           $t.getCountList = e;
       });

    },
    temp:function($t)
    { 
        return {};
    },
    methods:{
        ViewOpen:function()
        {//view
            this.open=true;
            this.pay.chooseDate = "empty";//清空
            this.pay.chooseCount = "empty";
            this.pay.paystatus = -1;
            this.options=[//讓 贈 設定 -格式初始化
                {pkey:"a", gifts:false, discount:0},//帳戶count數
                {pkey:"b", gifts:false, discount:0}//期限
               ];

            if(this.mb.ck)
            {//取得url資源
                this.main$m.$m.ma.ShareUrlList(this);
            }
        },
        close:function(){
            this.open=false;
            window.scroll(0, this.main$m.scrolltop);//位移至定位畫面
        }
    }
};

this.vue = {
    data:{
       bank:"",//銀端選擇
       img:null,
       load:false,
       lang:null,
    },
    init:function($t,$temp){
        $t.img = new Jobj();
        $t.img.loadlib("bank",function(e){//載入img
            $t.load=true;
        });

        $t.lang = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.lang.load("bank."+$t.main.pub.lang,function(e){
                //載入 語系
                $t.langLoadComplete=true;
            });
        }
        $t.main.pub.langEventAddFunc("bank",getFun);//注入載入語系(被取用或重覆載入(memory))
        getFun();
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
    methods:{
        /** 支付銀行圖片 */
        bankImg:function(img,bank)
        {//注入

        },
        getPay:function(e)
        {//注入銀端

        },
        payOK:function(data,repoint,topage)
        {//帳單成立
            if(data.status>=0)
            {
                var _this=this;
                if(repoint!=null)
                {//app點數
                    this.mainTemp.ViewAlertAtClose("OK/支付成成功!!<br/>point -"+(data.amount*1000)+"",()=>
                    {
                        _this.mainTemp.$m.h.tur.gourlPay();//前往單據
                    },8,this.img.src('coin.png'));
                }
                else if(topage!=null)
                {//其它支付轉帳(url)
                    document.location.href = topage;
                }
                else
                {//帳簿現金轉帳
                    this.mainTemp.viewAlert(this.lang.get("ta")+"<br/>"+data.account+"<br/>$NT"+pb.MoneyFormat(data.amount.toFixed(2)).split('.')[0],()=>
                    {
                        _this.mainTemp.$m.h.tur.gourlPay();
                        //前往歷史單據
                    },this.bankImg(this.img,data.bank));
                }
            }
            else
            {//單據異常
                this.mainTemp.viewAlert(this.main.pub.config.get("error").svbusy+"<br/>id:"+data.key,()=>
                {

                },this.bankImg(this.img,data.bank));
            }
        }
    }
};

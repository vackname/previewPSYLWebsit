this.vue = {
    data:{
        open:false,//開啟提示訊息窗
        fun:null,//是-function
        notFunc:null,//否-function
        title:"",//title
        content:"",//訊息內容
        mark:"",//被輸入欄位傳值
        type:0,//0=alert,1=confirm,2=auto close alert,3=confirm input
        BoxMes:null,//樣版系統資訊
        titleSys:"",//系統-title
        countDown:-1,//自動關閉alert
        countDownTotal:3,//自動關閉到數完成秒數
        imgicon:"",//放入設置小圖
    },
    watch:{
        open:function(val)
        {
            if(val)
            {//開啟動畫
                this.$an.openAn();
            }
            else
            {//關閉即不到數
                this.countDown=-1;
            }
        }
    },
    init:function($t,$temp){
        $t.BoxMes = new Jobj();
        var getFun = function()
        {//放入主系統語系
            $t.BoxMes.load("AlertBox."+$t.main.pub.lang,function(e){
                $t.titleSys = $t.BoxMes.get("title");
            });
        }
        $t.main.pub.langEventAddFunc("AlertBox",getFun);//注入載入語系
        getFun();
    },
    temp:function($t){ 
        return {

            }
    },
    tsc:["animateModel/pb/MesBox"],
    completed:function($t,tscAry){
        $t.$an=tscAry[0];//注入動畫
    },
    methods:{
        ViewAlertClose:function(mes,func,sec,imgicon)
        {//自動關閉 alert
            this.type = 2;
            this.ViewOpen("{title}",mes,func,func,imgicon);
            var $t = this;
            if($t.countDown==-1)
            {
                if(sec==undefined)
                {
                    $t.countDownTotal = 3;
                }
                else
                {
                    $t.countDownTotal = sec;
                }
                $t.countDown = 10*$t.countDownTotal;
            }
            setTimeout(function(){
                if( $t.countDown!=-1)
                {//已有其它動作關閉
                    $t.countDown--;
                    if($t.countDown == 0)
                    {
                        $t.open=false;
                        $t.countDown=-1;
                        $t.close();
                    }
                    else
                    {
                        $t.ViewAlertClose(mes,func,sec,imgicon);
                    }
                }
            },100);
        },
        ViewAlert:function(mes,func,imgicon)
        {
            if(imgicon!=undefined && imgicon!=null)
            {//注入小圖
                this.imgicon = imgicon;
            }
            this.type = 0;
            this.ViewOpen("{title}",mes,func,func,imgicon);
        },
        ViewConfirmInput:function(mes,func,notFunc,imgicon)
        {
            if(imgicon!=undefined && imgicon!=null)
            {//注入小圖
                this.imgicon = imgicon;
            }
            this.mark="";
            this.type = 3;
            this.ViewOpen("{title}",mes,func,notFunc,imgicon);
        },
        ViewConfirm:function(mes,func,notFunc,imgicon)
        {
            if(imgicon!=undefined && imgicon!=null)
            {//注入小圖
                this.imgicon = imgicon;
            }
            this.type = 1;
            this.ViewOpen("{title}",mes,func,notFunc,imgicon);
        },
        ViewOpen:function(title,mes,func,notFunc,imgicon)
        {// view

            if(imgicon!=undefined && imgicon!=null)
            {//注入小圖
                this.imgicon = imgicon;
                this.$an.openIconAn();
            }

            //title 預設引用 "{title}"
            if(func!=undefined)
            {//確認function
                this.fun = func;
            }
            else
            {
                this.fun = null;
            }

            if(notFunc!=undefined)
            {//否定funciton
                this.notFunc = notFunc;
            }
            else
            {
                this.notFunc = null;
            }
  
            this.content = mes;
            this.title = ((title=="{title}")?this.titleSys:title);
            this.open=true;
        },
        close:function(){
            this.open=false;
            this.mark="";
            this.imgicon="";
            if(this.notFunc!=null)
            {
                this.notFunc(this.mark);//需運行function
            }
        },
        Agree:function(){
            this.open=false;
            if(this.fun!=null)
            {
                this.fun(this.mark);//需運行function
            }
        }
    }
};

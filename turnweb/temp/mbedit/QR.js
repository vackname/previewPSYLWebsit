this.vue = {
    data:{
        QRSrc:null,//QRImg
        QRSrc2:null,//QRImg
        Show:false                     
    },
    watch:{
        Show:function(val)
        {
            this.main$m.$m.qr.getQurCode();
        }
    },
    init:function($t,$temp){
        importLoad.m.js["qrcode"](function(e)
        {//載入Qrcode Model

        });
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
        langGet:function(str)
        {
            return this.main$m.lang.get(str);
        },
    }
};

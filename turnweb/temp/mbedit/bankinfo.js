this.vue = {
    data:{
        bankShow:false,
        imgload:true,//照片是否已載入 
    },
    init:function($t,$temp){
        $t.main$m.$m.bank.BankPhoto();
    },
    temp:function($t){
        return {

            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        langGet:function(str)
        {
            return this.main$m.lang.get(str);
        },
        opeImageFile:function()
        {//open fileuplad image view
            pb.el.id('memberEditBankfile').get.click();
        },
    }
};

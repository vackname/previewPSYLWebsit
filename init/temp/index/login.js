this.vue = {
    data:{
        open:false,
        load:false,//load啟動
        mailfun:false,//true = send mail
        findPwd:false,//true = 找回密碼
        meLogin:false,//me Login view
    },
    init:function($t,$temp)
    {
        $temp();
    },
    tsc:["animateModel/Login"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates
        vueComponent($t).Name("LoginlogoView").Add($t.import("@temp/index/loginLogo")//登入 擬人提示動畫
        .exportVue({mainTemp:$t,main:$t.main}));//注入樣版login logo

    },
    temp:function($t){ 
        return {
            };
    },
    methods:{
        pwdType:function()
        {
            this.findPwd = !this.findPwd;
        },
        gotoReg:function()
        {//前往註冊
            this.open = false;
            this.mainTemp.$m.h.tur.turnREG();
        },
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        },
        LangInput:function(str)
        {//input 語系
            return this.main.pub.config.get("input")[str];
        },
    }
};

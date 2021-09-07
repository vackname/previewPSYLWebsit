this.vue = {
    data:{
        VueName:"",
    },
    init:function($t,$temp)
    {
        $t["index"]={
            main:$t.main,
            mainTemp:$t.mainTemp,
            img:new Jobj(),
            pj:$t
        };
        
        $t.main.page = 'index';//入口點預設 title
        $temp();
        $t.VueName="index";
    },
    temp:function($t){
        return {
            index:$t.import("@view/indexPage")//搜尋首頁
            .exportVue($t.index),
            reg:$t.import("@view/reg")//註冊
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            private:$t.import("@view/private")//隱私政策
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            service:$t.import("@view/service")//服務條款
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            invite:$t.import("@view/invite")//邀約
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp
            }),
            aboutStory:$t.import("@view/aboutStory")//共好
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
            }),
            mbedit:$t.import("@view/mbedit")//帳戶編緝
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp
            }),
            PayHistory:$t.import("@view/MGPay")//歷史支付
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp
            })
        };
    },
    methods:{

    }
};
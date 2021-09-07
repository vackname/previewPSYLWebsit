this.vue = {
    data:{
        VueName:"",
        logedit:false,//前往審核log
        logodownload:false,//載入審核log page
        turnLog:false,//反回Log 審核
    },
    init:function($t,$temp)
    {
        $t.VueName="MgMb";
        $temp();
    },
    temp:function($t){
        return {
            MgWatch:$t.import("@view/MGWatch")
            .exportVue({//監控系統
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgMb:$t.import("@view/MGMember")
            .exportVue({//會員
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgPd:$t.import("@view/MGPayday")
            .exportVue({//結帳
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgPs: $t.import("@view/MGProductSet")
            .exportVue({//商品設定
                main$m:$t,
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgNews:$t.import("@view/MGNews")
            .exportVue({//新聞媒體edit
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgNewscc:$t.import("@view/MGNewscc")
            .exportVue({//採踩edit
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
            MgPT:$t.import("@view/MGProtal")
            .exportVue({//首頁文宣
                    main:$t.main,//繼承 init
                    mainTemp:$t.mainTemp}),
             MgLog:$t.import("@view/MGLog")
             .exportVue({//審核Log
                main$m:$t,
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp}),
           MgAc:$t.import("@view/MGActivity")
           .exportVue({//伴空間
                main:$t.main,//繼承 init
                mainTemp:$t.mainTemp,
                pj:$t//本身專案
            }),
        };
    },
    methods:{

    }
};

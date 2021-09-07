this.vue = {
    data:{
                                    
    },
    funcFilters:function($t){
        return {
            limitName:$t.main$m.limitName//取 MGMember methods
        };
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){ 
        return {
            mbinfoVue:$t.import("@temp/MGMB/MBList/mbinfo")//會員資訊
            .exportVue({
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t.main$m,//指自己
            }),
            }
    },
    methods:{

    }
};

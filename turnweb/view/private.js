this.vue = {
    data:{
                                    
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {
            regConsent:$t.import("@temp/reg/privat")//聲明書
            .exportVue({
                main:$t.main,
            }),
            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{

    }
};

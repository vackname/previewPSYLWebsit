this.vue = {
    data:{
        open:false                           
    },
    init:function($t,$temp){
        $temp();
    },
    temp:function($t){ 
        return {
            regConsent:$t.import("@temp/reg/privat")//聲明書
            .exportVue({
                main:$t.main,
            }),
            }
    },
    methods:{
        openView:function(){
            this.open= !this.open;
        }
    }
};

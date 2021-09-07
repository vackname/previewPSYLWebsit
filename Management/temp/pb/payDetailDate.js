this.vue = {
    data:{
        showUser:false,//注入使用單據 使用者 panel
    },
    funcFilters:function($t){
        return {
            fdate:function(value){
                return pb.reunixDate(value);
            }
        };
    },
    init:function($t,$temp){

    },
    temp:function($t){ 
        return {

            }
    },
    methods:{
        getLang:function(str)
        {//語系設定取得
            return this.main$m.lang.get(str);
        },
        birthday:function(val)
        {//生日換算
            var indate = ((val.birthday==0)?["0","0","0 0:0:0"]:pb.reunixDate(val.birthday).split("/"));
            return ((val.birthday!=0)?(Number(indate[0])-100):0)+"-"+indate[1]+"-"+indate[2].split(' ')[0];//防止1970異常
        }
    }
};

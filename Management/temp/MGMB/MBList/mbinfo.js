this.vue = {
    data:{
        bankImg:[],
        objImg:null,
    },
    init:function($t,$temp){

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
            try
            {
                return this.main$m.langPer.get(str);
            }
            catch(e)
            {
                return "";
            }
        },
        birthday:function(val)
        {
            if(val>0)
            {
                var DateAry = pb.reunixDate(val).split("/");
                return (Number(DateAry[0])-100)+"/"+DateAry[1]+"/"+DateAry[2].split(' ')[0];
            }
            return "-";
        }
    }
};

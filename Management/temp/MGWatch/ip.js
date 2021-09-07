this.vue = {
    data:{
    },
    init:function($t,$temp){

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
        existTime:function(time)
        {//時間計算
           var caulTime = pb.unixReNow()-time;
           if(caulTime/60/60/24>=1)
           {//天
                return "recent "+pb.MoneyFormat(Number(caulTime/60/60/24).toFixed(2))+" Day";
           }
           else if(caulTime/60/60>=1)
           {//hour
                return "recent "+pb.MoneyFormat(Number(caulTime/60/60).toFixed(2))+" Hour";
           }
           else if(caulTime/60>=1)
           {//Minutes
                return "recent "+pb.MoneyFormat(Number(caulTime/60).toFixed(2))+" Minutes";
           }
           else
           {
             return "recent "+pb.MoneyFormat(Number(caulTime).toFixed(2))+" Sec";
           }
        }
    }
};

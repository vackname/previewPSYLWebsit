this.vue = {
    data:{
        catchDay:"today",
        ser:"",
    },
    watch:{
        ser:function(val)
        {//搜尋字串過濾%
            this.main$m.ctr.ser = ((val.replace(/ /g,"")=="")?"%":val);
        },
        catchDay:function(val)
        {//取天單位換算
            var str1= 0;
            var str2= 0;
            var nowTime = pb.unixRe(pb.reunixDate(pb.unixReNow()).split(' ')[0]+" 00:00:00");
            switch(val)
            {
                case "today":
                    str1 = nowTime;
                    str2 = nowTime+24*60*60;
                    break;
                case "%":
                    str1 = nowTime-365*24*60*60;
                    str2 = nowTime+24*60*60;
                break;
                default:
                    str1 = nowTime-(val*1)*24*60*60;
                    str2 = nowTime+24*60*60;
                break;
            }

            this.main$m.ctr.Date1 =str1;
            this.main$m.ctr.Date2 =str2;
        }
    },
    init:function($t,$temp)
    {
        var nowTime = pb.unixRe(pb.reunixDate(pb.unixReNow()).split(' ')[0]+" 00:00:00");
        $t.main$m.ctr.Date1 = nowTime;
        $t.main$m.ctr.Date2 = nowTime+24*60*60;//初始化時間區段
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
        toPostSysModel:function()
        {//前往 postSystem
            this.main$m.main$self.historyModel = false;//入口點樣版
    
        }
    }
};

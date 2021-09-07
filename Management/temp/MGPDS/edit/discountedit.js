this.vue = {
    data:{
        nowYear:[],//今年 年份及之後 create date container us
        nowMonth:[[],[]],//月[時間區段A 時間區段B]
        nowMonthDayMax:[[0,31,28,31,30,31,30, 31,31,30,31,30,31],[0,31,28,31,30,31,30,31,31,30,31,30,31]],//今年月份 1~12 day create date container us    每個月份日[時間區段A 時間區段B]
        nowMonthDay:[[0,0],[0,0]]//日[時間區段A 時間區段B] ex:[[結束日號,開始日號]]
    },
    watch:{
        "EditData.systemdate":function(){//crate date input container
            var nowYear = pb.reunixDate(this.EditData.systemdate).split('/')[0]*1;
            this.nowYear = [];
            this.nowMonth=[[],[]];
            this.nowMonthDay=[[0,0],[0,0]];
    
            for(var n = nowYear; n<=nowYear+1;n++){
                this.nowYear.push(n);//create年
            }
    
        },
        "EditData.inputDiscount":function(){//折扣觸發 檢測 error 
            this.EditData.inputFirst=true;
        },
        "EditData.inputDate.startYear":function(){//時間選擇器初始化 -A
            var nowYear = this.EditData.inputDate.startYear*1;
            var nowYearRunnian = false;
            if(nowYear%4==0 && nowYear%100!=0 || nowYear%400==0)
            {//潤年
                    nowYearRunnian=true;
            }

            this.nowMonth[0]=[];
            if(this.nowYear[0]*1==nowYear)
            {
                var nowMonth = pb.reunixDate(this.EditData.systemdate).split('/')[1]*1;//計算今年剩於哪幾個月份可以選擇
                for(var a = nowMonth; a<=12;a++){
                    this.nowMonth[0].push(a);
                }
            }else{
                for(var a = 1; a<=12;a++){
                    this.nowMonth[0].push(a);
                }
            }

            this.EditData.inputDate.startMonth=0;
            this.EditData.inputDate.startDay=0;
            this.EditData.inputFirst=true;

            this.nowMonthDayMax[0][2]=((nowYearRunnian)?29:28);//潤日
        },
        "EditData.inputDate.startMonth":function(){//時間選擇器初始化 -A
            this.EditData.inputDate.dayMonth=0;
            this.EditData.inputFirst=true;

            //--計算今日時間 號剩餘
            var nowYear = this.EditData.inputDate.startYear*1;
            var systeDate= pb.reunixDate(this.EditData.systemdate).split('/');

            var nowMonth = systeDate[1]*1;
            var nowDay = systeDate[2].split(' ')[0]*1;
            this.nowMonthDay[0]=[0,0];
            if(this.nowYear[0]*1==nowYear && nowMonth == this.EditData.inputDate.startMonth*1)
            {
                this.nowMonthDay[0][0]= this.nowMonthDayMax[0][this.EditData.inputDate.startMonth*1] - nowDay+1;
                this.nowMonthDay[0][1]= nowDay;
            }else{
                this.nowMonthDay[0][0]= this.nowMonthDayMax[0][this.EditData.inputDate.startMonth*1];
                this.nowMonthDay[0][1]= 1;
            }
            this.EditData.inputDate.startDay=0;
        },
        "EditData.inputDate.endYear":function(){//時間選擇器初始化 -B
            var nowYear = this.EditData.inputDate.endYear*1;
            var nowYearRunnian = false;
            if(nowYear%4==0 && nowYear%100!=0 || nowYear%400==0)
            {//潤年
                    nowYearRunnian=true;
            }

            this.nowMonth[1]=[];
            if(this.nowYear[0]*1==nowYear){
                var nowMonth = pb.reunixDate(this.EditData.systemdate).split('/')[1]*1;//計算今年剩於哪幾個月份可以選擇
                for(var a = nowMonth; a<=12;a++){
                    this.nowMonth[1].push(a);
                }
            }else{
                for(var a = 1; a<=12;a++){
                    this.nowMonth[1].push(a);
                }
            }

            this.EditData.inputDate.endMonth=0;
            this.EditData.inputDate.endDay=0;
            this.EditData.inputFirst=true;

            this.nowMonthDayMax[1][2]=((nowYearRunnian)?29:28);//潤日
        },
        "EditData.inputDate.endMonth":function(){//時間選擇器初始化 -B
            this.EditData.inputDate.endDay=0;
            this.EditData.inputFirst=true;

            //--計算今日時間 號剩餘
            var nowYear = this.EditData.inputDate.endYear*1;
            var systeDate=pb.reunixDate(this.EditData.systemdate).split('/');
            var nowMonth = systeDate[1]*1;
            var nowDay = systeDate[2].split(' ')[0]*1;
            this.nowMonthDay[1]=[0,0];
            if(this.nowYear[0]*1==nowYear && nowMonth == this.EditData.inputDate.endMonth*1)
            {
                this.nowMonthDay[1][0]= this.nowMonthDayMax[1][this.EditData.inputDate.endMonth*1] - nowDay+1;
                this.nowMonthDay[1][1]= nowDay;
            }else{
                this.nowMonthDay[1][0]= this.nowMonthDayMax[1][this.EditData.inputDate.endMonth*1];
                this.nowMonthDay[1][1]= 1;
            }
            this.EditData.inputDate.endDay=0;
        },
    },
    funcFilters:function($t){
        return {
            fdate:function(value){//日期
                return pb.reunixDate(value);
            },
            discountFilter:function(value){//折%
                return Math.ceil(value*100)+"%";
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
    }
};

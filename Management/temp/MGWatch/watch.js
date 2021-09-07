this.vue = {
    data:{
                                    
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
        loadingCaul:function(val)
        {//負載計算
            if(val.cpu>0 && val.uptime[2])
            {
                var total=Number(((val.uptime[2]/(val.cpu*val.thread))*100).toFixed(2));
                return total;
            }
            return 0;
        },
        loadingCaul5:function(val)
        {//負載計算-5分鐘平均
            if(val.cpu>0 && val.uptime[0])
            {
                var total=Number(((val.uptime[0]/(val.cpu*val.thread))*100).toFixed(2));
                return total;
            }
            return 0;
        },
        loadingCaul10:function(val)
        {//負載計算-10分鐘平均
            if(val.cpu>0 && val.uptime[1])
            {
                var total=Number(((val.uptime[1]/(val.cpu*val.thread))*100).toFixed(2));
                return total;
            }
            return 0;
        },
        loadingStatusColor:function(val)
        {//負載計算-顏色
            var str="#CCC";//死機 or 停止
            if(val.cpu>0 && val.uptime[2])
            {
                var total=Number(((val.uptime[2]/(val.cpu*val.thread))*100).toFixed(2));
                if(total<20)
                {
                    str='#009100';
                }
                else if(total<70)
                {
                    str='#FFD306';
                }
                else  if(total<90)
                {
                    str='#FF3300';
                }
            }
            return str;
        },
        loadingStatus:function(val)
        {//負載計算-圖示
            var str="stop";//死機 or 停止
            if(val.cpu>0 && val.uptime[2])
            {
                var total= Number(((val.uptime[2]/(val.cpu*val.thread))*100).toFixed(2));
                if(total<20)
                {
                    str='loading_0.png';
                }
                else if(total<70)
                {
                    str='loading_20.png';
                }
                else  if(total<90)
                {
                    str='loading_20.png';
                }
            }
            return str;
        },
        processType:function(val)
        {//process 分屬
            var img=['database.png','application.png','servies.png','VM.png'];
            return img[val.order];
        },
        MemoryGB:function(val)
        {//KB to GB
           return ((val.memoryKB>0)?pb.MoneyFormat((val.memoryKB/1024/1024).toFixed(2)):0);
        }
    }
};

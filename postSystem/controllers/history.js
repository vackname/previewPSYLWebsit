//data bind (self.data)
self.data = {
        list:[],//歷史資料
        pageTagetNu:-1,//目前選擇頁碼
        ctr:{
                ser:"%",
                Date1:0,
                Date2:0,
        },
};

self.tsc = ["model/historyTsc"];//typescript model import

self.completed = function($t,tscAry){
        $t.$m = tscAry[0];
};
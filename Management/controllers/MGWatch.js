//data bind (self.data)
self.data = {
        ApList:[],//取得各站台名稱
        watchList:[],//站台資訊 list
        lockAP:[],//取進入護站台ap name array<string>
        server:"",//偵聽server
        serverList:[],//server選擇器container
        stopLB:[],//被停用loading blance ip
        LBServer:[],//loading blance ip
        proxlisten:false,//是否已開啟偵聽線路模式
        ipList:[],//當前進入 Ip list
        IPtotal:0,//當前使用人數
        ipLockList:[],//鎖IP設定list
};

self.tsc=["model/MGWatch"];

self.completed = function($t,tscAry)
{
     $t["$m"] = tscAry[0];
     pb.v($t.mainTemp,"head_temp").async(function(e)
     {//初始化
             if(e.chiefSysLevel())
             {
                $t.$m.s.init();
             }
             $t.$m.ip.init();
     });
};

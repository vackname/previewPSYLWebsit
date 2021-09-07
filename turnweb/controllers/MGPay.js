
self.data = {
   history:[],
   statusfilter:[],//支付狀態
   typefilter:[]//支付類別   
};

self.tsc=["model/MGPay"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
};
       
﻿//data bind (self.data)
self.data = {
    list:[],//活動

};
self.tsc=["model/MGActivity"];
self.completed = function($t,tscAry)
{
        $t["$m"] = tscAry[0];
        $t.$m.main.serData(true);//初始化搜尋
};

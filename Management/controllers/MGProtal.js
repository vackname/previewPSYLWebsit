//data bind (self.data)
self.data = 
{
        story:{
                list:[],
                ser:'',//搜尋關鍵字
        },
        pDM:{
                list:[],
                ser:'',//搜尋關鍵字
        }
};
self.tsc=["model/MGProtal"];

self.completed = function($t,tscAry)
{
     $t["$m"] = tscAry[0];
};
self.data = {
     datalist:[],//文章list
     newsctcs:[],//顯示分類名list edit us
     newsctcsSec:[],//顯示細項 select input
};
self.tsc=["model/MGNews"];
self.completed = function($t,tscAry)
{
     $t["$m"] = tscAry[0];
};
self.data={
        searchTxt:"",
        newsList:[],//內站新聞
        newsccList:[],//內站採踩
        pcarList:[],//內站商品
        storyList:[],//伴空間
        productList:[],//Host news
        searchResult:[],//一般搜尋 結果list
        pcarList:[],//市集
        pcarImg:null,//市集圖片容器
        acList:[],//伴空間活動
        story:{
            list:[], 
        },
        pDM:{
            list:[],
        }
    };

self.tsc=["model/indexPage"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
};
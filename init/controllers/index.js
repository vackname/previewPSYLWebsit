self.data = {
        searchTextBox:"",//搜尋關鍵字
        tagbag:[],//標籤背包
        head:{
            headopen:false,
            productCar:[],//購物車資訊
            mbLevelNameList:[],//系統MB leve name
            singCK:false,
            mbdata:{
                iat:0,
                name:"",
                account:"",
                uid:"",
                get:0,
                status:"",
                level:0,
                tp:0,
                profit:0,//營業站成
            },
            firstHome: false,
        },
        foot:{},
        login:{
            catchload:false,
            code: "",//登入驗證碼
            input:{
                id:"",
                pw:"",
                code:"",
            },
            img:null
        }
};

self.tsc = ["model/indexTsc"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    pb.v($t,"head_temp").async(function(e)
    {
        if(localStorage.getItem("productCar") !=null)
        {//取得cookie 購物車
            e.productCar = JSON.parse(localStorage.getItem("productCar") );
        }
    })
};
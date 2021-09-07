self.data = {
        product:{//商品格式建立 set get-編緝(key 命名 定義 參閱/model/MGPDStsc/pubExtendCtr-> pCtr)
                key:"",
                ybe:"",
                ybeInput:"",
                langAry:[],
                type:0,
                class:0,
                fee:0,
                store:0,//限使用 商店、線上
                nameAry:[],
                cash:0,
                unitAry:[],
                Count:0,
                pckey:null,
                pctkey:null,
                set:false,//true=套食
                imgAry:[],
                descriptionAry:[],//備註
                imgfile:null,
                uploadImg:[],//show upload img 待上傳
                shunit:0,//容器單
                mark:"",
                mbname:"",//店舖名
                approve:"",//審核失敗備註
                codekey:"",//審核code
                appck:false,
                typeCtr:0,//注購get set 有無限庫存
        },
        storedatalist:[],//store 使用分類 select
        discountList:[],//正在起用折扣
        productcs:[],//顯示商品分類名list edit us
        productcsSec:[],//顯示商品細項 select input
        dataList:[],//商品搜尋陣列
        productTypeList:[],//庫存type list
};

self.tsc=["model/MGPDS"];

self.completed = function($t,tscAry)
{
        $t["$m"] = tscAry[0];
        $t.$m.cl.productClass();//first 分類-初始化
        $t.$m.main.getTypeClassData();//載入商品類別list
};
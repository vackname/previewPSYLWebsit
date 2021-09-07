self.data = {
        data:{//商品格式記錄-編緝
                key:"",
                langAry:[],
                type:0,
                class:0,
                pckey:"",
                pctkey:"",
                store:0,//所屬商店、線上(psyl post system)
                set:false,
                nameAry:[],
                cash:0,
                unitAry:[],
                Count:0,
                descriptionAry:[],
                mark:"",
                imgAry:[],
                shunit:0,//容積
                langLoad:[],//已載入語系
                QR:null,
           },//複製繼承格式
};
self.tsc=["model/productDetail"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    setTimeout(()=>
    {//載入文章
        if($t.data.key!="")
        {

                $t.$m.main.productLoadImg();
                
        }
    },300);
};
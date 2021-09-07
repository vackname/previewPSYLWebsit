this.vue = {
    data:{
        load:false,
        productImg:null,//圖片容器
        productCar:[],//目前datalist 
    },
    init:function($t,$temp){
        $t.productImg = new Jobj(); 
    },
    temp:function($t){ 
        return {

            }
    },
    methods:{
        reContent:function(val,dataAry,multiple)
        {/** 文碼編緝(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//選擇可開起語系
                return this.main.pub.catchLangName(dataAry).replace(/\r/g, ((multiple)?"<br/>":"")).replace(/\n/g, ((multiple)?"<br/>":""));
            }
            else
            {
                try
                {
                    return dataAry[val.langAry[0]].replace(/\r/g, ((multiple)?"<br/>":"")).replace(/\n/g, ((multiple)?"<br/>":""));
                }
                catch(e)
                {
                    return "(null)";
                }
 
            }
        },
        gotoPay:function()
        {//前往結帳
            if(!this.mainTemp.head.singCK)
            {//秀登入介面 (未登入)
                this.mainTemp.$m.h.urlset.singupView();
            }
            else
            {
                this.mainTemp.$m.h.pc.GoProductPay()
            }
        },
        LangInput:function(str)
        {//page 語系
            return this.main.pub.config.get("input")[str];
        },
        close:function(){
            this.mainTemp.pcarShow = false;
        },
        increase:function(obj)
        {//增加商品
            var _this=this;
            this.mainTemp.$m.h.pc.getProductCar({key:obj.key,count:obj.count},obj.countLimit);
            this.main$m.productCar.forEach(function(val,nu){
                if(val.key==obj.key){
                    obj.count = val.count;
                    pb.v(_this.main$m.mainTemp,'pcview').async((e)=>
                    {
                        pb.v(e,"productTemp").async((e2)=>
                        {//商城數量upadte
                            e2.dataList.forEach(function(val2,nu2)
                            {
                                if(val2.key==obj.key){
                                    val2.count = val.count;
                                }
                            });
                        });
                    });
                }
            });
        },
        decrease:function(obj)
        {//減少商品
            var _this=this;
            this.main$m.mainTemp.$m.h.pc.DelProductCar({key:obj.key,count:obj.count});
            this.main$m.productCar.forEach(function(val,nu){
                if(val.key==obj.key){
                    obj.count = val.count;
                    pb.v(_this.main$m.mainTemp,'pcview').async((e)=>
                    {
                        pb.v(e,"productTemp").async((e2)=>
                        {//商城數量upadte
                            e2.dataList.forEach(function(val2,nu2)
                            {
                                if(val2.key==obj.key){
                                    val2.count = val.count;
                                }
                            });
                        });
                    });
                }
            });
        },
        removePC:function(obj)
        {//移除商品
            this.main$m.mainTemp.$m.h.pc.cancelProduct(obj.key);
        }
    }
};

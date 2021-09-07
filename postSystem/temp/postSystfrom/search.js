this.vue = {
    data:{
                                    
    },
    init:function($t,$temp){
        $t.main$m.$m.ser.giftList();//取得推薦select list
        $t.main$m.$m.ser.ptypeclassList();//商品分屬、庫存屬性 放入
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        getLang:function(str)
        {
            return this.main$m.getLang(str);
        },
        setCK:function()
        {//是否為套餐搜尋
            this.data.filter=((this.main$m.stepPanel!=4)?(!this.data.filter):false);
        },
        prdClass:function()
        {//app、實體、虛擬 class分類-搜尋類別展示
            var $t = this;
            var getnameArray=[];
            this.data.ptypeclassList.c
            .forEach(function(val,nu){
                if(val.val ==  $t.data.peclass)
                {
                    getnameArray=val.nameAry;
                }
            });
            return $t.main.pub.catchLangName(getnameArray);//語系名
        },
        toHistoryModel:function()
        {//前往歷史訂單查詢
            this.main$m.main$self.historyModel = true;//入口點樣版
        }
    }
};

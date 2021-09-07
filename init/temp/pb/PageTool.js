this.vue = {
    data:{
        pageNu:0,//成員 page number
        pageCount:0//total page            
    },
    init:function($t,$temp){

    },
    temp:function($t){ 
        return {

            }
    },
    methods:{
        runAction:null/*外接 選頁後運行function */,
        choosePage:function(pageNu)
        {//選擇page
            if(this.pageCount>this.PageNumber(pageNu)){
                var ckReAction = this.pageNu != this.PageNumber(pageNu);
                this.pageNu = this.PageNumber(pageNu);
                if(this.runAction!=null && ckReAction){
                    this.runAction();//更新
                }
            }
        },
        PageNumber : function(nu)
        {//page number 運算
         return   nu + Math.floor((this.pageNu+1)/10) * 10 + 
         (((this.pageNu+1)%10<=2 && this.pageNu>=9)?-3:0);// 頭尾
        },
        PageIncrease : function()
        {//增加頁碼
            if(this.pageNu+1<this.pageCount){
                this.pageNu++;
                if(this.runAction!=null){
                    this.runAction();//更新
                }
            }
        },
        PageDecrease : function()
        {//減少頁碼
            if(this.pageNu>0)
            {
                this.pageNu--;
                if(this.runAction!=null){
                    this.runAction();//更新
                }
            }
        }
    }
};

this.vue = {
    data:{
        titleSaveNuAry:[],//被嵌入儲存框架
        docSaveNuAry:[],//被嵌入儲存段落框架
        NewsCtr:{//文章框架 get sit 宣告
            /** 
             * DB:主鍵 key */
            key:"",
            /** 
             * json:語系起用 list */
            langAry:[],
            /** 
             * DB:審核代號 */
            codekey:"",
            /** 
             * DB:之前文章 enum docType */
            btp:0,
            /** 
             * DB:之前文章 主鍵 key */
            bkey:"",
            /** 
             * DB:後續文章 主鍵 key */
            fkey:"",
            /** 
             * DB:後續文章 enum docType */
            ftp:0,
            /** 
             * DB:隱藏 */
            display:false,
            /** 
             * json:title list */
            titleAry:[],
            /** 
             * json:延申閱讀 短網址OR 網址引用 list */
            readPathAry:[],
            /** 
             * json:顯示分類first key */
            nctkey:"",
            /** 
             * DB:分類名 二次分類 key */
            nckey:"",
            /** 
             * json:其它標籤 doc path limit 9 */
            mdocAry:[],
            /** 
             * json:新聞內容 doc path */
            docAry:[],
            uid:"",
            /** 
             * DB:create 時間 */
            date:0,
            /** 
             * DB:發佈 新聞 0=未發佈 負值為收回發佈 date=發佈時間 */
            publish:0,
            /** 
             * DB:備註 */
            mark:"",
            /** title 是否資料更動 */
            update:false,
            /** 標籤 是否資料更動 */
            LABELupdate:false,
            /** 其它標籤 是否資料更動 */
            EVENTLABELupdate:false,
            /** 目前已載入語系 */
            langLoad:[],
            /** 編緝模式 */
            edit:false,
            /** 是否已載入文章(語系) */
            loadDoc:{},
            /** 之前文章載入 temp */
            bshow:false,
            /** 載入之前文章 */
            bContent:null,
            /** 後續文章載入 temp */
            afshow:false,
            /** 載入後續文章 */
            afContent:null,
        },
    },
    init:function($t,$temp){

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
    methods:
    {
        prgoressDegress:function()
        {//統計完成
            var countCK=0;
            this.titleSaveNuAry.forEach(function(val,nu){
                if(val.ck)
                {
                    countCK++;
                }
            });

            this.docSaveNuAry.forEach(function(val,nu){
                if(val.ck)
                {
                    countCK++;
                }
            });
            return countCK;
        },
        imgShow:function(newsObj)
        {//顯示上傳運算view
            var show=false;
            newsObj.forEach(function(val,nu)
            {
                val.imgfileAry.forEach(function(val1,nu1){
                    if(val1.upsize!=val1.uptotalsize && !val1.over)
                    {
                        show=true;
                    }
                });
            });
            return show;
        }
    }
};

this.vue = {
    data:{
        action:false,//動畫是否起動
        step:-1,//PSyl Step Nu    
        stepAry:["PSYL Vue.js Create Project/創建專案","PSYL Vue.js Create MVC View/創建 MVC View","PSYL Vue.js Create event View/創建 event View","PSYL Vue.js Create Model/創建模組","PSYL Vue.js MVVM",
        "PSYL Vue.js combine PSYL DBconfig","PSYL Vue.js Mapping DB Table","Bundle relase/封裝 relase","Cliet Input of Init/初始化","DB Connection/Calculation","Oputput UI/顯示UI"],
        psylimporttb:-1,//psyl tool import tsc
        bundlePsyl:-1,//psyl combine
        bundleRelease:-1,//封裝階段
        psylJSLoad:-1,//開始載入psyl.js
        psylDBConnection:-1,//DB 資料處理
        psylVueUI:-1,//UI 開始渲染
        AllRun:false,//動畫全部演示
    },
    init:function($t,$temp){

    },
    temp:function($t){
        return {

            }
    },
    tsc:[],
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        imgSrc:function(src)
        {//圖片注冊
            return this.main$m.imgPsyl.src(src);
        }
    }
};

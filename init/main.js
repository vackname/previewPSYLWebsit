import start from "@view/index";
var spUrl = window.location.pathname.split('/');//取網址

new psylVue(start)//import 入口點
.getData({
    init:{//共用資訊
        pub:importLoad.pub,//共用 libary 注入
        page:"",//目前位於子頁code(子標題名)
        urlName:((spUrl.length>=2)?spUrl[1]:""),//進入專案(init project us)
        spUrl:spUrl,//網址路徑名
    }
})
.getIcon(function($t){//注入網頁icon
    return $t.init.pub.lib.src('inlayout.ico');
})
.getHeadTitle("init.page",//資料切換觸發 key
function($t){//browser page html title name
    return $t.init.pub.config.get("title")+"-"+$t.init.pub.config.get("page")[$t.init.page];//html title name
})
.load(function($t){
    return {
        main:$t.init//注入共用入口點數據
    };
});
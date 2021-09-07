this.vue = {
    data:{
        showContent:false,
        img:null//圖片容器
    },
    init:function($t,$temp){
        $t.img= new Jobj();
        $t.img.loadlib("indexProtalAbout",function(e){//載入img
        });
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
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        },
        goAboutStory:function()
        {//前往合氣禾秝故事
            this.mainTemp.$m.h.tur.goaboutStory();
        },
        goMGactivity:function()
        {//前往伴空間頖頁
            this.mainTemp.$m.h.ac.GoIndex();
        }
    }
};

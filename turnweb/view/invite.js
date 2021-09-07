this.vue = {
    data:{
        runFirst:true,
        invateImg:null,//輪播圖檔容器
        indexNu:0,//輪播號
        stop:0,//手動切換暫停動畫
        Ary:["a1.jpeg","a2.jpeg","a3.jpeg","a4.jpeg","a5.jpeg","a6.jpeg","a7.jpeg","a8.jpeg"],//邀約輪播
       Img:null,//ig facebook line google  
       imgload:false,
    },
    init:function($t,$temp){
        $t.Img= new Jobj();
        $t.Img.loadlib("Invite",function(e){//載入img
            $t.imgload=true;
        });
    },
    temp:function($t){
        return {

            }
    },
    tsc:["animateModel/invite"],
    completed:function($t,tscAry,$temp)
    {
        $t.$an=tscAry[0];//注入 animates
        $t.$an.main.inviteImg();
    },
    methods:{
        Left:function()
        {//位移 左
            this.stop=2;
            if(this.indexNu-1>=0)
            {
                this.indexNu--;
            }
            else
            {
                this.indexNu= this.Ary.length-1;
            }
        },
        Right:function()
        {//位移 右
            this.stop=2;
            if(this.indexNu+1<this.Ary.length)
            {
                this.indexNu++;
            }
            else
            {
                this.indexNu = 0;
            }
        },
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        }
    }
};

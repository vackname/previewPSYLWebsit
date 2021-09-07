this.vue = {
    data:{
       runFirst:true,
       stopGood:0,//手動切換暫停動畫
       goodAry:["a1.png"],//共好輪播
       goodAryWait:["a2.png"],//共好輪播圖片緩載
       goodAryWait2:["a3.png","a4.png"],//共好輪播圖片緩載
       goodAryWait3:["a5.png","a6.png"],//共好輪播圖片緩載
       goodAryWait4:["a7.png","a8.png"],//共好輪播圖片緩載
       goodImg:null,//共好容器
       indexGoodNu:0,//輪播編號
       setAryWait:['content.png','content2.png','content3.png'],//理念、餐
       setAry:["setbag.jpg","setbox.jpg","tea.jpeg"],//理念、餐 緩載
       setAryWait2:['food.png','food2.png','menu1.png','menu2.png','UBER.png','getSet.png','FoodPAND.png'],//理念、餐 緩載
       setImg:null,//理念、餐
       openPage1:true,
       openPage2:true,
       inviteImg:null,//合夥聯絡資訊img
       inviteimgload:false,//合夥聯絡資訊img load complete
    },
    init:function($t,$temp)
    {
        $temp();
    },
    temp:function($t){
        return {

            }
    },
    tsc:["animateModel/aboutStory"],
    completed:function($t,tscAry,$temp)
    {
        if($t.runFirst)
        {
            $t.runFirst=false;
            $t.$an=tscAry[0];//注入 animates
            $t.$an.g.goodImg();
            setTimeout(function(){
                $t.$an.s.setImg();
            },500);
        }
    },
    methods:{
        goodLeft:function()
        {//共好圖片位移 左
            this.stopGood=2;
            if(this.indexGoodNu-1>=0)
            {
                this.indexGoodNu--;
            }
            else
            {
                this.indexGoodNu = this.goodAry.length-1;
            }
        },
        goodRight:function()
        {//共好圖片位移 右
            this.stopGood=2;
            if(this.indexGoodNu+1<this.goodAry.length)
            {
                this.indexGoodNu++;
            }
            else
            {
                this.indexGoodNu = 0;
            }
        }
    }
};

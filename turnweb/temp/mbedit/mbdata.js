this.vue = {
    data:{
        showAbout:false,
        imgload:true,//照片是否已載入  
        first:true,//語系切換自動進入function(躲避first)
    },
    watch:{
        "main.pub.lang":function(val)
        {//語系切換取文章
            if(this.mainTemp.useAppLevel())
            {//vip or 付費使用者
                var _this=this;
                if(_this.main$m.langLoad.indexOf(_this.main.pub.lang)==-1 &&  this.first)
                {/** 阻止已曾經載入語系 */
                    _this.main$m.langLoad.push(_this.main.pub.lang);
                    _this.main$m.$m.mb.catchStory();
                }
                this.first=false;
            }
        }
    },
    init:function($t,$temp){
        $t.main$m.$m.mb.mbdata();
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {

    },
    methods:{
        langGet:function(str)
        {
            return this.main$m.lang.get(str);
        },
        opeImageFile:function()
        {//open fileuplad image view
            pb.el.id('memberEditfile').get.click();
        },
    }
};

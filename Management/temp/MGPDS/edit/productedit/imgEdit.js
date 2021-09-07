this.vue = {
    data:{
      chooseImg:[],//選擇刪除圖片               
    },
    init:function($t,$temp){
        $t.chooseImg=[];
        $t.main$m.$m.mainp.loadImg($t.EditData.val);
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
        close:function()
        {//關閉視窗
            this.pe.imgEditShow = false;
        },
        chooseImgDel:function(val)
        {/*選擇刪除圖片*/
            if(this.chooseImg.indexOf(val)==-1)
            {
                this.chooseImg.push(val);
            }
            else
            {//remove
                var _this=this;
                var newChoose =[];
                this.chooseImg.forEach(function(val1,nu1){
                    if(val!=val1)
                    {
                        newChoose.push(val1);
                    }
                });
                this.chooseImg = newChoose;
            }
        },
        opeImageFile:function()
        {//open fileuplad image view
            pb.el.id('productImgEditfile').get.click();
        },
    }
};

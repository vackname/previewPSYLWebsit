this.vue = {
    data:{
        load:false,//正在載入
        open:false,
        discountlist:[],//折扣設定 array
        systemdate:0,//取得系統時間
        inputDiscount:0,//折扣選擇器
        showPage:"product",//product、discount(設定選擇器)
        inputFirst:false,//是否為折扣設定第一次
        inputDate:{//時間選擇器
            startYear:0,
            startMonth:0,
            startDay:0,
            startHour:0,
            endYear:0,
            endMonth:0,
            endDay:0,
            endHour:0
        },
        obj:{//商品格式記錄-編緝
            key:"",
            ybe:"",
            ybeInput:"",
            langAry:[],
            type:0,
            class:0,
            fee:0,
            pckey:"",
            pctkey:"",
            store:0,//所屬商店、線上(psyl post system)
            set:false,
            nameAry:[],
            cash:0,
            unitAry:[],
            Count:0,
            descriptionAry:[],
            mark:"",
            codekey:"",//審核代號
            approve:"",//審核異常通知
            imgAry:[],
            imgfile:null,//圖檔upload
            shunit:0,//容積
            langLoad:[],//已載入語系
       },//複製繼承格式
    },
    watch:
    {
        "main.pub.lang":function()
        {//語系切換取商品描述
            if(this.obj.key!="")
            {
                if(this.val.langLoad.indexOf(this.main.pub.lang)==-1)
                {/** 阻止已曾經載入語系 */
                    this.val.langLoad.push(this.main.pub.lang);
                    this.main$m.$m.main.loadDoc(this.val);
                }
            }
        }
    },
    init:function($t,$temp)
    {
        $temp();
    },
    temp:function($t){
        return {
                discounteditcreatetool:$t.import("@temp/MGPDS/edit/discountedit")//create 折 tool
                .exportVue({EditData:$t,//指自己
                    mainTemp:$t.mainTemp,//指 edit self
                    main$m:$t.main$m,
                    main:$t.main}),
                productset:$t.import("@temp/MGPDS/edit/productedit").//設定商品
                exportVue({EditData:$t,//指自己
                    mainTemp:$t.mainTemp,//指 edit self
                    main$m:$t.main$m,
                    main:$t.main}),
                addPSOP:$t.import("@temp/MGPDS/edit/addProductSetOP")//套餐 list
                .exportVue({EditData:$t,//指自己
                    mainTemp:$t.mainTemp,//指 edit self
                    main$m:$t.main$m,
                    main:$t.main}),
            };
    },
    methods:{
        resetDateContainerInput:function()
        {//重置時間選擇器
            this.inputDate.startYear = 0;
            this.inputDate.startMonth = 0;
            this.inputDate.startDay = 0;
            this.inputDate.startHour = 0;
            this.inputDate.endYear = 0;
            this.inputDate.endMonth = 0;
            this.inputDate.endDay = 0;
            this.inputDate.endHour =0 ;  
            this.inputDiscount = 0;
            $t=this;
            setTimeout(function(){//因渲染 而mark為起動(wait rest) 
                $t.inputFirst = false;
            },100);
        },
        ViewOpen:function()
        {//view init
            this.resetDateContainerInput();
            this.showDiscount = false;
            this.objView=false;
            this.open=true;
            this.main$m.$m.pos.dataListAction(this.obj.key);
        },
        close:function()
        {
            this.open=false;
            window.scroll(0, this.main$m.scrolltop);//位移至定位畫面
        },
        getYoutube:function(val)
        {//新增Youtube url
            val.ybe=this.main$m.$an.char.YoutubeChar(val.ybeInput);
            this.main$m.$m.main.editDocVideoYoutube(val);
        },
        cancelYoutube:function(val)
        {//取消youtube
            var _this = this;
            this.mainTemp.viewConfirm("Remove?",function()
            {
                val.ybe="";
                _this.main$m.$m.main.editDocVideoYoutube(val);
            },null,this.main.pub.lib.src('delete.png'));
        }
    }
};

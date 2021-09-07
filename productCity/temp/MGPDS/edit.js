this.vue = {
    data:{
        load:false,//正在載入
        open:false,
        systemdate:0,//取得系統時間
        inputDiscount:0,//折扣選擇器
        showPage:"product",//product、discount(設定選擇器)
        inputFirst:false,//是否為折扣設定第一次
        obj:{//商品格式記錄-編緝
            key:"",
            ybe:"",
            ybeInput:"",
            langAry:[],
            type:0,
            fee:0,
            class:0,
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
            imgAry:[],
            imgfile:null,//圖檔upload
            shunit:0,//容積
            langLoad:[],//已載入語系
            codekey:"",//審核代號
            approve:"",//審核異常通知
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
                productset:$t.import("@temp/MGPDS/edit/productedit").//設定商品
                exportVue({EditData:$t,//指自己
                    mainTemp:$t.mainTemp,//指 edit self
                    main$m:$t.main$m,
                    main:$t.main}),
            };
    },
    methods:{
        ViewOpen:function()
        {//view init
            this.showDiscount = false;
            this.objView=false;
            this.open=true;
        },
        close:function()
        {
            this.open=false;
            window.scroll(0, this.main$m.scrolltop);//位移至定位畫面
        },
        langP:function(str)
        {//編緝商品語系
            return this.main$m.langP(str);
        },
        langM:function(str)
        {//編緝商品語系
            return this.main$m.langM(str);
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
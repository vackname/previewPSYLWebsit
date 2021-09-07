this.vue = {
    data:{
        imgPsyl:null,//psyl bundle/DBconfig img 容器
        openAry:[false,false,false,false,false,false,false,false,false,false,false],
        load:false,
        img:null,//動畫容器
        imgVideo:null,//影片button控項img 容器
        MYimg:null,//個人照容器
        MYimgAry:["yii.png","a1.png","a1.jpg","u.jpg","a2.jpg","a3.jpg","a4.jpg","a5.jpg","a6.jpg","a7.jpg","a8.jpg","a9.jpg","a10.jpg","a11.jpg","a12.jpg","a13.jpg","a14.png"],//個人照
        myVideo:[
            {
                id:"MYvideoBank",//python 銀行爬蟲演示
                play:"",//播放button圖檔
                sound:"",//聲音圖檔
                url:"",
                api:"imgbank",
                percentage:0,
                d:0,
                c:0
            },
            {
                id:"MYvideoLB",//loading blance
                play:"",//播放button圖檔
                sound:"",//聲音圖檔
                url:"",
                api:"imgloadblance",
                percentage:0,
                d:0,
                c:0
            },
            {
                id:"MYvideoLBupdate",//loading blance 更新方法
                play:"",//播放button圖檔
                sound:"",//聲音圖檔
                url:"",
                api:"imglbupdatepj",
                percentage:0,
                d:0,
                c:0
            },
            {
                id:"MYvideoEppt",//電子學教案建議PPT 4-1-1 m3u8 影片
                play:"",//播放button圖檔
                sound:"",//聲音圖檔
                url:"",
                api:"imgvideoeppt",
                percentage:0,
                d:0,
                c:0
            },
            {
                id:"MYvideoE",//電子學結案PDF 6-3-1 m3u8 影片
                play:"",//播放button圖檔
                sound:"",//聲音圖檔
                url:"",
                api:"imgvideoepdf",
                percentage:0,
                d:0,
                c:0
            }
        ]
    },
    init:function($t,$temp)
    {
        $t.MYimg = new Jobj();
        $t.imgVideo = new Jobj();
        $t.imgVideo.loadlib("selfVideo",function(e){//載入img Video ctr button
            var proto = window.location.protocol.split(":")[0];//通訊協定
            var host = window.location.host;//切換域名

            importLoad.m.js.hls(function(e1){//hls 直播載入模組
                
                setTimeout(function(){
                    $t.myVideo.forEach(function(val,nu){
                        val.url = proto+"://"+host+"/"+val.api+"/output.m3u8";//create video
                        var video = pb.el.id(val.id).get;
                        pb.el.id(val.id).on('timeupdate',function(media)
                        {//video time progress bar
                            var percentage = Math.floor((100 / media.get.duration) *media.get.currentTime);
                            val.percentage=percentage/100;
                            val.d=Math.ceil(media.get.duration);
                            val.c=Math.ceil(media.get.currentTime);
                        });
                        pb.el.id(val.id).controls = false;//取消控制bar
                        if(Hls.isSupported())
                        {
                            var hls = new Hls();//銀行
                            hls.attachMedia(video);
                            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                                hls.loadSource(val.url);
                                video.volume=1;//音量
                                video.muted=false;
                                video.paused = true;
                                //video.play();//播放
                                video.pause();//暫停
                            });
                        }
                        else
                        {
                            video.volume=1;//音量
                            video.muted=false;
                            video.paused = true;
                            video.pause();//暫停
                        }
                        val.play = $t.imgVideo.src((!video.paused?'stop.png':'play.png'));
                        val.sound = $t.imgVideo.src((video.muted)?'sound_off.png':'sound_on.png');
                    });
                },100);

                setTimeout(function()
                {//等候3秒才開始載入
                    //---個人照片載入
                    var catchImg = JSON.stringify($t.MYimgAry);
                    $t.MYimgAry = [];
                    //緩儲圖片容器
                    $t.MYimg.loadimgjson("/imgmystory")//載入圖片
                    .input(JSON.parse(catchImg))
                    .async(function(e3,next3)
                    {
                        e3.forEach(function(val3,nu3)
                        {
                            $t.MYimgAry.push(val3);
                        });
                        /** 匹次載圖 */
                        let reNext = function(re)
                        {       
                            //圖片載入完成 imglist
                            if(re!=null)
                            {
                                re(function(e4,next4)
                                {
                                    e4.forEach(function(val3,nu3)
                                    {
                                        $t.MYimgAry.push(val3);
                                    });
                                    reNext(next4);
                                });
                            }
                        }
                        reNext(next3);
                    });
                    //---個人照片載入end
                },3000);
            });
        });
    },
    temp:function($t){
        return {
            psylModelVue:$t.import("@temp/index/author/psylModel")//psyl 模組說明
            .exportVue({//繼承 data
                main:$t.main,
                main$m:$t,//取得宣告專案入口點 us
                mainTemp:$t.mainTemp
            }),
            meAnVue:$t.import("@temp/index/author/meChart")//能力歷程Chart
            .exportVue({//繼承 data
                main:$t.main,
                main$m:$t,//取得宣告專案入口點 us
                mainTemp:$t.mainTemp
            })
        };
    },
    tsc:["animateModel/index/author"],
    completed:function($t,tscAry,$temp)
    {
        $t["$an"] = tscAry[0];//註冊 animate model
        
        $t.img = new Jobj();
        $t.img.loadlib("self",function(e){//載入img
            $t.load=true;
            $t.$an.load();//載入動畫
            $t.$an.run();//起動動畫
            $t.imgPsyl = new Jobj();
            $t.imgPsyl.loadlib("psyl",function(e)
            {//載入img psyl bundle/DB config 說明 img
                $temp();
            });
        });
    },
    methods:{
        openClick:function(nu)
        {
            this.openAry[nu]=!this.openAry[nu];
            var toAry=[];
            this.openAry.forEach(function(val,nu1)
            {
                toAry.push(val);
            });
            this.openAry=toAry;//reset 重建 get set
        },
        mediaTimeUnit:function(val)
        {//影片時間
            return val.c+"/"+val.d+"&nbsp;Sec";
        },
        PlayTouch:function(my)
        {//播放影片
            var getObj = pb.el.id(my.id).get;
            if(getObj.paused)
            {
                getObj.muted=false;
                my.sound = this.imgVideo.src('sound_on.png');
                getObj.play();//播放
                getObj.paused=false;//播放
            }
            else{
                getObj.pause();//暫停
                getObj.paused=true;
            }
            my.play = this.imgVideo.src((!getObj.paused?'stop.png':'play.png'));
        },
        soundTouch:function(my)
        {//開關靜音
            var getObj = pb.el.id(my.id).get;
            getObj.muted=!getObj.muted;
            my.sound = this.imgVideo.src((getObj.muted)?'sound_off.png':'sound_on.png');
        }
    }
};

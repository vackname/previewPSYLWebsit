this.vue = {
    data:{
        recode:[],//已開啟下載完成記錄
        showName:"",//目前開起view
        ctr:false,
        img:null,//圖片
    },
    watch:
    {
        showName:function(val)
        {
            if(this.recode.indexOf(val)==-1)
            {
                this.recode.push(val);
            }
        }
    },
    init:function($t,$temp){

    },
    temp:function($t){

        return {
            ipVue:$t.import("@temp/MGWatch/ip").exportVue({//ip 監控
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t
            }),
            watchVue:$t.import("@temp/MGWatch/watch").exportVue({//app 監控
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,
            }),
            slaveVue:$t.import("@temp/MGWatch/Slave").exportVue({//負載平衡
                main:$t.main,
                mainTemp:$t.mainTemp,
                main$m:$t,
            }),
        }
    },
    tsc:["animateModel/MGWatch"],
    completed:function($t,tscAry,$temp)
    {
        $t["$an"]=tscAry[0];
        $t.img= new Jobj();
        $t.img.loadlib("watch",function(e)
        {//載入img
            pb.v($t.mainTemp,"head_temp").async(function(e)
            {
                $temp();
                if(e.chiefSysLevel())
                {//最高權限管理者
                    $t.recode.push("watchVue");
                    $t.showName="watchVue";
                    $t.ctr = true;
                }
                else
                {
                    $t.recode.push("ipVue");
                    $t.showName="ipVue";      
                }
            });
        });
    },
    methods:{

    }
};


import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";
import {jObj as jObjM} from "../../../../models/Jobj/interface";
import iLoad from "../../../../models/importLoad";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
    /** psyl oad system */
    importLoad?:iLoad,
}

import pM from "./psyl";
import aM from "./meAnalytics";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),importLoad:eval("importLoad")};
export default class main{
    $t:any;
    /** psyl model 說明 */
    p:pM;
    an:aM;
    constructor($tObj:any) {
        this.$t = $tObj;
        this.p = new pM($tObj,$e);
        this.an = new aM($tObj,$e);
    }

    /** img 載入 */
    load=()=>
    {
        let self:main = this;
        if(!this.$t.load)
        {
            $e.pb.el.id("AAPanel").animate({"duration":0.3,"delay":0,"count":1},
            {//大查帳 觸發動畫 觸發變大(主角)
                "0%":{"opacity":"1"},
                "100%":{"opacity":"0.3"}
            }).frame((e:any)=>
            {
                setTimeout(()=>
                {
                    self.load();
                },20);
            }).remove();;
        }
    }
    /** 動畫運行 */
    run = ()=>
    {
        let self:main = this;
        //frame(func,影格長度-秒,flag 名)
        //animate(動畫基本配置,動畫action細節)= css animate
        //style(css)=css
        //on(觸發事件,引用function)
        //支援度至IE11
        var mclickBook = true;//等後動畫完畢再次被觸發
        $e.pb.el.id("AAPanel").id("meAn").frame((e:any)=>
        {
            e.id("meAn_book").on("click",(a:any)=>
            {
                //a= e.id("meAn_book") =this
                if( mclickBook)
                {
                    mclickBook=false;
                    a.animate({"duration":1,"delay":0,"count":1},
                        {//大查帳 觸發動畫 觸發變大(主角)
                            "from":{"width":"30%","left":"5%","top":"65.1%"},
                            "to":{"width":"40%","left":"0%","top":"60.1%"}
                        }).animate({"duration":2.8,"delay":0,"count":1},
                        {//大查帳 觸發動畫 觸發變淡(副角)
                            "from":{"opacity":"0.7"},
                            "to":{"opacity":"0.4"}
                        });

                        e.id("meAn_bookname").animate({"duration":1,"delay":0,"count":1},
                        {//大查帳 psyl mark 觸發變大 位移(副角)
                            "from":{"width":"3%","left":"31%","top":"78%"},
                            "to":{"width":"4%","left":"34.5%","top":"77.5%"},
                        }).animate({"duration":3,"delay":0,"count":1},
                        {//大查帳 psyl mark 變超大(主角)
                            "0%":{"width":"3%","left":"31%","top":"78%"},
                            "20%":{"width":"20%","left":"11%","top":"78%"},
                            "100%":{"width":"20%","left":"11%","top":"78%"}
                        }).frame((b:any)=>
                        {//animate complete
                            mclickBook=true;
                        });
                }
            });
        });

        var mclickvio = true;//等後動畫完畢再次被觸發
        $e.pb.el.id("meAn").frame((e:any)=>
        {//小提琴
            e.id("meAn_vio").on("click",(a:any)=>
            {
                if(mclickvio )
                {
                    mclickvio =false;
                    a.animate({"duration":1,"delay":0,"count":1},
                    {//旋轉震動
                        "0%":{"transform": "rotateY(0deg)"},
                        "60%":{ "transform": "rotateY(-90deg)"},
                        "62%":{"transform": "rotateY(80deg)" },
                        "90%":{"transform": "rotateY(-90deg)" },
                        "97%":{"transform": "rotateY(80deg)" },
                        "98%":{"transform": "rotateY(-180deg)" },
                        "100%":{"transform": "rotateY(-180deg)"},
                    }).frame((b:any)=>
                    {
                        mclickvio =true;
                    });
                }
            });
        });

        var mclickgx = true;//等後動畫完畢再次被觸發
        $e.pb.el.id("meAn").frame((e:any)=>
        {//傑斯獸
            e.id("meAn_dgx").on("click",(a:any)=>
            {
                if(mclickgx)
                {
                    mclickgx=false;
                    a.animate({"duration":1,"delay":0,"count":1},
                        {//觸發動畫 觸發變大
                            "from":{"width":"8%","left":"43.7%","top":"79.05%"},
                            "to":{"width":"14%","left":"40.7%","top":"76.05%"}
                        }).frame((b:any)=>
                        {
                            mclickgx=true;
                        });
                }
            });
        });

        var mclickCar = true;
        $e.pb.el.id("meAn").frame((e:any)=>
        {//四驅車
            e.id("meAn_car").on("click",(a:any)=>
            {
                if(mclickCar)
                {
                    mclickCar=false;
                    a.animate({"duration":3,"delay":0,"count":1},
                    {//旋轉震動 移動
                        "0%":{"left":"25%","top":"86%","width":"20%","transform": "rotate(70deg)"},
                        "62%":{ "left":"-20%","top":"-20%","transform": "rotate(70deg)" },
                        "63%":{ "left":"-20%","top":"-20%","transform": "rotateY(-180deg)" },
                        "98%":{ "left":"10%","top":"70%","transform": "rotateY(-180deg)" },
                        "100%":{"left":"25%","top":"86%","width":"20%","transform": "rotateY(-180deg)"},
                    }).frame((b:any)=>
                    {
                         mclickCar=true;
                    });
                }
            });
        });

        $e.pb.el.id("meAn").frame((e:any)=>
        {//背景影格
            var shk={//振動
                "0%":{"left":"1%"},
                "10%":{ "left":"0%","top":"1%" },
                "20%":{ "left":"-1%","top":"0%" },
                "30%":{ "left":"1%","top":"1%" },
                "40%":{ "left":"1%","top":"0%" },
                "50%":{ "left":"1%","top":"1%" },
                "60%":{ "left":"0%","top":"0%" },
                "70%":{ "left":"0%","top":"-1%" },
                "80%":{ "left":"1%","top":"1%" },
                "90%":{ "left":"-1%","top":"0%" },
                "100%":{ "left":"0%","top":"-1%" },
            };
            e.id("meAn_bk_wav").animate({"duration":9,"delay":0,"count":"infinite"}
            
            ,shk);//背景 wav 生日

            e.id("meAn_369").animate({"duration":6,"delay":0,"count":"infinite"},shk);//背景369 字樣

            e.id("meAn_body").animate({"duration":3,"delay":0,"count":"infinite"},
            {//me 身體
                "0%":{"width":"100%","left":"0%"},
                "70%":{"width":"95%","left":"2.5%","top":"2.5%"},
                "80%":{"width":"90%","left":"5%","top":"5%"},
                "90%":{"width":"95%","left":"2.5%","top":"2.5%"},
                "100%":{ "width":"90%","left":"5%","top":"5%" },
            });

        })
        .frame((e:any)=>
        {//傑斯獸
            e.id("meAn_dgx_bk").animate({"duration":0.5,"delay":0,"count":"infinite"},
            {//背景晃動
                "0%":{"left":"39%","top":"79%"},
                "10%":{ "left":"39%","top":"79.2%" },
                "20%":{ "left":"38.8%","top":"79%" },
                "30%":{ "left":"39.2%","top":"79.2%" },
                "40%":{ "left":"39.2%","top":"79%" },
                "50%":{ "left":"39.2%","top":"79.2%" },
                "60%":{ "left":"39%","top":"79%" },
                "70%":{ "left":"39%","top":"78.8%" },
                "80%":{ "left":"39.2%","top":"78.8%" },
                "90%":{ "left":"38.8%","top":"79%" },
                "100%":{ "left":"39%","top":"78.8%" },
            });
        })
        .frame((e:any)=>
        {//狗狗
            var animateSet = {"duration":9,"delay":0,"count":"infinite","timing":"ease"};
            var animateAction = {//轉動
                "0%":{"transform":"rotate(0deg)"},
                "95%":{"transform":"rotate(10deg)"},
                "98%":{"transform":"rotate(-10deg)"},
                "100%":{"transform":"rotate(10deg)"},
            }
            e.id("meAn_dog_1").animate(animateSet,animateAction);
            e.id("meAn_dog_2").delay(2).animate(animateSet,animateAction);
            e.id("meAn_dog_3").delay(6).animate(animateSet,animateAction);
        })
        .frame((e:any)=>
        {//四驅車
            e.id("meAn_car")
            .animate({"duration":3,"delay":0,"count":1},
                {//旋轉震動  移動
                    "0%":{"left":"25%","top":"86%","width":"20%","transform": "rotateY(-90deg)"},
                    "60%":{ "left":"120%","top":"-20%" ,"transform": "rotateY(-90deg)"},
                    "62%":{ "left":"120%","top":"-20%","transform": "rotateY(180deg)" },
                    "90%":{ "left":"70%","top":"70%","transform": "rotateY(180deg)" },
                    "97%":{ "left":"70%","top":"70%","transform": "rotateY(180deg)" },
                    "98%":{ "left":"70%","top":"70%","transform": "rotateY(-180deg)" },
                    "100%":{"left":"25%","top":"86%","width":"20%","transform": "rotateY(-180deg)"},
                }).frame((a:any)=>
                {//complete
                    mclickCar=true;
                })
                .remove();//移除相關css

        })
        .delay(3)//延遲3秒後進行下一影格
        .frame((e:any)=>
        {//me
            e.id("meAn_me")
            .frame((a:any)=>
            {
                a.animate({"duration":2,"delay":0,"count":1},
                {//me 身體
                    "from":{"opacity":"1"},
                    "to":{"opacity":"0.9"}
                }).animate({"duration":2,"delay":0,"count":1},
                {//me 身體
                    "from":{"opacity":"0.8"},
                    "to":{"opacity":"1"}
                })
            },4//此影格 影片長度(秒)
            ,"start")//影格命名
            .toFrame("start",3)//前往 flag 影格名 "start" 運行3次
            .remove();//移除相關css
        });

    };

};


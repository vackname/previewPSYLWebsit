import pbM from "../../../models/pb";
import ajaxM from "../../../models/ajax";
import {jObj as jObjM} from "../../../models/Jobj/interface";
/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}
import indexM from "./index";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),Jobj:eval("Jobj")};
export default class main{
    $t:any;
    main:indexM|undefined
    constructor($tObj:any) {
        this.$t = $tObj;
        this.main = new indexM($tObj,$e);
    }

    /** 圖片匹次載入動畫
     * @param count 20秒後不在等候動畫
     */
    loadImg = (key:string,count:number)=>
    {
        let _this:main=this;

        if($e.pb.el.id(key).exist)
        {
            $e.pb.el.id(key)
            .animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0.1"},
                "100%":{"opacity": "1"},
            }).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                count--;
                _this.loadImg(key,count);
            },20);
        }
    }
    /** 首頁搜尋動畫 */
    search= ()=>
    {
        $e.pb.el.id("searchProtalBox").animate({"duration":3,"delay":0,"count":1},
        {//閃耀動畫
            "0%":{"opacity": "0.3"},
            "20%":{"opacity": "1"},
            "40%":{"opacity": "0.3"},
            "60%":{"opacity": "1"},
            "80%":{"opacity": "0.3"},
            "100%":{"opacity": "1"},
        }).remove();
    }
    /** 謹運行一次 */
    HomeRunFirst:boolean=true;
    /** web home loading 花 */
    HomeLogo=()=>
    {
        let _this:main=this;
        let $t:any=this.$t;
        if($e.pb.el.id("mainLogo").exist)
        {
            if(_this.HomeRunFirst)
            {
                _this.HomeRunFirst=false;

                $e.pb.el.id("HeadContent").id("HeadPanel").animate({"duration":0.5,"delay":0,"count":1},
                {//漸淡動畫
                    "0%":{"opacity": "1"},
                    "100%":{"opacity": "0.1"},
                }).remove();//隱藏head temp 動畫

                $e.pb.el.id("footPanel").id("footContent").animate({"duration":0.5,"delay":0,"count":1},
                {//漸淡動畫
                    "0%":{"opacity": "1"},
                    "100%":{"opacity": "0.1"},
                }).frame((e)=>{

                    $e.pb.el.id("HeadContent").id("HeadPanel").animate({"duration":0.2,"delay":0,"count":1},
                    {//漸顯動畫
                        "0%":{"opacity": "0.1"},
                        "100%":{"opacity": "1"},
                    }).remove();//隱藏head temp 動畫

                })
                .remove();//隱藏foot temp 動畫

                setTimeout(()=>{
                    $e.pb.el.id("mainLogo").animate({"duration":0.1,"delay":0,"count":1},
                    {//閃動畫
                        "0%":{"opacity": "0.3","top":"9px"},
                        "88%":{"opacity": "1","top":"20px"},
                        "100%":{"opacity": "0.1","top":"6px"},
                    }).frame(()=>{
                        $t.load=true;
                        let document = $e.pb.el.id("turnwebPanel").id("indexPage");
                        document.id("pDMPanel").animate({"duration":0.1,"delay":0,"count":1},
                        {//漸顯動畫
                            "0%":{"opacity": "0.2"},
                            "100%":{"opacity": "1"},
                        });

                        document.id("storyPanel").animate({"duration":0.1,"delay":0,"count":1},
                        {//漸顯動畫
                            "0%":{"opacity": "0.2"},
                            "100%":{"opacity": "1"},
                        });
                    });
                },300);
            }
        }
        else
        {
            setTimeout(()=>{ _this.HomeLogo();},100);
        }
    };
};


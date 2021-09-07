import * as pub from "../../../JsonInterface/pub";
import pbM from "../../../models/pb";


/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** 顯示文章提示 連接動畫 model */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
    }

    /** 更多文章鈕動畫 */
    serPage = ()=>
    {
        pb.el.id('MGmoreDocPage').animate({"duration":0.3,"delay":0,"count":1},
        {//click 閃耀
            "0%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "30%":{ "position": "relative","opacity":"1"},
            "62%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "70%":{"position": "relative","opacity":"1" },
            "80%":{"position": "relative","opacity":"0.1","background-color":"#FFEEDD","color":"#FFF"},
            "100%":{"position": "relative","opacity":"1"},
        });
    }

    /** 圖片匹次載入動畫 */
    loadImg = (key:string)=>
    {
        if(pb.el.id('d'+key).exist)
        {
            pb.el.id('d'+key).style({"display":"none"});
        }
        if(pb.el.id(key).exist)
        {
            pb.el.id(key)
            .animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0.1"},
                "100%":{"opacity": "1"},
            }).frame((e)=>{
                if(pb.el.id('d'+key).exist)
                {
                    pb.el.id('d'+key).style({"display":"none"}).remove()
                    .animate({"duration":0.3,"delay":0,"count":1},
                    {//漸顯動畫
                        "0%":{"opacity": "0.1"},
                        "100%":{"opacity": "1"},
                    });
                }
            }).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                self.loadImg(key);
            },20);
        }
    }
}
import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";
import {jObj as jObjM} from "../../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main
{
    $t:any
    constructor($tObj:any) {
        this.$t = $tObj;
    }

    /**
     * 運行動畫
     */
    run=()=>
    {
        let self:any = this;
        $e.pb.el.id("init_mt_wait").animate({"duration":6,"delay":0,"count":1},
        {//維護mark 閃耀
            "0%":{"position": "relative","opacity":"0.2"},
            "30%":{ "position": "relative","opacity":"1"},
            "62%":{"position": "relative","opacity":"1"},
            "70%":{"position": "relative","opacity":"0.2" },
            "80%":{"position": "relative","opacity":"1"},
            "100%":{"position": "relative","opacity":"0.3"},
        }).style({"display":"none"}).delay(9).remove();

        $e.pb.el.id("init_mt_mark").style({"display":"none"}).delay(6).remove();//釘子隱藏
        $e.pb.el.id("init_mt_note").style({"display":"none"}).delay(6).remove();//擊波隱藏


        $e.pb.el.id("init_mt_hammer").animate({"duration":6,"delay":0,"count":1},
        {//錘子
            "0%":{"position": "absolute","opacity":"0.5"},
            "100%":{"position": "absolute","opacity":"0.1"},
        }).frame(e=>{
            $e.pb.el.id("init_mt_note").animate({"duration":6,"delay":0,"count":1},
            {//擊波
                "0%":{"opacity":"0"},
                "3%":{"opacity":"1"},
                "5%":{"opacity":"0.3"},
                "6%":{"opacity":"0"},
                "31%":{"opacity":"0"},
                "32%":{"opacity":"1"},
                "35%":{"opacity":"0.3"},
                "36%":{"opacity":"0"},
                "79%":{"opacity":"0"},
                "80%":{"opacity":"1"},
                "82%":{"opacity":"0.3"},
                "83%":{"opacity":"0"},
                "100%":{"opacity":"0"},
            }).animate({"duration":3,"delay":0,"count":1},
            {//擊波-維持狀態
                "0%":{"opacity":"0"},
                "100%":{"opacity":"0"},
            }).remove();

            $e.pb.el.id("init_mt_mark").animate({"duration":6,"delay":0,"count":1},
            {//釘子
                "0%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "5%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "8%":{"transform":"translate(0%, 0%)  rotate(0deg)","opacity":"1"},
                "12%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "30%":{"transform":"translate(0%, 0%)  rotate(0deg)","opacity":"1"},
                "31%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "35%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "42%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "50%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "53%":{"transform":"translate(0%, 0%) rotate(-10deg)","opacity":"1"},
                "59%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "80%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "81%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "86%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "89%":{"transform":"translate(0%, 5%) rotate(-10deg)","opacity":"1"},
                "90%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
                "100%":{"transform":"translate(0%, 0%) rotate(0deg)","opacity":"1"},
            }).animate({"duration":3,"delay":0,"count":1},
            {//釘子-維持狀態
                "0%":{"opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "100%":{"opacity":"0.3","transform":"translate(0%, 0%) rotate(0deg)"},
            }).remove();

            e.animate({"duration":6,"delay":0,"count":1},
            {//錘子
                "0%":{"position": "relative","opacity":"1","transform":"translate(50%, -20%) rotate(180deg)"},
                "5%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "8%":{"position": "relative","opacity":"1","transform":"translate(20%, 5%)  rotate(70deg)"},
                "10%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "30%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%)  rotate(0deg)"},
                "31%":{"position": "relative","opacity":"1","transform":"translate(50%, -20%) rotate(180deg)"},
                "35%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "37%":{"position": "relative","opacity":"1","transform":"translate(20%, 5%) rotate(70deg)"},
                "38%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "80%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "81%":{"position": "relative","opacity":"1","transform":"translate(50%, -20%) rotate(180deg)"},
                "83%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "100%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
            }).animate({"duration":3,"delay":0,"count":1},
            {//錘子-維持狀態
                "0%":{"position": "relative","opacity":"1","transform":"translate(0%, 0%) rotate(0deg)"},
                "100%":{"position": "relative","opacity":"0.3","transform":"translate(0%, 0%) rotate(0deg)"},
            });


        }).delay(9).frame(e=>{
            setTimeout(()=>{
                self.run();
            },50);
        }).remove();
    }
};


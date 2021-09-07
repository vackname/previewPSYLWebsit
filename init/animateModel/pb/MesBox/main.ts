

import ajaxM from "../../../../models/ajax";
import pbM from "../../../../models/pb";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM
}

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    constructor($tObj:any) {

    }

    /**
     *  顯示動畫 alert
     */
    openAn=()=>{
        $e.pb.el.id("MesBox").animate({"duration":0.1,"delay":0,"count":1},
                {//漸顯動畫
                    "0%":{"opacity": "0.1"},
                    "33%":{"opacity": "0.3"},
                    "66%":{"opacity": "0.5"},
                    "88%":{"opacity": "0.7"},
                    "100%":{"opacity": "0.8"},
                }).remove();//移除動畫
    }

    /** 不重履進入動畫 */
    private getIconAn:boolean=false;
    /**
     *  顯示動畫 alert
     */
    openIconAn=()=>{
        let _this:any=this;
        if(!_this.getIconAn)
        {
            _this.getIconAn = true;
            setTimeout(()=>{
                if($e.pb.el.id("MesIimgIcon").exist)
                {
                    $e.pb.el.id("MesIimgIcon").animate({"duration":2,"delay":0,"count":2},
                        {//漸顯動畫
                            "0%":{"opacity": "0.3"},
                            "33%":{"opacity": "0.8"},
                            "66%":{"opacity": "0.3"},
                            "100%":{"opacity": "0.9"},
                    }).frame((e)=>{
                        setTimeout(()=>{
                            _this.getIconAn = false;
                        },3000);
                    }).remove();//移除動畫
                }
                else
                {
                    _this.getIconAn = false;
                }
            },200);
        }
    }
};


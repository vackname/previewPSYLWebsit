import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import { jObj as jObjM} from "../../../models/Jobj/interface";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
}

import pModel from "./photo";

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    photo:pModel|undefined;
    constructor($tObj:any) {
        this.photo = new pModel($tObj,$e);
    }

    /** 搜尋分類bar 動畫幾示 */
   searchBar = (runStart:Function,runEn:Function)=>
   {
       let _this:any=this;
       if($e.pb.el.id("PCheadTool").exist)
       {
            runStart();
            $e.pb.el.id("pc_i_sertemp")
            .animate({"duration":3,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0.1"},
                "30%":{"opacity": "1"},
                "80%":{"opacity": "1"},
                "100%":{"opacity": "0.1"},
            }).delay(1).remove();//移除動畫

            $e.pb.el.id("PCheadTool")
            .animate({"duration":3,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"top":"0px"},
                "30%":{"top":"50px"},
                "70%":{"top":"50px"},
                "90%":{"top":"-40px"},
                "100%":{"top":"-40px"},
            }).frame(()=>{
                runEn();
                $e.pb.el.id("serBtDroup")
                .animate({"duration":2,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"border": "1px solid #EEE"},
                    "30%":{"border": "3px solid #FF8800"},
                    "70%":{"border": "1px solid #EEE"},
                    "100%":{"border": "3px solid #FF8800"},
                }).remove();//移除動畫    
            }).delay(3).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                _this.searchBar(runStart,runEn);
            },100);
        }
    }
};


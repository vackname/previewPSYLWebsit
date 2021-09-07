import ajaxM from "../../../models/ajax";
import pb from "../../../models/pb";
import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** example model item1 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
    }

    /**
     * 機器偵聽 負載動畫
     */
    loadRuning = (same:string,host:string)=>
    {
        let hostStr:string = host.replace(/\./g,'_').replace(/ /g,'');
        if(pb.el.id('watchload'+same+hostStr).exist)
        {
            if($t.server==host)
            {
                pb.el.id('watchload'+same+hostStr).animate({"duration":2,"delay":0,"count":1},
                {//閃耀動畫
                    "0%":{"opacity": "1"},
                    "33%":{"opacity": "0.5"},
                    "66%":{"opacity": "0.3"},
                    "88%":{"opacity": "0.8"},
                    "100%":{"opacity": "0.6"},
                }).remove();

                pb.el.id('watchloadBG'+same+hostStr).animate({"duration":1,"delay":0,"count":2},
                {//閃耀動畫
                    "0%":{"opacity": "1"},
                    "10%":{"opacity": "0.5"},
                    "40%":{"opacity": "0.3"},
                    "70%":{"opacity": "0.8"},
                    "100%":{"opacity": "0.6"},
                }).remove;

            }

            setTimeout(()=>
            {
                ($t.watchList as Array<any>).forEach((val:any,nu:number)=>
                {
                    if(!val.CloseComplete && val.same+val.host.replace(/\./g,'_').replace(/ /g,'')==same+hostStr)
                    {
                        self.loadRuning(same,host);
                    }
                });
            },2050);
        }
        else
        {
            setTimeout(()=>
            {
                self.loadRuning(same,host);
            },100);
        }
    };

        /**
     * 被偵聽程式 狀態
     */
    processStatustr=(error:jEnum.Enum_processError):string=>
    {
        switch(error){
            case jEnum.Enum_processError.close:
                return "close";
            case jEnum.Enum_processError.format:
                return "catch status error";
            case jEnum.Enum_processError.notcon:
                return "Not connection";
            case jEnum.Enum_processError.ok:
                return "runing";
        }
        return "unknow status";
    }

    /**
     * 顏色判斷
     */
    processStatuColor=(error:jEnum.Enum_processError):string=>
    {
        switch(error){
            case jEnum.Enum_processError.close:
                return "#AAA";
            case jEnum.Enum_processError.format:
                return "#FF8800";
            case jEnum.Enum_processError.notcon:
                return "#666";
            case jEnum.Enum_processError.ok:
                return "#00BB00";
        }
        return "#FF3300";
    }
     
};


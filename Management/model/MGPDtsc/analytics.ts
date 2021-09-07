import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import iLoad from "../../../models/importLoad";

import SSChart from "../../animateModel/MGPDtsc/analytics/SequencesSunburst";

/** 顏色格式 */
interface ColorData
{
    /* 標題名 */
    key:string
    /** color 16進位 */
    val:string
}

/** psyl oad system */
let importLoad:iLoad;
/** temp this */
let $t:any | undefined;
/** load file  */
let Jobj:jObjM;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 分析圖表-商品統計*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        importLoad = $eObj.importLoad;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /**
     * 商品 分類/統計/顏色
    */
    calculatePayDay = ()=>
    {
        let wait:Function = ()=>{
            if($t.YearInput>0){
                Login((x)=>x.post("/mpay/mg/mb/sys/paydaychart").input({year:$t.YearInput,month:$t.MonthInput,langnu:$t.main.pub.langNu}),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        try
                        {
                            pb.v($t,"pChartView").async((ec)=>
                            {
                                ec.color = [];
                                Object.keys(e.color).map(key =>
                                {
                                    ec.color.push({key:key,val:e.color[key]} as ColorData);
                                });

                                if(e.data.length>0)
                                {
                                    importLoad.m.js["d3v4Chart"]((em)=>
                                    {//載入分析chart Model
                                        SSChart(eval("d3"),e.data,e.color);
                                    });

                                    pb.v($t,"pChartView").async((ev)=>{
                                        ev.error=false;
                                    });
                                }
                                else
                                {//統計圖錯誤
                                    pb.v($t,"pChartView").async((ev)=>{
                                        ev.error=true;
                                    });
                                    mt.viewAlert("無法統計！部份商品未分類!",()=>{},$t.main.pub.lib.src('errorMes.png'));
                                }
                            });
                           
                        }catch(e)
                        {

                        }
                    }
                });
            }
            else
            {
                setTimeout(()=>{
                    wait();
                },100);
            }
        }
        wait();
    }
}
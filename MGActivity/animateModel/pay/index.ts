import pbM from "../../../models/pb";
import * as pE from "../../model/pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** main */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
    }

    /** 報名區間、話動日-取年陣列 crate date input container*/
    sysYearDate=function(obj:pE.perCtr)
    {
        //活動日-注冊
        obj.runYear=[];
        obj.runMonth=[];
        obj.runMonthDayMax=[0,31,28,31,30,31,30, 31,31,30,31,30,31];
        obj.runMonthDay=[];

        /** 活動時時間 unix to選擇器 */
        let indate:Array<string> = ((obj.birthday==0)?["0","0","0 0:0:0"]:pb.reunixDate(obj.birthday).split("/"));
        
        let nowYear:number = Number(pb.reunixDate(pb.unixReNow()).split('/')[0]);

        let getNowYear:number=0;
        if(nowYear>Number(indate[0])-100 && obj.birthday!=0)
        {//防止不在年份內
            getNowYear = Number(indate[0])-100;
        }
        else
        {
            getNowYear = nowYear-100
        }

        for(var n =  getNowYear; n<=nowYear-3;n++){
            obj.runYear.push(n);//活動日
        }

        obj.inputY = ((obj.birthday!=0)?(Number(indate[0])-100):0);//防止1970異常
        self.run_year(obj);
        obj.inputM = Number(indate[1]);
        self.run_Month(obj);
        let indateDay:Array<string> = indate[2].split(' ');
        obj.inputD = Number(indateDay[0]);
    }

    /** 個資生日 年選擇(生成月份) */
    run_year=(obj:pE.perCtr)=>
    {//crate date input container
        var nowYearRunnian = false;
        if(obj.inputY %4==0 && obj.inputY%100!=0 || obj.inputY%400==0)
        {//潤年
            nowYearRunnian=true;
        }
  
        for(var a = 1; a<=12;a++)
        {
            obj.runMonth.push(a);
        }

        obj.inputM=0;
        obj.inputD=0;
        obj.runMonthDayMax[2]=((nowYearRunnian)?29:28);//潤日
        this.run_Month(obj);
    }

    /**個資生日 月份取得(生成日) */
    run_Month=(obj:pE.perCtr)=>
    {
        /** 計算今日時間 號剩餘 */
        let nowYear:number = obj.inputY*1;
        let sysDate:Array<string>=pb.reunixDate(pb.unixReNow()).split('/');

        let nowMonth:number = Number(sysDate[1]);
        let nowDay:number = Number(sysDate[2].split(' ')[0]);
        obj.runMonthDay=[0,0];
        if(Number(sysDate[0])==nowYear && nowMonth ==  obj.inputM)
        {
            obj.runMonthDay[0]= obj.runMonthDayMax[obj.inputM] - nowDay+1;
            obj.runMonthDay[1]= nowDay;
        }else{
            obj.runMonthDay[0]= obj.runMonthDayMax[obj.inputM];
            obj.runMonthDay[1]= 1;
        }
        obj.inputD=0;
    }
}

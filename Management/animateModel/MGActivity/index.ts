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
    sysYearDate=function(obj:pE.acCtr)
    {
        
        //報名區間-注冊
        obj.atYear=[];
        obj.atMonth=[[],[]];
        obj.atMonthDayMax=[[0,31,28,31,30,31,30, 31,31,30,31,30,31],[0,31,28,31,30,31,30,31,31,30,31,30,31]];
        obj.atMonthDay=[[0,0],[0,0]];

        //活動日-注冊
        obj.runYear=[];
        obj.runMonth=[];
        obj.runMonthDayMax=[0,31,28,31,30,31,30, 31,31,30,31,30,31];
        obj.runMonthDay=[];

        self.AT_St_year(obj);
        self.AT_end_year(obj);
        self.run_year(obj);
        /** 活動時時間 unix to選擇器 */
        let indate:Array<string> = ((obj.indate==0)?["0","0","0 0:0:0"]:pb.reunixDate(obj.indate).split("/"));
        obj.inputY = Number(indate[0]);
        obj.inputM = Number(indate[1]);
        self.run_Month(obj);
        let indateDay:Array<string> = indate[2].split(' ');
        obj.inputD = Number(indateDay[0]);
        obj.inputH = Number(indateDay[1].split(':')[0]);
          
        if(obj.runMonthDay[1]>obj.inputD)
        {//超過設定時間，設為已設定時間
            obj.runMonthDay[0]+= obj.runMonthDay[1]-obj.inputD;
            obj.runMonthDay[1]= obj.inputD;
        }


        let indateATA:Array<string> = ((obj.stdate==0)?["0","0","0 0:0:0"]:pb.reunixDate(obj.stdate).split("/"));
        obj.inputAT_YA = Number(indateATA[0]);
        obj.inputAT_MA = Number(indateATA[1]);
        self.AT_St_Month(obj);
        let indateDayATA:Array<string> = indateATA[2].split(' ');
        obj.inputAT_DA = Number(indateDayATA[0]);
        obj.inputAT_HA = Number(indateDayATA[1].split(':')[0]);

        if(obj.atMonthDay[0][1]>obj.inputAT_DA)
        {//超過設定時間，設為已設定時間
            obj.atMonthDay[0][0] += obj.atMonthDay[0][1]-obj.inputAT_DA;
            obj.atMonthDay[0][1] = obj.inputAT_DA;
        }

        let indateATB:Array<string> = ((obj.edate==0)?["0","0","0 0:0:0"]:pb.reunixDate(obj.edate).split("/"));
        obj.inputAT_YB = Number(indateATB[0]);
        obj.inputAT_MB = Number(indateATB[1]);
        self.AT_end_Month(obj);
        let indateDayATB:Array<string> = indateATB[2].split(' ');
        obj.inputAT_DB = Number(indateDayATB[0]);
        obj.inputAT_HB = Number(indateDayATB[1].split(':')[0]);

        let nowYear:number = Number(pb.reunixDate(pb.unixReNow()).split('/')[0]);
        for(var n = ((nowYear>obj.inputAT_YA && obj.inputAT_YA!=0)?obj.inputAT_YA:nowYear); n<=nowYear+1;n++)
        {
            obj.atYear.push(n);//create年 - 報名區間
            obj.runYear.push(n);//活動日
        }
        
        if(nowYear> Number(indate[0]) && obj.indate!=0 && Number(indate[0]) <  Number(indateATA[0]) &&  Number(indate[0]) < Number(indateDayATB[0]))
        {//時間區間重新選擇最少年份
            nowYear = Number(indate[0]);
        }
        else  if(nowYear> Number(indateATA[0]) && obj.stdate!=0 &&  Number(indateDayATB[0]) > Number(indateATA[0]))
        {
            nowYear = Number(indateATA[0]);
        }
        else  if(nowYear> Number(indateDayATB[0]) && obj.edate!=0)
        {
            nowYear = Number(indateDayATB[0]);
        }
       
       

        if(obj.atMonthDay[1][1]>obj.inputAT_DB)
        {//超過設定時間，設為已設定時間
            obj.atMonthDay[1][0] += obj.atMonthDay[1][1]-obj.inputAT_DB;
            obj.atMonthDay[1][1] = obj.inputAT_DB;
        }
    }

    /** 報名區間A-年選擇(生成月份) */
    AT_St_year=(obj:pE.acCtr)=>
    {
        var nowYearRunnian = false;
        if(obj.inputAT_YA%4==0 && obj.inputAT_YA%100!=0 || obj.inputAT_YA%400==0)
        {//潤年
                nowYearRunnian=true;
        }
        obj.atMonth[0]=[];
        if(obj.atYear[0]== obj.inputAT_YA)
        {//計算今年剩於哪幾個月份可以選擇
            var nowMonth = Number(((obj.stdate>0)?pb.reunixDate(obj.stdate):pb.reunixDate(pb.unixReNow())).split('/')[1]);
            for(var a = nowMonth; a<=12;a++){
                obj.atMonth[0].push(a);
            }
        }else{
            for(var a = 1; a<=12;a++){
                obj.atMonth[0].push(a);
            }
        }
        obj.inputAT_MA=0;
        obj.inputAT_DA=0;
        obj.atMonthDayMax[0][2]=((nowYearRunnian)?29:28);//潤日
        this.AT_St_Month(obj);
    }

    /** 區間A 月份取得(生成日) */
    AT_St_Month=(obj:pE.acCtr)=>
    {
        /** 計算今日時間 號剩餘 */
        let nowYear:number = obj.inputAT_YA*1;
        let sysDate:Array<string>=pb.reunixDate(pb.unixReNow()).split('/');

        let nowMonth:number = Number(sysDate[1]);
        let nowDay:number = Number(sysDate[2].split(' ')[0]);
        obj.atMonthDay[0]=[0,0];

        if(Number(sysDate[0])==nowYear && nowMonth ==  obj.inputAT_MA)
        {
            obj.atMonthDay[0][0]= obj.atMonthDayMax[0][obj.inputAT_MA] - nowDay+1;
            obj.atMonthDay[0][1]= nowDay;
        }else{
            obj.atMonthDay[0][0]= obj.atMonthDayMax[0][obj.inputAT_MA];
            obj.atMonthDay[0][1]= 1;
        }
        obj.inputAT_DA=0;
    }

     /** 報名區間B-年選擇(生成月份) */
     AT_end_year=(obj:pE.acCtr)=>
     {
         var nowYearRunnian = false;
         if(obj.inputAT_YB%4==0 && obj.inputAT_YB%100!=0 || obj.inputAT_YB%400==0)
         {//潤年
                 nowYearRunnian=true;
         }
         obj.atMonth[1]=[];
         if(obj.atYear[0]== obj.inputAT_YB)
         {//計算今年剩於哪幾個月份可以選擇
             var nowMonth = Number(((obj.edate>0)?pb.reunixDate(obj.edate):pb.reunixDate(pb.unixReNow())).split('/')[1]);
             for(var a = nowMonth; a<=12;a++){
                 obj.atMonth[1].push(a);
             }
         }else{
             for(var a = 1; a<=12;a++){
                 obj.atMonth[1].push(a);
             }
         }

         obj.inputAT_MB=0;
         obj.inputAT_DB=0;
         obj.atMonthDayMax[1][2]=((nowYearRunnian)?29:28);//潤日
         this.AT_end_Month(obj);
     }
 
     /** 區間B 月份取得(生成日) */
     AT_end_Month=(obj:pE.acCtr)=>
     {
         /** 計算今日時間 號剩餘 */
         let nowYear:number = obj.inputAT_YB*1;
         let sysDate:Array<string>=pb.reunixDate(pb.unixReNow()).split('/');
 
         let nowMonth:number = Number(sysDate[1]);
         let nowDay:number = Number(sysDate[2].split(' ')[0]);
         obj.atMonthDay[1]=[0,0];
         if(Number(sysDate[0])==nowYear && nowMonth ==  obj.inputAT_MB)
         {
             obj.atMonthDay[1][0]= obj.atMonthDayMax[1][obj.inputAT_MB] - nowDay+1;
             obj.atMonthDay[1][1]= nowDay;
         }else{
             obj.atMonthDay[1][0]= obj.atMonthDayMax[1][obj.inputAT_MB];
             obj.atMonthDay[1][1]= 1;
         }
         obj.inputAT_DB=0;
     }



     /** 活動 年選擇(生成月份) */
     run_year=(obj:pE.acCtr)=>
     {//crate date input container
         var nowYearRunnian = false;
         if(obj.inputY %4==0 && obj.inputY%100!=0 || obj.inputY%400==0)
         {//潤年
                 nowYearRunnian=true;
         }
         obj.runMonth=[];
         if(obj.runYear[0]== obj.inputY)
         {//計算今年剩於哪幾個月份可以選擇
             var nowMonth = Number(pb.reunixDate(pb.unixReNow()).split('/')[1]);
             for(var a = nowMonth; a<=12;a++){
                 obj.runMonth.push(a);
             }
         }else{
             for(var a = 1; a<=12;a++){
                obj.runMonth.push(a);
             }
         }

         obj.inputM=0;
         obj.inputD=0;
         obj.runMonthDayMax[2]=((nowYearRunnian)?29:28);//潤日
         this.run_Month(obj);
     }
 
     /**活動 月份取得(生成日) */
     run_Month=(obj:pE.acCtr)=>
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
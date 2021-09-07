import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import *  as mbeditPE from "./pubExtendCtr";

/** temp this */
let $t:mbeditPE.mbditTemp;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** 申請權限 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
        mt = $tObj.mainTemp;
        main = $tObj.main;
        Login = (mt.$m.h.Login as pub.Login);
    }


    /** 報名區間、話動日-取年陣列 crate date input container*/
    sysYearDate=function(obj:mbeditPE.perCtr)
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
    run_year=(obj:mbeditPE.perCtr)=>
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
    run_Month=(obj:mbeditPE.perCtr)=>
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

    /** 取得申請MBLevel */
    leveName=():Array<pub.leveNameContainer>=>{
        let mbLevel:Array<pub.leveNameContainer> = [];
        pub.leveNameDataCT().forEach((val,nu)=>
        {
            if([jEnum.Enum_MBLevel.Edit,jEnum.Enum_MBLevel.MG,jEnum.Enum_MBLevel.RG,jEnum.Enum_MBLevel.systemMG].indexOf(val.val)>-1)
            {
                mbLevel.push(val);
            }
        });
        return mbLevel;
    }

    /** 個資驗證通過 */
    perCk=()=>
    {
        let per:mbeditPE.perCtr = $t.perData;
        return (per.inputY!=0 && per.inputM!=0 && per.inputD!=0 && per.name!='' && per.id!=''&& ( per.phone.length>5 || per.tel.length>5));
    }

    /** 載入個資 */
    loadMB = ()=>
    {
        Login((x)=> x.post("/ma/mg/mbinfo/myper"), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.perData = obj.data;
            }
            self.sysYearDate($t.perData);
        });
    }   

    /** 前往申悄 */
    save=()=>
    {
        if(self.perCk())
        {
            pb.v($t,"personVue").async((ep)=>
            {
                /** 申請權限名 */
                let RightName:string="";
                pub.leveNameDataCT().forEach((val,nu)=>
                {
                    if(Number(ep.apply)==val.val)
                    {
                        RightName=val.nameAry[$t.main.pub.langNu];
                    }
                });

                mt.viewConfirm($t.lang.get("confirm").apply+"<br/>("+RightName+")",()=>{
                    /** 進入權限選擇 */
                    let url:string="";
                    switch(Number(ep.apply))
                    {
                        case jEnum.Enum_MBLevel.Edit:
                            url ="applyedit";
                            break;
                        case jEnum.Enum_MBLevel.MG:
                            url ="applymg";
                            break;
                        case jEnum.Enum_MBLevel.RG:
                            url ="applyrg";
                            break;
                        case jEnum.Enum_MBLevel.systemMG:
                            url ="applyad";
                            break;
                    }

                    $t.load = false;
                    Login((x)=> x.post("/ma/mg/mbinfo/"+url).input($t.perData),(obj)=>
                    {
                        if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null){
                            mt.viewAlert($t.lang.get("alert").apply+"<br/>("+RightName+")",()=>
                            {
                                $t.mainTemp.$m.l.singOut();
                            },$t.main.pub.lib.src('mb.png'));
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        $t.load = true;
                    });
                },null,$t.main.pub.lib.src('mb.png'));
            });
        }
    }
}
import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 商品折數設定 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }
    /** 目前已存在設定 折 list*/
    allanceList = (e:any)=>
    {
        e.discountlist =[];
        Login((x)=>x.post("/pc/mg/sys/clist").input({key:e.val.key}),(e3:any)=>{
                    if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        e.discountlist = e3.data as Array<jDB.ProductDiscount>;
                        e.systemdate = e3.nowdate as number;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
    };

    /** 刪除折設定
     * @param key 刪除折key
     * @param nu 當前排序號
     */
    del_allance = (key:string,nu:number)=>
    {
        mt.viewConfirm("是否確認刪除？(排序號:"+(nu+1)+")",()=>{
            pb.v($t,"editview").async((e:any)=>{
                e.load = true;//開始載入
                $t.$an.loadProductEdit();//載入動畫
                Login((x)=>x.post("/pc/mg/sys/removecobj")
                    .input({key:key}),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            e.val.mark = e3.productmark;
                            e.obj.mark = e3.productmark;
                            e.discountlist.splice(nu,1);

                            /** 是否存在*/
                            let exist:boolean=false;
                            /** 目前存在 index of number */
                            let existNu:Number = -1;
                            $t.discountList.forEach((val2:jDB.ProductDiscount,nu2:number)=>{//MGProductSet 折扣起用判斷
                                if(key==val2.key)
                                {
                                    exist=true;
                                    existNu=nu2;
                                }
                            });

                            if(exist)
                            {//排除折扣陣列
                                $t.discountList.splice(existNu,1);
                            }
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                        e.load = false;//結束載入
                    });
            });
        },null);
    };

    /** 啟用關閉 折功能
     * @param obj 折扣 json
     */
    display_allance = (obj:jDB.ProductDiscount,nu:number)=>
    {
        pb.v($t,"editview").async((e:any)=>{
            e.load = true;//開始載入
            $t.$an.loadProductEdit();//載入動畫
            Login((x)=>x.post("/pc/mg/sys/dispalycobj")
                    .input({key:obj.key}),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** response 商品折 */
                            let getData:jDB.ProductDiscount = e3.data;
                            obj.mark = getData.mark;
                            obj.display = getData.display;
                            e.val.mark = e3.productmark;
                            e.obj.mark = e3.productmark;
                            /** 是否存在 折 key */
                            let exist:boolean = false;
                            /** 存在 order number */
                            let existNu:number = -1;
                            $t.discountList.forEach((val2:jDB.ProductDiscount,nu2:number)=>{//增加或減少MGProductSet 折扣起用判斷
                                if(obj.key==val2.key)
                                {
                                    exist=true;
                                    existNu=nu2;
                                }
                            });

                            if(!exist && getData.display)
                            {
                                if(getData.start<e.systemdate && getData.end>e.systemdate)
                                {//折扣起動
                                    $t.discountList.push(getData);
                                }
                            }else if(exist && !getData.display)
                            {//排除 折扣
                                $t.discountList.splice(existNu,1);
                            }
    
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                        e.load = false;//結束載入
                    });
        });
    };

    /** 時間選擇器A: 年月日 foramt yyyy-MM-dd HH:mm:ss to unix number
     * @param e 選擇器 年月日 json
     */
    private dateInputStartVal=(e:any):Number=>
    {//時間選擇器A
        if(Number(e.inputDate.startYear)!=0 && Number(e.inputDate.startMonth)!=0 && Number(e.inputDate.startDay)!=0){
            try{
                return Number(pb.unixRe(e.inputDate.startYear+"-"+e.inputDate.startMonth+"-"+e.inputDate.startDay+" "+e.inputDate.startHour+":00:00"));
            }
            catch(e){
                return 0;
            }
        }else{
            return 0;
        }
    };

    /** 時間選擇器B: 年月日 foramt yyyy-MM-dd HH:mm:ss to unix number  */
    private dateInputEndVal=(e:any):Number=>
    {
        if(Number(e.inputDate.endYear)!=0 && Number(e.inputDate.endMonth)!=0 && Number(e.inputDate.endDay)!=0){
            try{
                return Number(pb.unixRe(e.inputDate.endYear+"-"+e.inputDate.endMonth+"-"+e.inputDate.endDay+" "+e.inputDate.endHour+":00:00"));
            }catch(e){
                return 0;
            }
        }else{
            return 0;
        }
    };

    /** insert 折數 flag*/
    private discountClick:boolean = true;
    /** 新增折 */
    allowanInsert = ()=>
    {
        if(this.discountClick){
            this.discountClick=false;
            pb.v($t,"editview").async((e:any)=>{
                var APointTime = self.dateInputStartVal(e);
                var BPointTime = self.dateInputEndVal(e);
                if(APointTime !=0 && BPointTime !=0 &&  e.inputDiscount != 0){
                        e.load = true;//開始載入
                        $t.$an.loadProductEdit();//載入動畫
                        Login((x)=>x.post("/pc/mg/sys/addcobj").input({pkey:e.val.key,discount: e.inputDiscount,start:APointTime, end:BPointTime}),(e3:any)=>{
                                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    e.discountlist.unshift(e3.data as jDB.ProductDiscount);
                                    e.val.mark = e3.productmark;
                                    e.obj.mark = e3.productmark;
                                    e.resetDateContainerInput();
                                    mt.ViewAlertAtClose("建立成功！(未起用商品)",null,1,$t.main.pub.lib.src('display_off.png'));
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                self.discountClick=true;
                                e.load = false;//結束載入
                            });
                }
                else
                {
                    mt.viewAlert("錯誤-欄位未輸入資料！");
                    self.discountClick=true;
                }

            });
        }
    };
}
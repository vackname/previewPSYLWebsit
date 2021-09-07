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
/** 運費設定 設定 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

     /**設定運費
     */
     edit = (obj:jDB.shipingAddressFee)=>
      {
        mt.viewConfirm("是否確認運費設定-儲存？",()=>
        {
            pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                if(he.load==0)
                {
                    if(String(obj.shunit)=="")
                    {
                        obj.shunit =0;
                    }

                    if(String(obj.fee)=="")
                    {
                        obj.fee =0;
                    }
                    if(obj.shunit*0==0 && obj.fee*0==0)
                    {
                        obj.shunit = Math.abs(obj.shunit);
                        obj.fee = Math.abs(obj.fee);
                        pb.v($t,"sfView").async((se:any)=>{
                            Login((x)=>x.post("/mpay/mg/mb/pay/sh").input({
                                key:obj.key,
                                name:obj.name,
                                shunit:obj.shunit,
                                fee:obj.fee,
                            }),(e:any)=>
                            {
                                if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    obj.name = e.data.name;
                                    obj.shunit = e.data.shunit;
                                    obj.fee = e.data.fee;
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                            });
                        });
                    }
                }
            });
          },null);
      };
  
      /** 移除運費
       * @param obj product json
      */
      del = (obj:jDB.shipingAddressFee)=>
      {
          mt.viewConfirm("是否確認移除？("+obj.country+" "+obj.city+")",()=>
          {
            pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                if(he.load==0)
                {
                    pb.v($t,"sfView").async((se:any)=>{
                        Login((x)=>x.post("/mpay/mg/mb/pay/shdel").input({key:obj.key}),(e:any)=>{
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 重建資料陣列 */
                                let newData:Array<jDB.shipingAddressFee> = [];
                                (se.list as Array<jDB.shipingAddressFee>).forEach((val,nu)=>{
                                    if(obj.key!=val.key)
                                    {
                                        newData.push(val);
                                    }
                                });
                                se.list = newData;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                        });
                    });
                }
            });
          },null);
      }

      /** 新增運費 */
      insert = ()=>
      {
        mt.viewConfirm("是否新增運費設定？",()=>
        {
            pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
                if(he.load==0)
                {
                    pb.v($t,"sfView").async((se:any)=>{
                        Login((x)=>x.post("/mpay/mg/mb/pay/shadd").input({country:se.adr.country,city:se.adr.city,shfeecancel:se.adr.shfeecancel=="1"} as jDB.shipingAddressFee),(e:any)=>
                        {
                            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 重建資料陣列 */
                                let newData:Array<jDB.shipingAddressFee> = [e.data];
                                (se.list as Array<jDB.shipingAddressFee>).forEach((val,nu)=>{
                                    newData.push(val);
                                });
                                se.list = newData;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                        });
                    });
                }
            });
        },null);
      };
      /** 搜尋 input add Option
       */
      ser = ()=>
      {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                pb.v($t,"sfView").async((se:any)=>
                {
                    Login((x)=>x.post("/mpay/mg/mb/pay/shserctr").input({ser:se.ser,country:se.adr.country,city:se.adr.city,free:se.adr.shfeecancel}),(e:any)=>{
                        if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            se.list=e.data as Array<jDB.shipingAddressFee>;
                        }
                        else
                        {
                            mt.viewAlert("伺服器忙線中");
                        }
                    });
                });
            }
        });
      };
}
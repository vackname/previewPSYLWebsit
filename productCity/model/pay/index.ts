import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import * as jDB from "../../../JsonInterface/db";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** post 選入商品 */
interface poPostCtr extends jDB.PayOptions
{
    /** 套餐項目設定 object pE.pSetFormat to string json*/
    setdata:string,
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;

/** 商品購買支付 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }


    /** 寄件人驗證通過 */
    adrCk=()=>
    {
        let adr:jDB.Address = $t.adr;
        return  (adr.name!='' && adr.city !='-' && adr.area!='-' && adr.address.length>5 && (adr.phone.length>5 || adr.tel.length>5)) || $t.adrnow;
    }

    /** 載入寄件資料 */
    loadAdr = ()=>
    {
        Login((x)=> x.post("/ma/mg/mbinfo/myadr"), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                $t.adr = obj.data as jDB.Address;
            }
        });
    }

    
    /** 載入寄件運費計算 */
    adrFee = ()=>
    {
        $t.getShFormat ="";
        $t.shFee = 0;
        Login((x)=> x.post("/mpay/mb/pay/shser").input({country:$t.adr.country,city:$t.adr.city}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
              let getData =  pub.adrFeeSum($t.productCar as Array<pub.productCar> ,obj.data as Array<jDB.shipingAddressFee>,$t.sumProductCash);
              $t.getShFormat =getData.foramt;
              $t.shFee = getData.fee;
            }
        });
    }

    /** 取寄送時段 */
    getDtime=()=>pub.dTimeCT();

    /** 支付銀行圖片 */
    bankImg=(img:jObjM,bank:number)=>pub.bankImg(img,bank);

    /** 取當前時間折扣 */
    discountFun=(val:pub.productCar)=>
    {//目前折數即時(顯示 us)
        var discount=1;
        if(val.discountAry.length>0)
        {
            var nowTime = pb.unixReNow();
            val.discountAry.forEach((val2,nu2)=>
            {
                if(discount>val2.discount
                    && val2.end >= nowTime && val2.start <= nowTime
                    )
                {//選擇最小折數
                    discount=val2.discount;
                }
            });
        }
        val.discount = discount;
    }

    /** 取目前購物車商品-load */
    read =()=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>
        {
            pb.v(e,"pcarTemp").async((e2)=>
            {
                $t.productCar = e2.productCar;
                $t.productImg = e2.productImg;
                ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>{
                    self.discountFun(val);
                });
                self.sumToF($t.productCar);
            });
        });
    }

    /** 總額運算 */
    private sumToF = (data:Array<pub.productCar>)=>
    {
        $t.sumProductCash = 0;
        $t.sumfee = 0;
        data.forEach((val,nu)=>{
            $t.sumProductCash += val.count * val.cash*val.discount;//總額計算
            $t.sumfee += val.count * val.fee;
        });
    }

    /** 新增商品 */
    increase=(obj:pub.productCar)=>
        pb.v(mt,"head_temp").async((e)=>{
            pb.v(e,"pcarTemp").async((e2)=>
            {
                e2.increase(obj);
                self.sumToF(e2.productCar);
            });
        });

    /** 減少商品 */
    decrease=(obj:pub.productCar)=>
    pb.v(mt,"head_temp").async((e)=>{
        pb.v(e,"pcarTemp").async((e2)=>
        {
            e2.decrease(obj);
            self.sumToF(e2.productCar);
        });
    });

   /** 移除商品 */
    removePC=(obj:pub.productCar)=>
    pb.v(mt,"head_temp").async((e)=>{
        pb.v(e,"pcarTemp").async((e2)=>
        {
            e2.removePC(obj);
            setTimeout(()=>{
                $t.productCar = e2.productCar;
                if($t.productCar.length==0)
                {
                    $t.mainTemp.$m.h.tur.gourlIndex();//回首頁
                }
                else
                {
                    self.sumToF($t.productCar);
                }
            },1000);//等候動畫同步
        });
    });

    /** 前往支付 
     * @param payOK 繼承 init pay之取結帳訊息或轉至支付端
    */
    pay=(bank:string,payOK:(e:jDB.payRecord,repoint:number,toUrl:string,)=>void)=>
    {
         pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
             if(he.load==0)
             {
                 if(bank!="")
                 {
                    $t.inLoad = false;
                    /** 送單集合 */
                    let option:Array<jDB.PayOptions> =[];

                    ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>
                    {//重組清單
                        option.push({pkey:val.key,count:val.count ,setdata:JSON.stringify({add:[] as Array<Array<jDB.payItem>>,del:[] as Array<Array<jDB.payItem>>})  as string} as poPostCtr);
                    });

                    let postData = {umark:$t.usermark,adr:!$t.adrnow,bank:bank,
                        payoption:JSON.stringify(option)
                    };
 
                    if(!$t.adrnow)
                    {//寄件地址
                        let adr:jDB.Address = $t.adr;
                        pb.AddPrototype(postData,{"getadr":JSON.stringify(adr)});
                        pb.AddPrototype(postData,{"adrnow":false});
                    }
                    else
                    {//現場取貨
                        pb.AddPrototype(postData,{"adrnow":true});
                    }
                 
                    Login((x)=> x.post("/mpay/mb/pay/from").input(postData), (obj)=> 
                    {
                        if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
                        {
                            pb.v(he,"pcarTemp").async((e2)=>
                            {//清除購物車
                                localStorage.removeItem("productCar");
                                e2.productCar = [];
                                $t.productCar = [];
                                mt.head.productCar = [];
                                $t.pj.openPay=false;//反回商城
                                payOK(obj.data,obj.repoint,obj.topage);
                                self.sumToF(e2.productCar);
                            });
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.notpointError)
                        {//點數不足
                            mt.ViewAlertAtClose($t.main.pub.config.get("error").notpoint,null,3,$t.main.pub.lib.src('coin.png'));
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.prdocutNotExist)
                        {//商品數量不足禁用
                            /** 庫存限制 */
                            if(obj.datacount!=undefined)
                            {
                                ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                {
                                    (obj.datacount as Array<jDB.PayOptions>).forEach((val1,nu1)=>{
                                        if(val1.pkey==val.key)
                                        {
                                            val.errorCount = true;
                                        }
                                    });
                                });
                            }

                            /** 狀態限制 */
                            if(obj.typeLimit!=undefined)
                            {
                                ($t.productCar as Array<pub.productCar>).forEach((val,nu)=>
                                {
                                    (obj.datacount as Array<jDB.PayOptions>).forEach((val1,nu1)=>{
                                        if(val1.pkey==val.key)
                                        {
                                            val.error = true;
                                        }
                                    });
                                });
                            }

                            mt.viewAlert($t.getLangPay("cannot"),()=>
                            {
                                $t.step=0;//反回購物清單
                            },$t.main.pub.lib.src('cancel.png'));
                        }
                        else if(Number(obj.error) == jEnum.Enum_SystemErrorCode.prdocutSizeError)
                        {//運費異常
                            mt.viewAlert("error!(code:-125)",()=>{},$t.main.pub.lib.src('sh.png'));
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        $t.inLoad = true;
                    });
                 }
                 else
                 {//未選支付方式
                     mt.viewAlert(($t.main as pub.main).pub.config.get("error").choosepay,()=>{},$t.main.pub.lib.src('cancel.png'));
                 }
             }
         });
     }
};


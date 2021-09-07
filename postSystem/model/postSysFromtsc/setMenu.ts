import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pE from "../pubExtendCtr";
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
/** 套餐明細編緝edit */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /**
     * 套餐清單
     * @param key 套餐key
     */
     setList = (val:pE.poCtr,nu:number)=>
     {
        pb.v($t,"payMenuView").async((e:any)=>
        {
            pb.v(e,"setMenuToolView").async((e2:any)=>
            {
                e2.pkey = val.pkey;
                if(val.setdata.old.length<val.count)
                {
                    Login(x=>x.post("/pc/psys/mg/pset").input({key:val.pkey}),(e4:any)=>{
                        e.openSetView = true;
                        if(Number(e4.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            var getCount = val.setdata.old.length;
                            for(let a = 0;a<val.count-getCount; a++)
                            {//補位差(set edit) //add=添購於套餐模式,del=刪除項目,原本項目
                                /** 斷開繼承取位差 */
                                let getRow:Array<jDB.payItem>=[];
                                e4.data.forEach((e5:jDB.payItem,nu5:number)=>{
                                    getRow.push({count:e5.count,key:e5.key,nameAry:e5.nameAry,unitAry:e5.unitAry,cash:e5.cash} as jDB.payItem);
                                });
                                val.setdata.old.push(getRow);//斷開繼承
                                val.setdata.add.push([]);
                                val.setdata.del.push([]);
                            }
                            e2.Pnu = nu;
                            e2.catchProduct();
                            e2.menuModel = "old";
                            e2.chooseNu = 0;
                        }
                        else
                        {
                            mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                        }
                        
                    });
                }
                else
                {//重新注入
                    if(val.setdata.old.length>val.count)
                    {
                        while(val.setdata.old.length>val.count)
                        {
                            val.setdata.old.splice(val.setdata.old.length-1,1);
                            val.setdata.add.splice(val.setdata.add.length-1,1);
                            val.setdata.del.splice(val.setdata.del.length-1,1);
                        }
                    }
                    e2.Pnu = nu;
                    e2.catchProduct();
                    e.openSetView = true;
                    e2.chooseNu = 0;
                    e2.menuModel = "old";
                }
                $t.$an.set.menuModel();
            });
        });
     };

     /** 差額計算 */
     private sFeeSum=()=>
     {
        pb.v($t,"payMenuView").async((e:any)=>{
        
            pb.v(e,"setMenuToolView").async((e2:any)=>
            {
                e2.ckCashError=false;
                $t.product.chooseList.forEach((val:pE.poCtr,nu:number)=>
                {
                    if(e2.pkey==val.pkey)
                    {
                        if(!val.gifts)
                        {
                            /** 補差額總額計算 */
                            let sumSfee:number = 0;
                            val.setdata.del.forEach((val1:Array<jDB.payItem>,nu1:number)=>
                            {
                                /** 刪除單項總額 */
                                let sumdelCash:number = 0;
                                val1.forEach((val2:jDB.payItem,nu2:number)=>
                                {
                                    sumdelCash += val2.count*val2.cash;
                                });

                                /** 新增項目 */
                                let sumaddCash:number = 0;;
                                val.setdata.add[nu1].forEach((val2:jDB.payItem,nu2:number)=>
                                {
                                    sumaddCash += val2.count*val2.cash;
                                });
                                sumSfee += sumaddCash-sumdelCash;//差額計算

                                 /** 現在總和 */
                                let sum:number = val.cash*$t.discountFun(val)+(sumaddCash-sumdelCash);

                                /** 已定義menu 是否全部未選錯誤 */
                                let countEqualsZero:Array<boolean>= [];
                                val.setdata.old[nu1].forEach((val2:jDB.payItem,nu2:number)=>{
                                    countEqualsZero.push(val2.count==0);
                                });

                                if(sum<=0 ||  countEqualsZero.indexOf(false)==-1)
                                {//小於零一定為異常
                                    e2.ckCashError = true;
                                }
                            });
                            val.sfee = sumSfee;
                        }
                        else
                        {
                            val.sfee = 0;
                        }

                    }
                });

                if(!e2.ckCashError)
                {//非異常才暫存
                    sessionStorage.setItem("postProduct", JSON.stringify($t.product.chooseList));//暫存已選項目
    
                }
            });
        });
     }

    /**
     * 增加已存在套餐Item
     * @param val {old}
     * @param nu 目前修改count array 號碼
     */
    increaseProduct = (val:pE.poCtr,nu:number)=>
    {
        let getSelf:model = this;
        pb.v($t,"payMenuView/setMenuToolView").async((e:any)=>
        {
            if(e.menuModel=="old")
            {
                /** 刪除號 (del array)*/
                let catchRemoveNu:number=-1;
                /** 是否有動作 */
                let action:boolean = false;
                $t.product.chooseList[e.Pnu].setdata.del[e.chooseNu].forEach((val2:pE.poCtr,nu2:number)=>
                {
                    if(val2.key==val.key)
                    {//移除項目存在才可以增加
                        val2.count--;
                        val.count++;
                        if(val2.count==0)
                        {
                            catchRemoveNu=nu2;
                        }
                        action = true;
                    }
                });

                if(!action)
                {//無動作放入 動畫提醒
                    $t.$an.set.stopIncrease(nu);
                }
                else
                {//移除歸零商品
                    $t.product.chooseList[e.Pnu].setdata.del[e.chooseNu].splice(catchRemoveNu,1);
                }
            }
            else
            {//加點  餐點
                val.count++;
            }
            getSelf.sFeeSum();
        });
    };

    /**
      * 增加已存在套餐Item
     * @param val {old}
     * @param nu 目前修改count array 號碼
     */
    decreaseProduct = (val:pE.poCtr,nu:number)=>
    {
        let getSelf:model = this;
        pb.v($t,"payMenuView/setMenuToolView").async((e:any)=>
        {
            if(e.menuModel=="old")
            {
                /** 是否存在del項目 */
                let exist:boolean=false;
                /** 是否有動作 */
                let action:boolean = false;
                $t.product.chooseList[e.Pnu].setdata.del[e.chooseNu].forEach((val2:pE.poCtr,nu2:number)=>
                {
                    if(val2.key==val.key)
                    {//移除項目存在才可以增加
                        exist=true;
                        if(val.count>0)
                        {
                            val.count--;
                            val2.count++;
                            action=true;
                        }
                    }
                });

                if(!action)
                {//無動作放入 動畫提醒
                    $t.$an.set.stopdecrease(nu);
                }

                if(!exist && val.count>0)
                {//add不存在
                    val.count--;
                    //建立刪除項目
                    $t.product.chooseList[e.Pnu].setdata.del[e.chooseNu].push({count:1,nameAry:val.nameAry,key:val.key,unitAry:val.unitAry,cash:val.cash} as pE.poCtr);
                }
                getSelf.sFeeSum();
            }
            else
            {//加點  餐點
                val.count--;
                if(val.count==0)
                {//刪除count 歸零
                    /** 刪除號*/
                    let catchRemoveNu:number=-1;
                    $t.product.chooseList[e.Pnu].setdata.add[e.chooseNu].forEach((val2:pE.poCtr,nu2:number)=>
                    {
                        if(val2.key==val.key)
                        {//取刪除
                            catchRemoveNu = nu2;
                        }
                    });
                    $t.$an.set.setAddRemove("setproductnameMenu"+catchRemoveNu,function()
                    {//進入刪除動畫
                        $t.product.chooseList[e.Pnu].setdata.add[e.chooseNu].splice(catchRemoveNu,1);
                        getSelf.sFeeSum();
                    });
                }
            }
        });
    };

    /**
     * 加入套餐新項目
     */
    addSet = ()=>
    {
        let getSelf:model = this;
        pb.v($t,"payMenuView").async((e:any)=>
        {
            pb.v(e,"setMenuToolView").async((e2:any)=>
            {
                $t.SetProduct.chooseList.forEach((val:pE.poCtr,nu:number)=>
                {
                    /** 是否本身已存在項目 */
                    let exist:Boolean=false;
                    $t.product.chooseList[e2.Pnu].setdata.add[e2.chooseNu].forEach((val2:pE.poCtr,nu2:number)=>
                    {
                        if(val.pkey==val2.key)
                        {
                            exist=true;
                            val2.count+=val.count;
                        }
                    });

                    if(!exist)
                    {//不存在擇create
                        $t.product.chooseList[e2.Pnu].setdata.add[e2.chooseNu].push({count:1,nameAry:val.nameAry,key:val.pkey,unitAry:val.unitAry,cash:val.cash} as jDB.payItem);
                    }
                });
                $t.SetProduct.chooseList = [] as Array<pE.poCtr>;//清空套餐選擇器
                $t.nowNu = -1;//mark 紅黃球初始化
                $t.stepPanel=1;//回待結帳頁
                e.open=false;//關閉 選擇view
                getSelf.sFeeSum();
            });
        });
    }
}
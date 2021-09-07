import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/** 商品 套餐option */
interface pOptionCtr extends jDB.ProductOptionSet
{
    /** 選擇控項 */
    ck:boolean|false,
    /** 可被取用input */
    us:boolean|true,
}


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
/** 
* 套餐options edit model
*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 取得已設定套餐商品
     * @param key 商品key
     */
    dataListAction = (key:string)=>
    {
        pb.v($t,"editview/addPSOP").async((e:any)=>{
            e.key = key;
            e.setOptions = [] as Array<pOptionCtr>;//初始化
            e.pageNu = 0;
            e.pageCount =0;
            Login((x)=>x.post("/pc/mg/sys/productolist")
                .input({pkey:key}),(e3:any)=>{
                    if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        e.dataList = e3.data as jDB.Product;
                    }
                    else
                    {
                        mt.viewAlert("伺服器忙線中");
                    }
                });
        });
    };
    
    /** 刪除menu
     * @param obj 商品 object json
     */
   delOption = (obj:pOptionCtr)=>
    {
        mt.viewConfirm("是否確認刪除？"+($t.main as pub.main).pub.catchLangName(obj.nameAry),()=>{
            pb.v($t,"editview/addPSOP").async((e:any)=>{

                    if(!e.load)
                    {
                        e.load=true;
                        Login((x)=>x.post("/pc/mg/sys/productodel").input({key:obj.key}),(e3:any)=>{
                                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    /** 商品list 重建 */
                                    let newObj:Array<jDB.Product> = [];
                                    e.dataList.forEach((val:jDB.Product,nu:number)=>
                                    {
                                        if(val.key!=obj.key){
                                            newObj.push(val);
                                        }
                                    });

                                    e.setOptions.forEach((val:pOptionCtr,nu:number)=>
                                    {//選擇加入 model
                                        if(val.key==obj.pkey)
                                        {//因刪除而回復設定值
                                            val.us = true;
                                        }
                                    });
                                    e.dataList = newObj;
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                e.load=false;
                            });
                    }
            });
        },null);
    }
    
    /** 編緝 menu */
   editOption = (obj:pOptionCtr)=>
    {
        if(obj.count*0==0){
            pb.v($t,"editview/addPSOP").async((e:any)=>{
                if(!e.load)
                {
                    e.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productoedit")
                        .input({key:obj.key,count:obj.count}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                obj.mark = e3.mark;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            e.load=false;
                        });
                }
            });
        }else
        {
            mt.viewAlert("請入數字");
        }
    };
    
    //------add menu-------
    /** input addOption */
   addOption = ()=>
    {
        pb.v($t,"editview/addPSOP").async((e:any)=>{

            /** 商品 option container */
            let getAry:any[] = [];
            e.setOptions.forEach((val:any,nu:number)=>
            {
                if(val.ck && val.us)
                {
                    getAry.push(val.key);
                }
            });

            if(getAry.length>0)
            {
                if(!e.load)
                {
                    e.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productoadd")
                        .input({ary:JSON.stringify(getAry),pkey:e.key}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                e.setOptions.forEach((val:pOptionCtr ,nu:number)=>
                                {
                                    if(val.ck && val.us)
                                    {//排除新增功能
                                        val.us=false;
                                    }
                                });
                                e3.data.forEach((val:any,nu:number)=>
                                {
                                    e.dataList.push(val);
                                });

                                e.pageCount -= e3.data.length;//減去目前實際數
                                e.pageNu--;//減去實際頁碼 原地重取
                                mt.viewAlert("已成功加入商品！");
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            e.load=false;
                        });
                }
            }
            else
            {
                mt.viewAlert("請選擇加入商品項目");
            }


        });
    };
    
    /** 搜尋 input addOption
     * 
     * @param initSer 是否初始化 true = 是
     */
    serAddOption = (initSer:boolean)=>
    {
        pb.v($t,"editview/addPSOP").async((e:any)=>{
                if(!e.load)
                {
                    e.load=true;
                    if(initSer)
                    {//初化搜尋
                        e.pageNu = 0;
                        e.setOptions = [];
                    }

                    /** 商品 option container */
                    let getAry:Array<string> = [];
                    e.dataList.forEach((val:pOptionCtr,nu:number)=>
                    {//目前已存在之加入商品
                        getAry.push(val.pkey);
                    });

                    Login((x)=>x.post("/pc/mg/sys/productolistset")
                        .input({ser:e.serinput,page:e.pageNu})
                        .input({ary:JSON.stringify(getAry)}),
                        (e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                e3.data.forEach((val:pOptionCtr,nu:number)=>{
                                    /** 是否存在 */
                                    let exist:boolean=false;
                                    e.setOptions.forEach((val2:pOptionCtr,nu2:number)=>{//排除因刪除而造成找回原資料狀況
                                        if(val.key==val2.key)
                                        {
                                            exist=true;
                                        }
                                    });
                                    if(!exist)
                                    { 
                                        val.ck=false;//選擇控項
                                        val.us=true;//可被取用input
                                        e.setOptions.push(val);
                                    }
                                });

                                e.pageCount = e3.pageCount*1;
                                e.pageNu++;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            e.load=false;
                        });
                }
            });
    };

}
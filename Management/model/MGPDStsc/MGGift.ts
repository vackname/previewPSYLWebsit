import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

/** 商品 推薦 */
interface pSetCtr extends jDB.Product
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
/** 商品推薦*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }
    
    /**設定商品 search list
     * @param initSer 是否初始化 true=是
     */
    setOptions = (initSer:boolean)=>
    {
        pb.v($t,"GiftView").async((ge:any)=>{
            if(!ge.load)
            {
                ge.load = true;
                if(initSer)
                {//初化搜尋
                    ge.input.InputSer = ge.InputSer;
                    ge.input.InputClass = ge.InputClass;
                    ge.input.selfclassmain = ge.selfclassmain;
                    ge.input.selfclass = ge.selfclass;
                    ge.pageNuSet = 0;
                    ge.dataList = [];
                }

                Login((x)=>x.post("/pc/mg/sys/productgtlist")
                        .input({ser:ge.input.InputSer,class:ge.input.InputClass ,page:ge.pageNuSet})
                        .input({selfclass:((ge.input.selfclassmain!="333")?((ge.input.selfclass=="999")?"999"+ge.input.selfclassmain:ge.input.selfclass):"333")}),
                        (e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    e2.data.forEach((val:pSetCtr,nu:number)=>{
                                        /** 是否存在 */
                                        let exist:boolean=false;
                                        ge.dataList.forEach((val2:pSetCtr,nu2:number)=>{//排除因刪除而造成找回原資料狀況
                                            if(val.key==val2.key)
                                            {
                                                exist=true;
                                            }
                                        });
                                        if(!exist)
                                        {
                                            ge.dataList.push(val);
                                        }
                                    });
                    
                                    ge.pageCountSet = Number(e2.pageCount);
                                    ge.pageNuSet++;
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                ge.load=false;
                        });
            }
        });
    };

    /** 移除商品 
     * @param obj product json
    */
    delOption = (obj:pSetCtr)=>
    {
        mt.viewConfirm("是否確認移除？("+($t.main as pub.main).pub.catchLangName(obj.nameAry)+")",()=>
        {
            pb.v($t,"GiftView").async((e:any)=>{
                    if(!e.load)
                    {
                        e.load=true;
                        Login((x)=>x.post("/pc/mg/sys/productgfck").input({ary:JSON.stringify([obj.key])}),(e3:any)=>{
                                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    let newList:Array<pSetCtr>=[];
                                    e.dataList.forEach((val:pSetCtr,nu:number)=>{
                                        if(val.key!=obj.key)
                                        {
                                            if(obj.giftorder<val.giftorder)
                                            {//因移除當下所有資料需move 編號-1
                                                val.giftorder -=1;
                                            }
                                            newList.push(val);
                                        }
                                    });
        
                                    e.setOptions.forEach((val:pSetCtr,nu:number)=>
                                    {
                                        if(!val.us && obj.key == val.key)
                                        {//排除新增功能
                                            val.ck = false;
                                            val.us = true;
                                        }
                                    });
        
                                    e.dataList = newList;
        
                                    e.pageCountSet--;//實際庫存更新
                                    e.pageNuSet = Math.floor((e.dataList.length)/20);//更新目前下一個頁碼
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
    };
    /** input addOption */
    addOption = ()=>
    {
        pb.v($t,"GiftView").async((e:any)=>{

            /** 目前緩存 product */
            let getAry:Array<String> = [];
            e.setOptions.forEach((val:pSetCtr,nu:number)=>
            {
                if(val.ck && val.us)
                {
                    getAry.push(val.key);
                }
            });

            if(getAry.length>0){
                if(!e.load)
                {
                    e.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productgfck").input({ary:JSON.stringify(getAry)}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                e.setOptions.forEach((val:pSetCtr,nu:number)=>
                                {
                                    if(val.ck && val.us)
                                    {//排除新增功能
                                        val.ck = false;
                                        val.us = false;
                                    }
                                });

                                /** 當前商品 */
                                let newCreate:Array<pSetCtr> = [];
                                e3.data.forEach((val:pSetCtr,nu:number)=>{
                                    newCreate.push(val);
                                });

                                e.pageCount -= newCreate.length;//減去目前實際數
                                e.pageNu--;//減去實際頁碼 原地重取

                                /** 當前 最大長度*/
                                let addCount:number = newCreate.length;
                                e.dataList.forEach((val:pSetCtr,nu:number)=>{//重建order number
                                    val.giftorder+=addCount;
                                    newCreate.push(val);
                                });

                                e.dataList = newCreate;
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
    /** 搜尋 input add Option
     * @param initSer 是否初始化 true=是
     */
    serGiftOption = (initSer:boolean)=>
    {
        pb.v($t,"GiftView").async((e:any)=>{
                    if(!e.load)
                    {
                        e.load=true;
                        if(initSer)
                        {//初化搜尋
                            e.pageNu = 0;
                            e.setOptions = [] as Array<pSetCtr>;
                        }

                        /** 目前已存在之加入商品 */
                        let getAry:any[] = [];
                        e.dataList.forEach((val:any,nu:number)=>
                        {
                            getAry.push(val.key);
                        });

                        Login((x)=>x.post("/pc/mg/sys/productgtlistset").input({ser:e.serinput,page:e.pageNu}),(e3:any)=>{
                                if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    e3.data.forEach((val:pSetCtr,nu:number)=>{
                                        /** 是否存在 */
                                        let exist:boolean=false;
                                        e.setOptions.forEach((val2:pSetCtr,nu2:number)=>{//排除因刪除而造成找回原資料狀況
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
                                    e.pageCount = Number(e3.pageCount);
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

    /** 推薦商品往下移 
     * @param pobj product json
    */
    NextOption = (pobj:pSetCtr)=>
    {
        pb.v($t,"GiftView").async((e:any)=>{

            if(!e.load)
            {
                /** catch key */
                let catchKey:boolean = false;
                /** product next key */
                let nextKey:string = "";
                e.dataList.forEach((val2:any,nu2:number)=>
                {//取欲切換之層級
                    if(pobj.key==val2.key)
                    {
                        catchKey = true;
                    }else if(catchKey)
                    {
                        catchKey = false;
                        nextKey = val2.key;
                    }
                });

                e.load=true;
                Login((x)=>x.post("/pc/mg/sys/productgfnext").input({key:pobj.key,key2: nextKey}),(e3:any)=>{
                        if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 重建序列container */
                            let newDatalist:Array<pSetCtr> = [];
                            /** 檢測是否更動排序 */
                            let changeOder:boolean = Number(e3.data.giftorder) != Number(pobj.giftorder);
                            if(changeOder){
                                e.dataList.forEach((val2:pSetCtr,nu2:number)=>{//建立排序
                                    if(e3.data.key!=val2.key)
                                    {
                                        newDatalist.push(val2);
                                        if( Number(e3.data.giftorder) == Number(val2.giftorder)){
                                            val2.giftorder=Number(pobj.giftorder);
                                            newDatalist.push(e3.data);
                                        }
                                    }
                                });
    
                                e.dataList = newDatalist;
                            }
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

    /** 推薦商品往上移
     * @param pobj product json
     */
    PreOption = (pobj:pSetCtr)=>
    {
        pb.v($t,"GiftView").async((e:any)=>{
                if(!e.load)
                {
                    /** catch key */
                    let catchKey:boolean = true;
                    /** 上一層 key */
                    let prvKey:string ="";
                    e.dataList.forEach((val2:pSetCtr,nu2:number)=>
                    {//取欲切換之層級
                        if(pobj.key==val2.key)
                        {
                            catchKey = false;
                        }else if(catchKey)
                        {
                            prvKey = val2.key;
                        }
                    });

                    e.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productgprv").input({key:pobj.key,key2:prvKey}),(e3:any)=>{
                            if(Number(e3.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 重建序列container */
                                let newDatalist:Array<pSetCtr> = [];
                                /** 檢測是否更動排序 */
                                let changeOder:boolean = Number(e3.data.giftorder) != Number(pobj.giftorder);
                                if(changeOder){
                                    e.dataList.forEach((val2:pSetCtr,nu2:number)=>{//建立排序
                                        if(e3.data.key!=val2.key)
                                        {
                                            if( Number(e3.data.giftorder) == Number(val2.giftorder)){
                                                val2.giftorder=Number(pobj.giftorder);
                                                newDatalist.push(e3.data);
                                            }
                                            newDatalist.push(val2);
                                        }
                                    });
                                    e.dataList = newDatalist;
                                }
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

    /** 使用者 起用 禁用購買
     * @param obj product
     */
    CancelF = (obj:pSetCtr)=>{
        mt.viewConfirm("是否確認"+((Number(obj.type)>-1)?"禁用":"起用")+"'使用者'購買？",()=>
        {
            Login((x)=>x.post("/pc/mg/sys/productonoff").input({key:obj.key}),(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                obj.type = Number(e2.type);
                                obj.mark = e2.mark;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                    });
        },null);
    };

}
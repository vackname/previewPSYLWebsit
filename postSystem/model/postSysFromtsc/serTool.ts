import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jDB from "../../../JsonInterface/db";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import * as pE from "../pubExtendCtr";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** psyl ajax api */
let ajax:ajaxM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 搜尋tool */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 分類第一層 */
    classFirstList = ()=>
    {
        Login((x)=>x.post("/pc/psys/mg/productcflist"),(e2:any)=>{
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                        let getProduct:Array<pub.pctCtr> = [];
                        e2.data.forEach((val:pub.pctCtr,nu:number)=>{
                            val.cl=[];//第二層細分類
                            val.opencl=false;
                            val.firstinput=true;
                            for(let a=val.nameAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                val.nameAry.push("");//補語系位置
                            }
                            getProduct.push(val);
                        });
                        $t.serTool.productcs = getProduct;
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                    
                });
    };

    /** 取得顯示商品項目分類選擇細項
     * @param selfclassmain 商品大類項
     * @param fun 注入執行另一階段 function
     */
    selfCatchClass=(selfclassmain:string,fun:Function)=>
    {
        $t.serTool.productcs.forEach((val:pub.pctCtr,nu:number)=>{
            if(selfclassmain==val.key){
                if(val.cl.length==0){//還原顯示
                    self.classSeList(val,()=>{
                        fun(val.cl);
                        val.opencl = !val.opencl;
                    });
                }else{
                    fun(val.cl);
                }
            }
        });
    }

     /** 分類名第二層 search
     * @param obj 第二層分類json:any
     *  @param fun 取用完成後執行 function
     */
    classSeList = (obj:pub.pctCtr,fun:Function)=>
    {
        Login((x)=>x.post("/pc/psys/mg/productcslist").input({key:obj.key}),(e2:any)=>
                {
                    if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                    {
                        /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                        let createList:Array<pub.pcsCtr> = [];
                        e2.data.forEach((val2:pub.pcsCtr,nu2:number)=>
                        {
                            val2.firstinput=true;
                            for(let a=val2.nameAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                val2.nameAry.push("");//補語系位置
                            }
                            createList.push(val2);
                        });
                        obj.cl = createList;
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                    if(fun!=null && fun!=undefined){
                        fun();//async 運行
                    }
                });
    };

    /** 商品推薦 enum */
    giftList=()=> {
        $t.serTool.giftList = pub.giftOptionCT();
    };
    
    /** 商品所屬分類 enum */
    ptypeclassList=()=>
    {
        $t.serTool.ptypeclassList = {"t":pub.getProductTypeCT(),"c":pub.getProductClassCT()};
    };

    /**
     * 商品 list
     * @param init 是否初始化
     */
    productListGet=(init:boolean)=>
    {
        pb.v(mt,"head_temp").async((e:pub.mainHeadTemp)=>{
            if(!e.load){
                if($t.pObj().dataCount > ($t.pObj().page+1)*20 || init)
                {
                    if(init)
                    {
                        $t.pObj().page = 0;
                    }
                    else
                    {
                        $t.pObj().page++;
                    }

                    Login((x)=>x.post("/pc/psys/mg/productlist")
                        .input({"selfclass":(($t.serTool.selfclassmain!="333")?$t.serTool.selfclass+(($t.serTool.selfclass=="999")?$t.serTool.selfclassmain:""):"333")})
                        .input({"ser":$t.serTool.ser,"filter":$t.serTool.filter,"gift":$t.serTool.gift,"page":$t.pObj().page}),(e2:any)=>{
                            if(Number(e2.error) == 1)
                            {
                                e2.data.forEach((val:pE.poCtr,nu:Number)=>
                                {
                                    /** 折數 array 暫存 */
                                    let discountAry:Array<jDB.ProductDiscount> = [];
                                    e2.discount.forEach((val2:jDB.ProductDiscount,nu2:Number)=>
                                    {//找尋目前適合折數
                                        if(val2.pkey==val.key)
                                        {
                                            discountAry.push(val2);
                                        }

                                    });
                                    val["discountAry"] = discountAry;
                                });

                                $t.pObj().dataCount = e2.pageCount;//目前資料庫筆數
                                if(init)
                                {
                                    $t.pObj().list = e2.data as Array<jDB.Product>;
                                }
                                else
                                {//more page add data

                                    $t.$an.productMore(()=>
                                    {
                                        e2.data.forEach((val:pE.poCtr,nu:Number)=>
                                        {//add product list
                                            $t.pObj().list.push(val);
                                        });
                                    });//商品取得動畫
                                }
                            }
                            else
                            {
                                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                            }
                        });
                }
            }
        });
    };
};

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

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

/** 商品分類 */
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


    /** 記錄正在載入類別子項目 */
    loadClAry:Array<string>=[];
    /** 取得顯示商品項目分類選擇細項
     * @param selfclassmain 商品大類項
     * @param fun 注入執行另一階段 function
     */
    selfCatchClass=(selfclassmain:string,fun:Function)=>
    {
        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>{
            if(selfclassmain==val.key)
            {
                if(val.cl.length==0){//還原顯示
                    if(self.loadClAry.indexOf(val.key)==-1)
                    {
                        self.loadClAry.push(val.key);
                        self.classSeList(val,()=>{
                            self.loadClAry = [];//清空阻擋
                            fun(val.cl);
                            val.opencl = !val.opencl;
                        });
                    }
                    else
                    {
                        let wait:Function = ()=>
                        {
                            if(val.cl.length>0)
                            {
                                fun(val.cl);
                            }
                            else
                            {
                               setTimeout(()=>{ wait(); },200);
                            }
                        }
                        wait();
                    }
                }else{
                    fun(val.cl);
                }
            }
        });
    }

    /**補語系位置 */
    private addIndexOfLang=(obj:Array<string>)=>{
        for(let a=obj.length;a<($t.main as pub.main).pub.langAry.length;a++)
        {
            obj.push("");
        }
    };
    
    /** first 分類 */
    productClass = ()=>
    {
        Login(x => x.post("/pc/mg/mb/productcflist"),
        (obj:any)=>
        {
            if(Number(obj.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                let getProduct:Array<pub.pctCtr> = [];
                obj.data.forEach((val:pub.pctCtr,nu:number)=>{
                    val.cl=[];//第二層細分類
                    self.addIndexOfLang(val.nameAry);
                    getProduct.push(val);
                });
                $t.productcs = getProduct;
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            
        });
    };

    /** 分類名第二層 注入商品分類Name
     * @param obj 第二層分類json:any
     *  @param fun 取用完成後執行 function
     */
     classSeList = (obj:pub.pctCtr,fun:Function)=>
     {
        if(obj.cl.length==0)
        {
            Login((x)=>x.post("/pc/mg/mb/productcslist").input({key:obj.key}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 建立語系位置 */
                            let getAryLang:Array<string> = [];
                            for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                getAryLang.push("");//補語系位置
                            }

                            /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                            let createList:Array<pub.pcsCtr> = [];
                            e2.data.forEach((val2:pub.pcsCtr,nu2:number)=>
                            {
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
        }
    };
};

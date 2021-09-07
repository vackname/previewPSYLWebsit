import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

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
/** class 分類name(News) */
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
//--------------第一層分類
    /** 往上移
     * @param obj 第一層分類 object json
     */
    classFirstPre = (obj:pub.nctccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>
                            x.post("/nscc/mg/ad/cfpre")
                            .input({key:obj.key})
                            ,(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        /** 第一層分類  container */
                                        let newOrder:Array<pub.nctccCtr> = [];
                                        /** 交換位置 container */
                                        let changeOrder:Array<pub.nctccCtr> = [];
                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(obj.key==val.key)
                                            {
                                                val.mark = e2.mark;
                                                val.order-=1;
                                                changeOrder.push(val);
                                            }
                                            else if(e2.order==val.order)
                                            {
                                                val.order+=1;
                                                changeOrder.push(val);
                                            }else{
                                                newOrder.push(val);
                                            }

                                            if(changeOrder.length==2)
                                            {//交換位置
                                                newOrder.push(changeOrder[1]);
                                                newOrder.push(changeOrder[0]);
                                                changeOrder = [];
                                            }
                                            
                                        });
                                        $t.newsctcs = newOrder;
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            }
        });
    };

    /** 往下移
     *  @param obj 第一層分類 object json
     */
    classFirstNext = (obj:pub.nctccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/cfnext")
                        .input({key:obj.key})
                        ,(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        /** 第一層分類  container */
                                        let newOrder:Array<pub.nctccCtr> = [];
                                        /** 交換位置 container */
                                        let changeOrder:Array<pub.nctccCtr> = [];
                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(obj.key==val.key)
                                            {
                                                val.mark = e2.mark;
                                                val.order+=1;
                                                changeOrder.push(val);
                                            }
                                            else if(e2.order==val.order)
                                            {
                                                val.order-=1;
                                                changeOrder.push(val);
                                            }else{
                                                newOrder.push(val);
                                            }

                                            if(changeOrder.length==2)
                                            {//交換位置
                                                newOrder.push(changeOrder[1]);
                                                newOrder.push(changeOrder[0]);
                                                changeOrder = [];
                                            }
                                        });
                                        $t.newsctcs = newOrder;
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            }
        });
    };

    /** 目前已存在設定 第一層 分類 list */
    classFirstList = (catchData:boolean)=>
    {
        /**
         * 類別資料download
     */
        let run:Function=(f:Function)=>{
        Login((x)=>x.post("/nscc/mg/ad/cflist"),(e2:any)=>{
            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                /** 建立語系位置 */
                let getAryLang:Array<string> = [];
                for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                {
                    getAryLang.push("");//補語系位置
                }

                /* first input create us */
                let addFirst:pub.nctccCtr= {key:"",nameAry:getAryLang ,order:0,mark:""} as pub.nctccCtr;
                addFirst.cl = [];
                addFirst.opencl = false;
                addFirst.firstinput = true;

                /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                let getNct:Array<pub.nctccCtr>= [addFirst];
                e2.data.forEach((val:pub.nctccCtr,nu:number)=>{
                    val.cl=[];
                    val.opencl=false;
                    val.firstinput=true;
                    for(let a=val.nameAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                    {
                        val.nameAry.push("");//補語系位置
                    }
                    getNct.push(val);
                });
                $t.newsctcs = getNct;
            }
            else
            {
                mt.viewAlert("伺服器忙線中");
            }
            if(f!=null && f!=undefined)
            {
                f();
            }
        });

        }
        if(!catchData)
        {//樣版編緝模式
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;
                run(()=>{
                    temp.load=false;
                });
            }
        });
        }
        else
        {//取資料模式
        run(null);
        }
    };

    /** 分類第一層 edit */
    classEditF = (obj:pub.nctccCtr)=>
    {
        if(($t.main as pub.main).pub.catchLangName(obj.nameAry).replace(/ /g,"")!="" && ($t.main as pub.main).pub.catchLangName(obj.nameAry)!="(null)")
        {
            pb.v($t,"classvue").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/cfedit")
                        .input({"key":obj.key,"name":JSON.stringify(obj.nameAry)})
                        ,(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.key=="")
                                    {//edit insert
                                        e2.data.cl=[];
                                        e2.data.opencl=false;
                                        e2.data.firstinput = true;

                                        /** 建立語系位置 */
                                        let getAryLang:Array<string> = [];
                                        for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                                        {
                                            getAryLang.push("");//補語系位置
                                        }

                                        /* first input create us */
                                        let addFirst:pub.nctccCtr= {key:"",nameAry:getAryLang ,order:0,mark:""} as pub.nctccCtr;
                                        addFirst.cl = [];
                                        addFirst.opencl = false;
                                        addFirst.firstinput = true;

                                        /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                                        let createList:Array<pub.nctccCtr> = [addFirst,e2.data];
                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(val.key!="")
                                            {
                                                val.order+=1;
                                                createList.push(val);
                                            }
                                        });
                                        $t.newsctcs = createList;
                                    }else{
                                        obj.mark = e2.mark;
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            });
        }
        else
        {
            mt.viewAlert("請輸入文字！");
        }
    };


    /** 分類第一層 delete
     * @param obj 分類第一層 object json
     */
    classDelF = (obj:pub.nctccCtr)=>
    {
        mt.viewConfirm("是否確認刪除？("+($t.main as pub.main).pub.catchLangName(obj.nameAry)+")",()=>{
            pb.v($t,"classvue").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/cfdel")
                        .input({"key":obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    /** 重建 分類第一層 list */
                                    let createList:Array<pub.nctccCtr> = [] ;
                                    $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                    {
                                        if(obj.key!=val.key)
                                        {
                                            if(obj.order<val.order){
                                                val.order-=1;
                                            }
                                            createList.push(val);
                                        }
                                    });
                                    $t.newsctcs = createList;

                                    if(obj.key==$t.selfclassmain)
                                    {//因刪除而復歸
                                        $t.selfclassmain = "333";
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            });

        },null);
    };
    /** 顯不顯示設定 */
    classDisplayF = (obj:pub.nctccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;
                Login((x)=>x.post("/nscc/mg/ad/cfdisplay")
                    .input({"key":obj.key})
                    ,(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                obj.display = e2.display;
                                obj.mark = e2.mark;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            temp.load=false;
                        });
            }
        });
    };

    //--------------第二層分類
    /** 往上移
     * @param obj 第二層分類json:any
     */
    classSePre = (obj:pub.ncsccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/cspre")
                        .input({key:obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(obj.fkey==val.key)
                                            {
                                                /** 第二層分類  container */
                                                let newOrder:Array<pub.ncsccCtr> = [];
                                                /** 交換位置 container */
                                                let changeOrder:Array<pub.ncsccCtr>= [];
                                                val.cl.forEach((val2:pub.ncsccCtr,nu2:number)=>{
                                                    if(obj.key==val2.key)
                                                    {
                                                        val2.mark = e2.mark;
                                                        val2.order-=1;
                                                        changeOrder.push(val2);
                                                    }
                                                    else if(e2.order==val2.order)
                                                    {
                                                        val2.order+=1;
                                                        changeOrder.push(val2);
                                                    }else{
                                                        newOrder.push(val2);
                                                    }

                                                    if(changeOrder.length==2)
                                                    {//交換位置
                                                        newOrder.push(changeOrder[1]);
                                                        newOrder.push(changeOrder[0]);
                                                        changeOrder = [];
                                                    }
                                                });
                                                val.cl = newOrder;
                                            }
                                            
                                        });
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            }
        });
    };

    /** 往下移
     * @param obj 第二層分類json:any
     */
    classSeNext = (obj:pub.ncsccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/csnext")
                            .input({key:obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(obj.fkey==val.key)
                                            {
                                                /** 第二層分類  container */
                                                let newOrder:Array<pub.ncsccCtr> = [];
                                                /** 交換位置 container */
                                                let changeOrder:Array<pub.ncsccCtr> = [];
                                                val.cl.forEach((val2:any,nu2:number)=>{
                                                    if(obj.key==val2.key)
                                                    {
                                                        val2.mark = e2.mark;
                                                        val2.order+=1;
                                                        changeOrder.push(val2);
                                                    }
                                                    else if(e2.order==val2.order)
                                                    {
                                                        val2.order-=1;
                                                        changeOrder.push(val2);
                                                    }
                                                    else{
                                                        newOrder.push(val2);
                                                    }

                                                    if(changeOrder.length==2)
                                                    {//交換位置
                                                        newOrder.push(changeOrder[1]);
                                                        newOrder.push(changeOrder[0]);
                                                        changeOrder = [];
                                                    }
                                                });
                                                val.cl = newOrder;
                                            }
                                            
                                        });
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            }
        });
    };

    /** 分類名第二層 search
     * @param obj 第二層分類json:any
     * @param fun 取用完成後執行 function
     * @param catchData 是否取資料
     */
    classSeList = (obj:pub.nctccCtr,fun:Function,catchData:boolean)=>
    {
        /**
         * 取資料
         * @param f1 載入開始
         * @param f2 載入結束
         */
        let run:Function = (f1:Function,f2:Function)=>
        {
        if(obj.cl.length==0)
        {
            if(f1!=null && f1!=undefined)
            {
                f1();
            }
            Login((x)=>x.post("/nscc/mg/ad/cslist").input({key:obj.key}),(e2:any)=>{
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 建立語系位置 */
                            let getAryLang:Array<string> = [];
                            for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                getAryLang.push("");//補語系位置
                            }

                            /* first input create us */
                            let addFirst:pub.ncsccCtr= {key:"",nameAry:getAryLang ,order:0,fkey:obj.key,mark:""} as pub.ncsccCtr;
                            addFirst.firstinput = true;

                            /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                            let createList:Array<pub.ncsccCtr> = [addFirst];
                            e2.data.forEach((val2:pub.ncsccCtr,nu2:number)=>
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
                            mt.viewAlert("伺服器忙線中");
                        }
                        if(f2!=null && f2!=undefined)
                        {
                            f2();
                        }
                        if(fun!=null && fun!=undefined){
                            fun();//async 運行
                        }
                    });
        }
        }

        if(!catchData)
        {//樣版編緝模式
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                obj.opencl = !obj.opencl;
                run(()=>{
                    temp.load=true;
                },()=>{
                    temp.load=false;
                });

            }
        });
    }
    else
    {//取資料模式
        run(null,null);
    }

    };

    /** 分類第二層 edit  
     * @param obj 第二層分類json:any 
     * */
    classSeEdit = (obj:pub.ncsccCtr)=>
    {
        if(($t.main as pub.main).pub.catchLangName(obj.nameAry).replace(/ /g,"")!="" && ($t.main as pub.main).pub.catchLangName(obj.nameAry)!="(null)")
        {
            pb.v($t,"classvue").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/csedit")
                            .input({"key":obj.key,"name":JSON.stringify(obj.nameAry),"fkey":obj.fkey}),
                            (e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.key=="")
                                    {//insert
                                        e2.data.firstinput=true;

                                        /** 建立語系位置 */
                                        let getAryLang:Array<string> = [];
                                        for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                                        {
                                            getAryLang.push("");//補語系位置
                                        }

                                        /* first input create us */
                                        let addFirst:pub.ncsccCtr= {key:"",nameAry:getAryLang  ,order:0,fkey:obj.fkey,mark:""} as pub.ncsccCtr;
                                        addFirst.firstinput = true;

                                        /** 分類第二層 create 用 first row 及 container list */
                                        let createList:Array<pub.ncsccCtr> = [addFirst,e2.data];

                                        $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                        {
                                            if(val.key == obj.fkey){
                                                val.cl.forEach((val2:pub.ncsccCtr,nu2:number)=>
                                                {
                                                    if(val2.key!="")
                                                    {
                                                        val2.order+=1;
                                                        createList.push(val2);
                                                    }
                                                });
                                                val.cl = createList;
                                            
                                                if($t.selfclassmain==obj.fkey)
                                                {//設定 同步次分類
                                                    $t.newsctcsSec = val.cl;
                                                }
                                            }
                                        });
                                    }
                                    else{
                                        obj.mark = e2.mark;
                                    }
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });

                }
            });
        }
        else
        {
            mt.viewAlert("請輸入文字！");
        }
    };
 
    /** 分類第一層 delete
     * @param obj 分類第一層 object json
     */
    classSeDel =(obj:pub.ncsccCtr)=>
    {
        mt.viewConfirm("是否確認刪除？("+($t.main as pub.main).pub.catchLangName(obj.nameAry)+")",()=>
        {
            pb.v($t,"classvue").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/nscc/mg/ad/csdel")
                            .input({"key":obj.key,"fkey":obj.fkey}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    /** 取得當下資料設定 */
                                    let catchCl:Array<pub.ncsccCtr> = [];
                                    $t.newsctcs.forEach((val:pub.nctccCtr,nu:number)=>
                                    {
                                        if(obj.fkey==val.key)
                                        {
                                            /** 分類第一層 重建lsit */
                                            let createList:Array<pub.ncsccCtr> = [];
                                            val.cl.forEach((val2:pub.ncsccCtr,nu2:number)=>{
                                                if(val2.key!=obj.key){
                                                    if(obj.order<val2.order){
                                                        val.order-=1;
                                                    }
                                                    createList.push(val2);
                                                }
                                            });
                                            val.cl = createList;
                                            catchCl = val.cl;
                                        }
                                    });

                                    if(obj.key==$t.selfclass)
                                    {//因刪除而復歸-
                                        $t.selfclass  = "999";
                                        $t.newsctcsSec = catchCl;
                                    }

                                }
                                else if(Number(e2.error)==-108)
                                {
                                    mt.viewAlert("無法刪除！(已綁定文章)");
                                }
                                else
                                {
                                    mt.viewAlert("伺服器忙線中");
                                }
                                temp.load=false;
                            });
                }
            });
        },null);
    };
 
    /** 搜尋類別-顯示、不顯示
     * @param obj 分類 object json
     */
    classSedisplay = (obj:pub.ncsccCtr)=>
    {
        pb.v($t,"classvue").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;

                Login((x)=>x.post("/nscc/mg/ad/csdisplay")
                        .input({"key":obj.key,"fkey":obj.fkey})
                        ,(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                obj.display = e2.display;
                                obj.mark = e2.mark;
                            }
                            else
                            {
                                mt.viewAlert("伺服器忙線中");
                            }
                            temp.load=false;
                        });
            }
        });
    };
};


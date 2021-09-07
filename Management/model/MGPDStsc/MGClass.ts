import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";


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
/** class 分類name(product) */
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
                if(val.cl.length==0)
                {//還原顯示
                    if(self.loadClAry){

                    }

                    if(self.loadClAry.indexOf(val.key)==-1)
                    {
                        self.loadClAry.push(val.key);
                        self.classSeList(val,()=>
                        {
                            fun(val.cl);
                            self.loadClAry = [];//清空阻擋
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

    //--------------第一層分類
    /** 往上移
     * @param obj 第一層分類 object json
     */
    classFirstPre = (obj:pub.pctCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>
                            x.post("/pc/mg/sys/productcfpre")
                            .input({key:obj.key})
                            ,(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        /** 第一層分類  container */
                                        let newOrder:Array<pub.pctCtr> = [];
                                        /** 交換位置 container */
                                        let changeOrder:Array<pub.pctCtr> = [];
                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
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
                                        $t.productcs = newOrder;
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
    classFirstNext = (obj:pub.pctCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcfnext")
                        .input({key:obj.key})
                        ,(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        /** 第一層分類  container */
                                        let newOrder:Array<pub.pctCtr> = [];
                                        /** 交換位置 container */
                                        let changeOrder:Array<pub.pctCtr> = [];
                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
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
                                        $t.productcs = newOrder;
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
    classFirstList = ()=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;
                Login((x)=>x.post("/pc/mg/sys/productcflist"),(e2:any)=>{
                            if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                            {
                                /** 建立語系位置 */
                                let getAryLang:Array<string> = [];
                                for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                                {
                                    getAryLang.push("");//補語系位置
                                }

                                /* first input create us */
                                let addFirst:pub.pctCtr= {key:"",store:jEnum.Enum_ProductStore.all,nameAry:getAryLang ,order:0,mark:""} as pub.pctCtr;
                                addFirst.cl = [];
                                addFirst.opencl = false;
                                addFirst.firstinput = true;

                                /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                                let getProduct:Array<pub.pctCtr>= [addFirst];
                                e2.data.forEach((val:pub.pctCtr,nu:number)=>{
                                    val.cl=[];
                                    val.opencl=false;
                                    val.firstinput=true;
                                    for(let a=val.nameAry.length;a<($t.main as pub.main).pub.langAry.length;a++)
                                    {
                                        val.nameAry.push("");//補語系位置
                                    }
                                    getProduct.push(val);
                                });
                                $t.productcs = getProduct;
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

    /** 分類第一層 edit */
    classEditF = (obj:pub.pctCtr)=>
    {
        if(($t.main as pub.main).pub.catchLangName(obj.nameAry).replace(/ /g,"")!="" && ($t.main as pub.main).pub.catchLangName(obj.nameAry)!="(null)")
        {
            pb.v($t,"classview").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcfed")
                        .input({"key":obj.key,"name":JSON.stringify(obj.nameAry),"store":obj.store})
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
                                        let addFirst:pub.pctCtr= {key:"",store:jEnum.Enum_ProductStore.all,nameAry:getAryLang ,order:0,mark:""} as pub.pctCtr;
                                        addFirst.cl = [];
                                        addFirst.opencl = false;
                                        addFirst.firstinput = true;

                                        /** 第一層 分類 first create使用row 及 第一層分類 container list  */
                                        let createList:Array<pub.pctCtr> = [addFirst,e2.data];
                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                        {
                                            if(val.key!="")
                                            {
                                                val.order+=1;
                                                createList.push(val);
                                            }
                                        });
                                        $t.productcs = createList;
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
    classDelF = (obj:pub.pctCtr)=>
    {
        mt.viewConfirm("是否確認刪除？("+($t.main as pub.main).pub.catchLangName(obj.nameAry)+")",()=>{
            pb.v($t,"classview").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcfdel")
                        .input({"key":obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    /** 重建 分類第一層 list */
                                    let createList:Array<pub.pctCtr> = [] ;
                                    $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                    {
                                        if(obj.key!=val.key)
                                        {
                                            if(obj.order<val.order){
                                                val.order-=1;
                                            }
                                            createList.push(val);
                                        }
                                    });
                                    $t.productcs = createList;

                                    if(obj.key==$t.selfclassmain)
                                    {//因刪除而復歸- 一般商品
                                        $t.selfclassmain = "333";
                                    }

                                    pb.v($t,"GiftView").async((temp2:any)=>
                                    {//因刪除而復歸-推薦
                                        if(obj.key==temp2.selfclassmain)
                                        {
                                            temp2.selfclassmain = "333";
                                        }
                                    });
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
    classDisplayF = (obj:pub.pctCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;
                Login((x)=>x.post("/pc/mg/sys/productcfdisplay")
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
    classSePre = (obj:pub.pcsCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcspre")
                        .input({key:obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                        {
                                            if(obj.fkey==val.key)
                                            {
                                                /** 第二層分類  container */
                                                let newOrder:Array<pub.pcsCtr> = [];
                                                /** 交換位置 container */
                                                let changeOrder:Array<pub.pcsCtr>= [];
                                                val.cl.forEach((val2:pub.pcsCtr,nu2:number)=>{
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
    classSeNext = (obj:pub.pcsCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                if(obj.key!="")
                {
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcsnext")
                            .input({key:obj.key}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    if(obj.order!=e2.order)
                                    {//確認 排序位移
                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                        {
                                            if(obj.fkey==val.key)
                                            {
                                                /** 第二層分類  container */
                                                let newOrder:Array<pub.pcsCtr> = [];
                                                /** 交換位置 container */
                                                let changeOrder:Array<pub.pcsCtr> = [];
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
     *  @param fun 取用完成後執行 function
     */
    classSeList = (obj:pub.pctCtr,fun:Function)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                obj.opencl = !obj.opencl;
                if(obj.cl.length==0){
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcslist").input({key:obj.key}),(e2:any)=>
                    {
                        if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                        {
                            /** 建立語系位置 */
                            let getAryLang:Array<string> = [];
                            for(let a=0;a<($t.main as pub.main).pub.langAry.length;a++)
                            {
                                getAryLang.push("");//補語系位置
                            }

                            /* first input create us */
                            let addFirst:pub.pcsCtr= {key:"",nameAry:getAryLang,store:jEnum.Enum_ProductStore.all ,order:0,fkey:obj.key,mark:""} as pub.pcsCtr;
                            addFirst.firstinput = true;

                            /** 第二層 分類 first create使用row 及 第一層分類 container list  */
                            let createList:Array<pub.pcsCtr> = [addFirst];
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
                            mt.viewAlert("伺服器忙線中");
                        }
                        temp.load=false;
                        if(fun!=null && fun!=undefined){
                            fun();//async 運行
                        }
                    });
                }

            }
        });
    };

    /** 分類第二層 edit  
     * @param obj 第二層分類json:any 
     * */
    classSeEdit = (obj:pub.pcsCtr)=>
    {
        if(($t.main as pub.main).pub.catchLangName(obj.nameAry).replace(/ /g,"")!="" && ($t.main as pub.main).pub.catchLangName(obj.nameAry)!="(null)")
        {
            pb.v($t,"classview").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcsed")
                            .input({"key":obj.key,"name":JSON.stringify(obj.nameAry),"fkey":obj.fkey,"store":obj.store}),
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
                                        let addFirst:pub.pcsCtr= {key:"",nameAry:getAryLang,store:jEnum.Enum_ProductStore.all  ,order:0,fkey:obj.fkey,mark:""} as pub.pcsCtr;
                                        addFirst.firstinput = true;

                                        /** 分類第二層 create 用 first row 及 container list */
                                        let createList:Array<pub.pcsCtr> = [addFirst,e2.data];

                                        $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                        {
                                            if(val.key == obj.fkey){
                                                val.cl.forEach((val2:pub.pcsCtr,nu2:number)=>
                                                {
                                                    if(val2.key!="")
                                                    {
                                                        val2.order+=1;
                                                        createList.push(val2);
                                                    }
                                                });
                                                val.cl = createList;
                                            
                                                if($t.selfclassmain==obj.fkey)
                                                {//商品設定 同步次分類
                                                    $t.productcsSec = val.cl;
                                                }

                                                pb.v($t,"GiftView").async((temp2:any)=>
                                                {//推薦 同步次分類
                                                    if(temp2.selfclassmain==obj.fkey)
                                                    {
                                                        temp2.productcsSec = val.cl;
                                                    }
                                                });
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
    classSeDel =(obj:pub.pcsCtr)=>
    {
        mt.viewConfirm("是否確認刪除？("+($t.main as pub.main).pub.catchLangName(obj.nameAry)+")",()=>
        {
            pb.v($t,"classview").async((temp:any)=>
            {
                if(!temp.load)
                {//防連點
                    temp.load=true;
                    Login((x)=>x.post("/pc/mg/sys/productcsdel")
                            .input({"key":obj.key,"fkey":obj.fkey}),(e2:any)=>{
                                if(Number(e2.error) == jEnum.Enum_SystemErrorCode.Null)
                                {
                                    /** 取得當下資料設定 */
                                    let catchCl:Array<pub.pcsCtr> = [];
                                    $t.productcs.forEach((val:pub.pctCtr,nu:number)=>
                                    {
                                        if(obj.fkey==val.key)
                                        {
                                            /** 分類第一層 重建lsit */
                                            let createList:Array<pub.pcsCtr> = [];
                                            val.cl.forEach((val2:pub.pcsCtr,nu2:number)=>{
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
                                    {//因刪除而復歸- 一般商品
                                        $t.selfclass  = "999";
                                        $t.productcsSec = catchCl;
                                    }

                                    pb.v($t,"GiftView").async((temp2:any)=>
                                    {//因刪除而復歸-推薦
                                        if(obj.key==temp2.selfclass)
                                        {
                                            temp2.selfclass = "999";
                                            temp2.productcsSec = catchCl;
                                        }
                                    });
                                }
                                else if(Number(e2.error)==-108)
                                {
                                    mt.viewAlert("無法刪除！(已綁定商品)");
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
    classSedisplay = (obj:pub.pcsCtr)=>
    {
        pb.v($t,"classview").async((temp:any)=>
        {
            if(!temp.load)
            {//防連點
                temp.load=true;

                Login((x)=>x.post("/pc/mg/sys/productcsdisplay")
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
}
import pbM from "../../../models/pb";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 主要(結帳) */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
    }

    /** 套餐模式 結束鈕動畫 */
    closeSetBt=()=>
    {
        pb.el.id("closeSetBt").animate({"duration":1,"delay":0,"count":"infinite"},
        {//閃爍
            "0%":{"opacity": "0.5"},

            "66%":{"opacity": "1"},

            "100%":{"opacity": "0.5"},
        });
    }
    /** 前往套餐add model button 動畫 */
    productcarAddGoBt=()=>
    {
        pb.el.id("productcarAddGoBt").animate({"duration":2,"delay":0,"count":"infinite"},
        {//閃爍
            "0%":{"opacity": "0.5" ,"width":"35px","top":"0px"},

            "86%":{"opacity": "1","width":"40px","top":"-2px"},

            "100%":{"opacity": "0.5","width":"35px","top":"0px"},
        });
    }

    /** 套餐add button 動畫 */
    productcarAddBt=()=>
    {
        pb.el.id("productcarAddBt").animate({"duration":2,"delay":0,"count":"infinite"},
        {//閃爍
            "0%":{"opacity": "0.5"},

            "66%":{"opacity": "1"},

            "100%":{"opacity": "0.5"},
        });
    }

 /** 套餐 menu modle choose */
 menuModel=()=>
 {
     pb.v($t,"payMenuView/setMenuToolView").async((e:any)=>
     {
         /** 階層下 element*/
         let el = pb.el.id("SetPayMenuPanel").id("chooseNuPanel").id("menuModel");


         pb.el.id("SetPayMenuPanel").id("productcar").id("chooseNuPage").frame((e2)=>{
             if(e.menuModel=="add")
             {
                 e2.animate({"duration":0.3,"delay":0,"count":1},
                 {//add open chooseNu select move
                     "0%":{"right":"40%"},
                     "80%":{"right":"35%"},
                     "100%":{"right":"10%"},
                 }).style({"right":"10%" });
             }
             else
             {
                 e2.animate({"duration":0.3,"delay":0,"count":1},
                 {//add open chooseNu select move
                     "0%":{"right":"10%"},
                     "70%":{"right":"15%"},
                     "100%":{"right":"40%"},
                 }).style({"right":"40%" });
             }
         });

         el.id(((e.menuModel=="add")?"old":"add")).animate({"duration":0.1,"delay":0,"count":1},
         {//退色
             "0%":{"opacity": "1","background-color":"#555","color":"#FFF","font-size":"15px","width":"75px"},
             "100%":{"opacity": "0.5","background-color":"#ccc","color":"#999","font-size":"12px","width":"15px"},
         }).style({ "background-color":"#CCC","color":"#999","font-size":"12px;","width":"15px" });

         el.id(((e.menuModel=="add")?"add":"old")).animate({"duration":0.1,"delay":0,"count":1},
         {//生色
             "0%":{"opacity": "0.5","background-color":"#ccc","color":"#999" ,"font-size":"12px","width":"15px"},
             "100%":{"opacity": "1","background-color":"#555","color":"#FFF" ,"font-size":"15px","width":"75px"},
         }).style({ "background-color":"#555","color":"#FFF" ,"font-size":"15px;","width":"75px"})

     });
 };

     /**
     * 套餐(添加餐點)刪除動畫
    */
   setAddRemove=(name:string,fun:any)=>
   {
       pb.el.name(name).animate({"duration":0.2,"delay":0,"count":1},
        {//退閃
            "0%":{"opacity": "0.9","font-size":"20px"},
            "100%":{"opacity": "0.1","font-size":"12px"},
        }).frame((e:any)=>{
            fun();
        }).remove();
    };

    /**
     * 無法新增 count 數動畫題示
     * @param nu
     */
    stopIncrease=(nu:Number)=>
    {
        pb.el.id("setincrease"+nu).animate({"duration":0.3,"delay":0,"count":1},
        {//紅閃
            "0%":{"opacity": "0.7","background-color":"#FF3300"},
            "60%":{"opacity": "0.7","background-color":"#FF3300"},
            "100%":{"opacity": "1","background-color":"#FF8800"},
        }).remove();
    };

    /**
     * 無法減少 count 數動畫題示
     * @param nu
     */
    stopdecrease=(nu:Number)=>
    {
        pb.el.id("setdecrease"+nu).animate({"duration":0.3,"delay":0,"count":1},
        {//紅閃
            "0%":{"opacity": "0.2","background-color":"#FF3300"},
            "60%":{"opacity": "0.7","background-color":"#FF3300"},
            "100%":{"opacity": "1","background-color":"#FF8800"},
        }).remove();
    };
}
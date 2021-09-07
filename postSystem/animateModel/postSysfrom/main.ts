import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import iLoad from "../../../models/importLoad";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj?:jObjM,
    /** psyl oad system */
    importLoad?:iLoad,
}

import set from "./setMenu";
import apM from "./addPointQRScreen";
/** temp this */
let $t:any | undefined;
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),importLoad:eval("importLoad")};
export default class main{
    set:set|undefined;
    addPoint:apM|undefined;
    constructor($tObj:any) {
        $t=$tObj;
        this.set = new set($tObj,$e);
        this.addPoint = new apM($tObj,$e);
    }

    /** 更多商品 page button */
    productMore=(action:Function)=>{
        $e.pb.el.class("productLi").style({"opacity":"0.1"}).delay(0.6).animate({"duration":0.2,"delay":0,"count":1},
        {//淡化商品顯示
            "0%":{"opacity": "0.1"},
            "33%":{"opacity": "1"},
            "66%":{"opacity": "0.1"},
            "77%":{"opacity": "1"},
            "88%":{"opacity": "0.1"},
            "100%":{"opacity": "1"},
        }).remove();

        $e.pb.el.id("moreProductPanel").animate({"duration":0.6,"delay":0,"count":1},
        {//移動結束
            "0%":{"opacity": "1","top":"10%","right":"0%","border":"3px solid #FF8800"},
            "70%":{"opacity": "1","top":"80%","right":"45%","border":"3px solid #FF8800"},
            "100%":{"opacity": "0.3","top":"80%","right":"45%","border":"3px solid #FF8800"},
        }).frame((e:any)=>{
            action();
        }).remove();
    };

    /**
     *  找零to 結帳 get 數動畫
     * @param name element id
     */
    NumberClick=(name:string)=>{
        $e.pb.el.id(name).animate({"duration":0.2,"delay":0,"count":1},
        {//閃爍
            "0%":{"opacity": "0.3"},
            "33%":{"opacity": "1"},
            "66%":{"opacity": "0.3"},
            "88%":{"opacity": "1"},
            "100%":{"opacity": "0.3"},
        }).remove();
    };
    
    /**
     *  讓get 數動畫
     * @param name element id
     */
    allowancesClick=(name:string)=>{
        $e.pb.el.id(name).animate({"duration":0.2,"delay":0,"count":1},
        {//閃爍
            "0%":{"opacity": "0.3"},
            "33%":{"opacity": "1"},
            "66%":{"opacity": "0.3"},
            "88%":{"opacity": "1"},
            "100%":{"opacity": "0.3"},
        }).remove();
    };

    /**
     *  checkOut 動畫閃爍
     */
    loadCheckout=()=>
    {
        /** self=class=this */
        var self:any=this;
        $e.pb.el.id("checkoutLoad").style({
            "position":"relative",
            "margin-left":"auto",
            "margin-right":"auto"
        }).animate({"duration":1,"delay":0,"count":1},
                {//閃燐 升縮
                    "0%":{"opacity": "0.3","width":"60%"},
                    "33%":{"opacity": "1","width":"20%"},
                    "66%":{"opacity": "0.3","width":"100%"},
                    "88%":{"opacity": "1","width":"30%"},
                    "100%":{"opacity": "0.3","width":"90%"},
                }).remove()
                .frame((e:any)=>{//再次喚醒動畫
                    setTimeout(function(){
                        $e.pb.v($t.mainTemp,"head_temp").async((e:any)=>{
                            if(e.load)
                            {
                                self.loadCheckout();
                            }
                        });
                    },20);
            });
    }

    /**
     * 打單add 項目動畫
    */
    pay=(name:string,remove:boolean,fun:Function)=>
    {
        $e.pb.el.name(name).frame((e:any)=>{
                if(!remove)
                {//計算動畫
                    e.animate({"duration":0.3,"delay":0,"count":1},
                    {//閃耀
                        "0%":{"opacity": "1" ,"color":"#FF8800","background-color":"#FFF"},
                        "33%":{"opacity": "1" ,"color":"#FF8800","background-color":"#FFF"},
                        "100%":{"opacity": "0.3" ,"color":"#FF8800" ,"background-color":"#FFF"},
                    }).remove();

                    if(name.indexOf("productnameMenu")==-1)
                    {//僅限增加
                        $e.pb.el.id("chooseBall")
                        .id("productAddName")
                        .animate({"duration":0.7,"delay":0,"count":1},
                        {//商品名稱提示放大
                            "0%":{"width": "200px","font-size":"25px","right":"50px","top":"-50px","padding":"10px","opacity":"1"},
                            "80%":{"width": "200px","font-size":"25px","right":"50px","top":"-50px","padding":"10px","opacity":"1"},
                            "100%":{"width": "100px","font-size":"12px","right":"10px","top":"-20px","padding":"5px","opacity":"0.1"},
                        }).remove();
                    }

                    $e.pb.el.id("chooseBallItem").animate({"duration":0.2,"delay":0,"count":1},
                    {//計數黃球放大
                        "0%":{"width": "30px","height":"30px","border-radius":"100px","font-size":"12px"},
                        "100%":{"width": "40px","height":"30px","padding-top":"8px","border-radius":"100px","font-size":"25px","top":"245px"},
                    }).remove();
                }
                else
                {//刪除動畫
                    e.animate({"duration":0.2,"delay":0,"count":1},
                    {//退閃
                        "0%":{"opacity": "0.9","font-size":"20px"},
                        "100%":{"opacity": "0.1","font-size":"12px"},
                    }).frame((e2:any)=>{
                        fun();
                    }).remove();
                }
        });
    }
};


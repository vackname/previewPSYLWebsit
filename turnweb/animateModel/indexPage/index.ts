import * as pub from "../../../JsonInterface/pub";

import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
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
/** 系統共用 */
let main:pub.main;
/** 首頁輪播 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        ajax = $eObj.ajax;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 僅載入一次 */
    private pImgLoad:boolean=true;
    /** 載入首頁輪播動畫 */
    protalImgLoad =()=>
    {
        if(pb.el.id("protalPanleImg").exist)
        {
            if(this.pImgLoad)
            {
                this.pImgLoad=false;
                pb.v($t,"protalVue").async(e=>
                {
                    let catchImg:string = JSON.stringify(e.INDEOXimgary);
                    e.INDEOXimgary = [];
                    e.protalImg = new (Jobj as any)();
                    (e.protalImg as jObjM)//緩儲圖片容器
                    .loadimgjson("/imgprotalindex")//載入圖片
                    .input(JSON.parse(catchImg))
                    .async((e3,next3)=>
                    { 
                        e3.forEach((val3,nu3)=>
                        {
                            e.INDEOXimgary.push(val3);
                        });
                        /** 匹次載圖 */
                        let reNext = (re:(fun:nextImgLoad)=>void)=>
                        {       
                            //圖片載入完成 imglist
                            if(re!=null)
                            {
                                re((e4,next4)=>
                                {
                                    e4.forEach((val3,nu3)=>
                                    {
                                        e.INDEOXimgary.push(val3);
                                    });
                                    reNext(next4);
                                });
                            }
                        }
                        reNext(next3);
                    });
                    self.reProtalImg();
                });
            }

        }
        else
        {
            setTimeout(()=>{
                self.protalImgLoad();
            },200);
        }
    }

    /** 輪播動畫 */
    private reProtalImg=()=>
    {
        pb.v($t,"protalVue").async(e=>{
            pb.el.id("protalPanleImg")//照片切換
            .animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "1"},
                "100%":{"opacity": "0.2"},
            }).style({"opacity":"0.1"}).frame(f=>{
                if(e.indexNu+1<e.INDEOXimgary.length-1)
                {
                    e.indexNu++;
                }
                else
                {
                    e.indexNu=0;
                }
                pb.el.id("protalPanleImg").animate({"duration":1,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"opacity": "1"},
                    "100%":{"opacity": "0.3"},
                }).style({"opacity":"1"});//移除動畫
                }).delay(1).animate({"duration":19,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"opacity": "0.2"},
                    "90%":{"opacity": "0.2"},
                    "100%":{"opacity": "1"},
                }).remove();//移除動畫
        

            pb.el.id("titleProtalPnale1" )
            .animate({"duration":2,"delay":0,"count":1},
            {//標題1漸顯動畫
                "0%":{"opacity": "0"},
                "100%":{"opacity": "0"},
            }).animate({"duration":9,"delay":0,"count":1},
            {//標題1漸淡動畫
                "0%":{"opacity": "0.1","top":"40%","font-size":"20px;"},
                "15%":{"opacity": "1","top":"40%","font-size":"30px;"},
                "94%":{"opacity": "1","top":"40%","font-size":"30px;"},
                "100%":{"opacity": "0.1","top":"40%","font-size":"20px;"},
            }).remove();//移除動畫

            pb.el.id("tpptur1")
            .animate({"duration":3,"delay":0,"count":1},
            {//標題1_分段1等候
                "0%":{"top":"20px"},
                "100%":{"top":"20px"},
            }).animate({"duration":8,"delay":0,"count":1},
            {//標題1_分段1漸顯、彈跳、轉色動畫
                "0%":{"top":"20px","color":"#FFFF"},
                "95%":{"top":"20px","color":"#FFF"},
                "100%":{"top":"20px","color":"#FF8800"},
            }).remove();//移除動畫

            pb.el.id("tpptur2")
            .animate({"duration":6,"delay":0,"count":1},
            {//標題1_分段1等候
                "0%":{"top":"0px","opacity":"0"},
                "100%":{"top":"0px","opacity":"0"},
            }).animate({"duration":5,"delay":0,"count":1},
            {//標題1_分段2漸顯、彈跳、轉色動畫
                "0%":{"top":"0px","color":"#FF8800"},
                "5%":{"top":"20px","color":"#FFF"},
                "95%":{"top":"20px","color":"#FFF"},
                "100%":{"top":"20px","color":"#FF8800"},
            }).remove();//移除動畫

            pb.el.id("tpptur3" )
            .animate({"duration":3,"delay":0,"count":1},
            {//標題1_分段3等候
                "0%":{"top":"20px","left":"-60px"},
                "100%":{"top":"20px","left":"-60px"},
            })
            .animate({"duration":3,"delay":0,"count":1},
            {//標題1_分段3漸顯、彈跳、轉色動畫
                "0%":{"left":"-60px","top":"20px"},
                "90%":{"left":"-60px","top":"20px"},
                "95%":{"left":"-50px","top":"20px"},
                "100%":{"left":"0px","top":"20px"},
            })
            .animate({"duration":5,"delay":0,"count":1},
            {//標題1_分段3漸顯、彈跳、轉色動畫
                "0%":{"top":"20px","color":"#FF8800"},
                "10%":{"top":"20px","color":"#FFF"},
                "95%":{"top":"20px","color":"#FFF"},
                "100%":{"top":"20px","color":"#FF8800"},
            }).remove();//移除動畫

            pb.el.id("tpptur4")
            .animate({"duration":6,"delay":0,"count":1},
            {//標題1_分段3等候
                "0%":{"top":"0px","opacity":"0"},
                "100%":{"top":"0px","opacity":"0"},
            }).animate({"duration":5,"delay":0,"count":1},
            {//標題1_分段3漸顯、彈跳、轉色動畫
                "0%":{"top":"0px","color":"#AAA"},
                "5%":{"top":"20px","color":"#FFF"},
                "95%":{"top":"20px","color":"#FFF"},
                "100%":{"top":"20px","color":"#AAA"},
            }).remove();//移除動畫


            pb.el.id("titleProtalPnale2" ).animate({"duration":12,"delay":0,"count":1},
            {//標題2等候
                "0%":{"opacity": "0"},
                "100%":{"opacity": "0"},
            })
            .animate({"duration":1,"delay":0,"count":1},
            {//標題2漸顯動畫
                "0%":{"opacity": "0.1","bottom":"40%"},
                "100%":{"opacity": "1","bottom":"50%"},
            }).animate({"duration":6,"delay":0,"count":1},
            {//標題2漸淡動畫 右移出
                "0%":{"opacity": "1","bottom":"50%"},
                "95%":{"opacity": "1","bottom":"50%","left":"0%"},
                "100%":{"opacity": "0.1","bottom":"130%","left":"0"},
            }).remove();//移除動畫
        });
        setTimeout(()=>{
            self.reProtalImg();
        },20000);
    }
}
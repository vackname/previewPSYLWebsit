import pbM from "../../../models/pb";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** load file  */
let Jobj:jObjM;
/** 入口 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
    }
    /** 僅載入一次 */
    private inviteImgLoad:boolean=true;
    /** 載入首頁輪播動畫 */
    inviteImg =()=>
    {   
        if(pb.el.id("turInviatePanlelImg").exist)
        {
            if(self.inviteImgLoad)
            {
                pb.el.id("turInviatePanlelImg")//照片等候
                .animate({"duration":1,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"opacity": "0"},
                    "80%":{"opacity": "0"},
                    "100%":{"opacity": "1"},
                }).remove();

                this.inviteImgLoad=false;
                let catchImg:string = JSON.stringify($t.Ary);
                $t.Ary = [];
                $t.invateImg = new (Jobj as any)();
                ($t.invateImg as jObjM)//緩儲圖片容器
                .loadimgjson("/ImgInvite")//載入圖片
                .input(JSON.parse(catchImg))
                .async((e3,next3)=>
                { 
                    e3.forEach((val3,nu3)=>
                    {
                        $t.Ary.push(val3);
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
                                    $t.Ary.push(val3);
                                });
                                reNext(next4);
                            });
                        }
                    }
                    reNext(next3);
                });
                self.reImg();
            }

        }
        else
        {
            setTimeout(()=>{
                self.inviteImg();
            },200);
        }
    }

    /** 輪播動畫 */
    private reImg=()=>
    {
        if(pb.el.id("turInviatePanlelImg").exist)
        {
            if($t.stop==0)
            {
                pb.el.id("turInviatePanlelImg")//照片切換
                .style({"opacity":"0.1"}).frame(f=>{
                    if($t.indexNu+1<$t.Ary.length-1)
                    {
                    $t.indexNu++;
                    }
                    else
                    {
                    $t.indexNu=0;
                    }
                    pb.el.id("turInviatePanlelImg").animate({"duration":1,"delay":0,"count":1},
                    {//img漸顯動畫
                        "0%":{"opacity": "0.1"},
                        "100%":{"opacity": "1"},
                    }).style({"opacity":"1"});//移除動畫
                }).delay(1).animate({"duration":5,"delay":0,"count":1},
                {//img漸淡動畫
                    "0%":{"opacity": "1"},
                    "90%":{"opacity": "1"},
                    "100%":{"opacity": "0.2"},
                }).remove();//移除動畫
            }
            else
            {
                $t.stop--;
            }
            setTimeout(()=>{
                self.reImg();
            },5100);
        }
    }
};


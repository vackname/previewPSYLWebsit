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
/** login */
/** 共好輪播 */
export default class model
{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        Jobj = $eObj.Jobj;
        self = this;
    }

    /** 僅載入一次 */
    private goodImgLoad:boolean=true;
    /** 載入首頁輪播動畫 */
    goodImg =()=>
    {   
        if(pb.el.id("aboutStoryGoodPanlelImg").exist)
        {
            if(self.goodImgLoad)
            {
                pb.el.id("aboutStoryGoodPanlelImg")//照片等候
                .animate({"duration":1,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"opacity": "0"},
                    "80%":{"opacity": "0"},
                    "100%":{"opacity": "1"},
                }).remove();

                this.goodImgLoad=false;
                let catchImg:string = JSON.stringify($t.goodAry);
                $t.goodAry = [];
                $t.goodImg = new (Jobj as any)();
                self.toLoad(catchImg);
                setTimeout(()=>
                {//第二次緩載
                    self.toLoad(JSON.stringify($t.goodAryWait));
                },1000);
                setTimeout(()=>
                {//第三次緩載
                    self.toLoad(JSON.stringify($t.goodAryWait2));
                },3000);
                setTimeout(()=>
                {//第四次緩載
                    self.toLoad(JSON.stringify($t.goodAryWait3));
                },4000);
                setTimeout(()=>
                {//第五次緩載
                    self.toLoad(JSON.stringify($t.goodAryWait4));
                },5000);
                self.reImg();
            }

        }
        else
        {
            setTimeout(()=>{
                self.goodImg();
            },200);
        }
    }

    /**
     * 分匹緩載
    */
    private toLoad =(catchImg:string)=>
    {
        ($t.goodImg as jObjM)//緩儲圖片容器
        .loadimgjson("/gImgAbout")//載入圖片
        .input(JSON.parse(catchImg) as Array<string>)
        .async((e3,next3)=>
        { 
            e3.forEach((val3,nu3)=>
            {
                $t.goodAry.push(val3);
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
                            $t.goodAry.push(val3);
                        });
                        reNext(next4);
                    });
                }
            }
            reNext(next3);
        });
    }

     /** 輪播動畫 */
     private reImg=()=>
     {
        if(pb.el.id("aboutStoryGoodPanlelImg").exist)
        {
            if($t.stopGood==0)
            {
                pb.el.id("aboutStoryGoodPanlelImg")//照片切換
                .style({"opacity":"0.1"}).frame(f=>{
                    if($t.indexGoodNu+1<$t.goodAry.length-1)
                    {
                        $t.indexGoodNu++;
                    }
                    else
                    {
                        $t.indexGoodNu=0;
                    }
                    pb.el.id("aboutStoryGoodPanlelImg").animate({"duration":1,"delay":0,"count":1},
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
                $t.stopGood--;
            }
             setTimeout(()=>{
                 self.reImg();
             },5100);
        }
     }
};


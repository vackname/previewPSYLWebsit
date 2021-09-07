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
/** 餐、理念 */
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
    private setImgLoad:boolean=true;
    /** 載入理念 */
    setImg =()=>
    {
        if(pb.el.id("aboutStorySetTB").exist)
        {
            pb.el.id("aboutStorySetTB")//理念
            .animate({"duration":0.5,"delay":0,"count":1},
            {//img 等候
                "0%":{"opacity": "0"},
                "100%":{"opacity": "0"},
            }).frame(f=>
            {
                f.animate({"duration":1,"delay":0,"count":1},
                {//img漸顯動畫
                    "0%":{"opacity": "0"},
                    "90%":{"opacity": "0"},
                    "100%":{"opacity": "1"},
                });

                if(self.setImgLoad)
                {
                    self.setImgLoad=false;
                    let catchImg:string = JSON.stringify($t.setAry);
                    $t.setAry = [];
                    $t.setImg = new (Jobj as any)();
                    self.toLoad(catchImg);
                    setTimeout(()=>
                    {//第二次緩載
                        self.toLoad(JSON.stringify($t.setAryWait));
                    },500);
                    setTimeout(()=>
                    {//第三次緩載
                        self.toLoad(JSON.stringify($t.setAryWait2));
                    },1500);
                    
                }
            }).delay(1).remove();

            pb.el.id("aboutStoryClassTB")//照片 服務分類
            .animate({"duration":3,"delay":0,"count":1},
            {//img wait
                "0%":{"opacity": "0"},
                "100%":{"opacity": "0"},
            }).animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0"},
                "90%":{"opacity": "0"},
                "100%":{"opacity": "1"},
            }).remove();
        }
        else
        {
            setTimeout(()=>{
                self.setImg();
            },200);
        }

    }

    /**
     * 分匹緩載
    */
    private toLoad =(catchImg:string)=>
    {
        ($t.setImg as jObjM)//緩儲圖片容器
        .loadimgjson("/setImgAbout")//載入圖片
        .input(JSON.parse(catchImg))
        .async((e3,next3)=>
        { 
            e3.forEach((val3,nu3)=>
            {
                $t.setAry.push(val3);
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
                            $t.setAry.push(val3);
                        });
                        reNext(next4);
                    });
                }
            }
            reNext(next3);
        });

    }
};

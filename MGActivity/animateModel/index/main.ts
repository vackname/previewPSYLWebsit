
import pbM from "../../../models/pb";

/** models */
interface modelsFormat
{
    pb:pbM,
}

const $e:modelsFormat = {pb:eval("pb")};

export default class main{
    constructor($tObj:any) {

    }
    /** 圖片匹次載入動畫
     * @param count 20秒後不在等候動畫
     */
    loadImg = (key:string,count:number)=>
    {
        let _this:main=this;
        if($e.pb.el.id(key).exist)
        {
            $e.pb.el.id(key)
            .animate({"duration":1,"delay":0,"count":1},
            {//img漸顯動畫
                "0%":{"opacity": "0.1"},
                "100%":{"opacity": "1"},
            }).remove();//移除動畫
        }
        else
        {
            setTimeout(()=>{
                count--;
                _this.loadImg(key,count);
            },20);
        }
    }
};


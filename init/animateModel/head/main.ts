import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
}


const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    $t:any;
    constructor($tObj:any) {
        this.$t = $tObj;
    }

    /** 謹起動一次 載入運行動畫 */
    private firstLoad:boolean=true;
    /**
     *  動畫閃爍 網站下載初始化或event load
     */
    headInit=()=>
    {
        if(this.firstLoad)
        {
            this.firstLoad = false;
            $e.pb.el.id("HeadPanelLoad").animate({"duration":3,"delay":0,"count":"infinite"},
            {//漸顯動畫
                "0%":{"opacity": "1","width":"100%","left":"0%"},
                "66%":{"opacity": "0.3","width":"60%","left":"20%"},
                "100%":{"opacity": "1","width":"100%","left":"0%"},
            });
        }

    };
    
    /** 防止連點進入 */
    private stopGoto:boolean =false;
    /** 取最後一個 point 運行function */
    private runPointFuns:any =null;
    /** 點數新增減少動畫  */
    pointAddDes = (point:number,fun:Function)=>
    {
        let _this:main = this;
        if(!_this.stopGoto)
        {
            if(point!=0)
            {
                _this.runPointFuns = fun;
                _this.stopGoto = true;
                if(point>0)
                {//增加
                    $e.pb.el.id("HeadPointCtr")
                    .animate({"duration":1,"delay":0,"count":1},
                    {//漸淡動畫
                        "0%":{"width":"30px","height":"30px","opacity": "0.3","top":"120px","right":"90px"},
                        "86%":{"width":"60px","height":"60px","opacity": "1","top":"50px","right":"30px"},
                        "100%":{"width":"60px","height":"60px","opacity": "0.3","top":"50px","right":"0px"},
                    }).remove();

                    $e.pb.el.id("headAnimateIcon").animate({"duration":1,"delay":0,"count":1},
                    {//增大動畫
                        "0%":{"width": "5px"},
                        "100%":{"width": "50px"},
                    }).frame((e)=>
                    {
                        _this.stopGoto = false;
                        _this.runPointFuns();
                        
                    }).remove();
                }
                else
                {//減少
                    $e.pb.el.id("HeadPointCtr")
                    .animate({"duration":1,"delay":0,"count":1},
                    {//漸淡動畫
                        "0%":{"width":"30px","height":"30px","opacity": "0.3","top":"50px","right":"0px"},
                        "86%":{"width":"60px","height":"60px","opacity": "1","top":"50px","right":"90px"},
                        "100%":{"width":"60px","height":"60px","opacity": "0.3","top":"120px","right":"90px"},
                    }).remove();

                    $e.pb.el.id("headAnimateIcon").animate({"duration":1,"delay":0,"count":1},
                    {//減小動畫
                        "0%":{"width": "5px"},
                        "100%":{"width": "50px"},
                    }).frame((e)=>
                    {
                        _this.stopGoto = false;
                        _this.runPointFuns();
                        
                    }).remove();
                }
            }
        }
        else  if(point!=0)
        {//超過1sec 動畫不理會
            this.runPointFuns = fun;
        }
    }

    /** 搜尋欄位動畫
     * @param 關鍵字取得
     */
    searchBar = ()=>
    {
      $e.pb.el.id("serTxtBoxAn")
      .animate({"duration":3,"delay":0,"count":1},
      {//漸淡動畫
          "0%":{"right":"0px","opacity":"0.2"},
          "13%":{"right":"60px","opacity":"1"},
          "80%":{"right":"60px","opacity":"0.8"},
          "100%":{"right":"30px","opacity":"0.2"},
      }).remove();
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

   /**
    * 購物車商品增加
   */
   ProductCarAdd=()=>
   {
        $e.pb.el.id("headPayCarBoxShowBt")
        .animate({"duration":0.1,"delay":0,"count":1},
        {//震動
            "0%":{"top":"20px","background-color":"1px solid #EEE"},
            "30%":{"top":"9px"},
            "90%":{"top":"20px","background-color":"#EEE"},
            "100%":{"top":"3px"},
        }).remove();//移除動畫

        $e.pb.el.id("headPayCarBoxShowBtNu")
        .animate({"duration":0.1,"delay":0,"count":1},
        {//換色
            "0%":{"background-color":"#FF8800"},
            "100%":{"background-color":"#FF0000"},
        }).remove();//移除動畫
   }
};
import pbM from "../../../models/pb";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** example model item1 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
    }
/**
     * 移除全部上傳預覽圖片動畫
     * @param key 刪除 段落列號+文章key
     * @param fun 運行結果function
    */
 removeAllUpload=(key:string,fun:Function)=>
 {
      pb.el.id('IUtakephotoAll'+key)
      .animate({"duration":0.3,"delay":0,"count":1},
      {//漸淡動畫
          "0%":{"opacity": "1"},
          "100%":{"opacity": "0.3"},
      }).remove();
      
      pb.el.id('IUtakephoto'+key)
     .animate({"duration":0.3,"delay":0,"count":1},
             {//漸淡動畫
                 "0%":{"opacity": "1"},
                 "100%":{"opacity": "0.3"},
             }).frame((e)=>{
                 fun();
             }).remove();//移除動畫

 }

  /**
   * 移除上傳 預覽圖片動畫
   * @param key 刪除 段落列號+文章key+img row number
   * @param fun 運行結果function
   */
  removeUpload=(key:string,fun:Function)=>
  {
      if(pb.el.id("UPimg"+key).exist)
      {//編緝視窗
          pb.el.id("UPimg"+key)
          .animate({"duration":0.3,"delay":0,"count":1},
          {//漸淡動畫
              "0%":{"opacity": "1"},
              "100%":{"opacity": "0.3"},
          }).frame((e)=>{
              fun();
          }).remove();//移除動畫
       }
  }

  /** data 異動(save 提示 icon)
   * @param key key
   */
  dataRefrsh = (key:string)=>
  {
      setTimeout(()=>{
          pb.el.id(key).animate({"duration":0.1,"delay":0,"count":1},
          {//漸淡動畫
              "0%":{"padding-top":"5px"},
              "66%":{"padding-top":"0px"},
              "100%":{"padding-top":"5px"}
          }).remove();
      },50);
  }

  /** 圖片匹次載入動畫
   * @param count 20秒後不在等候動畫
   */
  loadImg = (key:string,count:number)=>
  {
      let _this:model=this;
      if(pb.el.id(key).exist)
      {
          pb.el.id(key)
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
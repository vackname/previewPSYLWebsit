import pbM from "../../../models/pb";

import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM,nextImgLoad} from "../../../models/Jobj/interface";


/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** 會員 編緝 list page */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Login = (mt.$m.h.Login as pub.Login);
    }
    /** 載入個資 */
    loadMB = (uid:string)=>
    {
      pb.v($t,"AccountSet").v("mbinfoVue").async((info)=>
      {
        Login((x)=> x.post("/ma/mg/sysmg/myper").input({uid:uid}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
                info.perData = obj.data;
            }
            else
            {
              info.applyShow = false;
              mt.viewAlert("尚未設定個資！");
            }
        });
      });
    }  

    BankInfo= (uid:string)=>
    {
      pb.v($t,"AccountSet").v("mbinfoVue").async((info)=>
      {
        Login((x)=> x.post("/ma/mg/mbinfo/photobank").input({uid:uid}), (obj)=> 
        {//取圖片
            if (Number(obj.error) == jEnum.Enum_SystemErrorCode.Null) 
            {
              if(obj.img.length>0)
              {
                (info.bankPhoto as jObjM)
                .loadimgjson("/ma/mgmbbankimg/"+$t.input.uid)//載入圖片
                .input(obj.img)
                .async((e3,next3)=>
                {   
                    /** 匹次載圖 */
                    let reNext = (re:(fun:nextImgLoad)=>void)=>
                    {//圖片載入完成 imglist
                        if(re!=null)
                        {
                            re((e4,next4)=>
                            {
                                reNext(next4);
                            });
                        }
                    }
                    reNext(next3);
                    setTimeout(()=>{
                      info.bankImg = obj.img;
                    },300);
                });
              }
              else
              {
                info.bankShow = false;
                mt.viewAlert("尚未設定銀行交易資訊！");
              }
            }
            else
            {
              info.bankShow = false;
              mt.viewAlert("伺服器忙線中！");
            }
        });
      });
    }  

}
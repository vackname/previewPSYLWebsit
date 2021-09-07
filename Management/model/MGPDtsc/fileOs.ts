import pbM from "../../../models/pb";
import * as jEnum from "../../../JsonInterface/enum";
import * as pub from "../../../JsonInterface/pub";
import {jObj as jObjM} from "../../../models/Jobj/interface";

/** 語系分類選擇容器 */
interface langClass
{
    /** 語系名 */
    key:string,
    /** 語系代碼 */
    val:string
}

/** temp this */
let $t:any | undefined;
/** load file  */
let Jobj:jObjM;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** login */
let Login:pub.Login;
/** 入口點init project */
let mt:pub.mainTemp;
/** file os*/
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        Jobj = $eObj.Jobj;
        Login = (mt.$m.h.Login as pub.Login);
    }

    /** 匯入Excel(已確認完成) */
    CompleteUpload = (files:any)=>
    {
        mt.viewConfirm("是否確認單據已完成任務？",()=>
        Login((x)=>x.file("/mpay/mg/fileos/inputexcel").input({files:files.target.files}),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                mt.viewAlert("import OK!!",()=>{},$t.main.pub.lib.src('excelimport.png'));
                $t.$m.main.ser(true);
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            pb.el.id('historyupload').get.value ="";//清除上傳欄位
        }),null,$t.main.pub.lib.src('excelimport.png'));
    }

    /** 產生進貨單據 */
    Purchase = (files:any)=>
    {
        mt.viewConfirm("是否確認通知客戶店主-產生進貨單據？",()=>
        Login((x)=>x.file("/mpay/mg/fileos/purchase").input({files:files.target.files}),(e:any)=>
        {
            if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
            {
                mt.viewAlert("import OK!!",()=>{},$t.main.pub.lib.src('excelimport.png'));
            }
            else
            {
                mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
            }
            pb.el.id('PurchaseUpload').get.value ="";//清除上傳欄位
        }),null,$t.main.pub.lib.src('excelimport.png'));
    }

    /** 單據 excel 檔案匯出 */
    payHistoryDownload = ()=>
    {
        pb.v(mt,"head_temp").async((he:pub.mainHeadTemp)=>{
            if(he.load==0)
            {
                /** 載入條件 */
                let con:any={year:$t.YearInput,month:$t.MonthInput};
                if($t.connectionAC.key!="")
                {//活動空間模式
                    pb.AddPrototype(con,{"key":$t.connectionAC.key});
                }
                mt.viewConfirm("是否確認下載單據？",()=>
                Login((x)=>x.post("/mpay/mg/fileos/"+(($t.connectionAC.key=="")?"paypd":"payac")).input(con),(e:any)=>
                {
                    if(Number(e.error) == jEnum.Enum_SystemErrorCode.Null)
                    {//下載
                        var oa = document.createElement('a');
                        oa.href = 'data:'+e.f+';base64,'+e.data;
                        oa.download = e.n;//通過A標籤 設定檔名
                        oa.click();
                    }
                    else
                    {
                        mt.viewAlert(($t.main as pub.main).pub.config.get("error").svbusy);
                    }
                }),null,$t.main.pub.lib.src('exceldow.png'));
            }
        });
    }
}

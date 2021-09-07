import pbM from "../../../models/pb";

import iLoad from "../../../models/importLoad";
import * as pub from "../../../JsonInterface/pub";
import * as QRDecoder from "../../../models/QRDecoder/interface";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 入口點init project */
let mt:pub.mainTemp;
/** psyl oad system */
let importLoad:iLoad;
/** QR Code add point */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        importLoad = $eObj.importLoad;
    }

    /** close camera */
    closeScreen =()=>
    {
        try{
            /** video obj */
            let getVideo:HTMLMediaElement = pb.el.id('AddPointPreview').get;
            if ("srcObject" in getVideo) 
            {
                if((getVideo.srcObject as MediaStream)!=null)
                {
                    (getVideo.srcObject as MediaStream).getTracks().forEach(function(track:any) 
                    {//close
                        track.stop();
                    });
                }
            }
            else
            {//無src 狀態
            (getVideo as any).pause();
            }
        }
        catch(e)
        {

        }
    }
    
    /** change camera */
    changeScreen =()=>{
        try{
            pb.v($t,"QRScreenView").async((QR)=>
            {
                QR.change=!QR.change;//鏡頭停止等後切換
                /** video obj */
                let getVideo:HTMLMediaElement = pb.el.id('AddPointPreview').get;
                if ("srcObject" in getVideo) 
                {
                    if((getVideo.srcObject as MediaStream)!=null)
                    {
                        (getVideo.srcObject as MediaStream).getTracks().forEach(function(track:any) 
                        {//close
                            track.stop();
                        });
                    }
                }
                else
                {//無src 狀態
                    (getVideo as any).pause();
                }
                self.toScreen();
            });
        }
        catch(e)
        {

        }
    }
    
    /** open Screen */
    toScreen = ()=>{

        importLoad.m.js["adapterRTC"]((ea)=>
        {//補丁browser RTC error
            importLoad.m.js["QRDecoder"]((ea)=>
            {
                pb.v($t,"QRScreenView").async((QR)=>
                {
                    let video:HTMLMediaElement =  pb.el.id('AddPointPreview').get;
                    let constraints:MediaStreamConstraints = ((QR.change)?{
                        audio:false,
                        video: { facingMode: "user"} //"user"=前鏡頭
                    }:
                    {
                        audio:false,
                        video: { facingMode: "environment" }  //開後鏡頭 "environment"
                    });

                    let handleSuccess:any =(stream:MediaStream):MediaStream=>{
                        if ("srcObject" in video) {
                            video.srcObject = stream;
                        } else {
                            // Avoid using this in new browsers, as it is going away.
                            (video as any).src = window.URL.createObjectURL(stream);
                        }
                        return stream
                    }

                    let handleError:any =(error:any)=>{
                        if(!QR.change)
                        {//因鏡頭錯誤而取可行性鏡頭
                            QR.change = true;
                            self.toScreen();
                        }
                    }

                    navigator.mediaDevices.getUserMedia(constraints)
                    .then(handleSuccess).catch(handleError);

                    // vedio播放時觸發
                    video.addEventListener('play', function ()
                    {
                        (eval("QCodeDecoder") as QRDecoder.QCodeDecoder)().decodeFromVideo(video , function (err:boolean, result:string) {
                            if (!err)
                            {
                                $t.$m.addPoint.cancelFPay(result,QR.cash,QR.allowances,function(){
                                    QR.Close();
                                }); // 掃描結果顯示
                            }
                        }, false);

                    }, false);
                });
            });

        });
    }
}


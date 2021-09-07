import pbM from "../../../../models/pb";

import iLoad from "../../../../models/importLoad";
import * as pub from "../../../../JsonInterface/pub";

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
/** 載入live 檔 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        importLoad = $eObj.importLoad;
    }
    
    /** media source 載入 */
    PlayMediaStream:MediaSource;
    /** 開始直播 Media Buffer 注入容器 */
    sourceBuffer:SourceBuffer=null;
    /** 視訊暫存碎檔 */
    bufferAry:Array<BufferSource>=[];

    /** first live play */
    playOK:boolean=true;
    /** 停止 lvie */
    stopLive:boolean = true;

    /** close camera */
    closeVideo =()=>{
        self.stopLive = false;
        try{
            /** video obj */
            let getVideo:HTMLMediaElement = pb.el.id("clientLiveVideo").get;
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
        self.playOK = true;//回復為first
    }

    /** 注入 base64 video to buffer */
    dataURItoBlob:Function=(base64Data:string):Blob=>{
        var byteString;
        if(base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);//base64 解碼
        else{
            byteString = unescape(base64Data.split(',')[1]);
        }
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime型別 -- video/webm;
    
        var ia = new Uint8Array(byteString.length);//建立檢視
        for(var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob:Blob = new Blob([ia], {
            type: mimeString
        });

        if(base64Data!="data:")
        {//ad buffer
           if(self.bufferAry.length==5 && self.playOK)
           {//first(存在第5個檔案時開始載入 video)
               self.playOK=false;
               self.sourceBuffer.appendBuffer(self.bufferAry[0]);
           }
           self.bufferAry.push(ia);
        }
        return blob;
    } 

    /** 初始化 video 載入 */
    InitVideo= ()=>
    {
        self.stopLive = true;
        /** video obj */
        let getVideo:HTMLMediaElement = pb.el.id("clientLiveVideo").get;
        importLoad.m.js["adapterRTC"]((ea)=>
        {//補丁browser RTC error
            window.URL.revokeObjectURL(getVideo.src)
            self.PlayMediaStream = new MediaSource();
            
            self.PlayMediaStream.addEventListener('sourceopen', ()=>
            {
                if(self.sourceBuffer==null)
                {
                    self.sourceBuffer = self.PlayMediaStream.addSourceBuffer('video/webm;codecs="vp9,opus"');
                    self.sourceBuffer.addEventListener('updateend',function()
                    {//更新 video event
                        if(self.PlayMediaStream.readyState=="open")
                        {
                            self.PlayMediaStream.endOfStream();//結束匯流
                            getVideo.play();                    
                        }
                    });

                    getVideo.addEventListener('ended',()=>
                    {//播放完畢 更新video
                        if(self.stopLive)
                        {
                            self.bufferAry.splice(0,1);
                            self.sourceBuffer.appendBuffer(self.bufferAry[0]);
                        }
                    },false);
                }
            });
            getVideo.src = window.URL.createObjectURL(self.PlayMediaStream);
        });
    }
}


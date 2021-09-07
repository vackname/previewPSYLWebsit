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
/** 上傳 live檔 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        importLoad = $eObj.importLoad;
    }
    
    /** live影片 stream */
    mediaStream:MediaStream;

    /** 錄影obj */
    mediaRecorder:any;
    /** 停止錄影 */
    stopRecording=()=>{
        self.mediaRecorder.stop();
        let blob:Blob = new Blob(self.recordedBlobs, {type: 'video/webm'});
        let reader:FileReader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = ()=>
        {/** 生成 base64 檔案 */
            let base64data:any = reader.result;                


        }
        
        self.recordedBlobs=[];//清空video 重新生成
        self.mediaRecorder.start();
        setTimeout(()=>{
            self.stopRecording();
        },600);
    }

    /** 數據Array記錄 */
    recordedBlobs:any=[];
    handleDataAvailable=(event:any)=>{
    
        if (event.data && event.data.size > 0) {
      
          self.recordedBlobs.push(event.data);
        }
      }

    /**阻擋重複進入 是否已起動錄影 */
    openRecord:boolean = true;
    /** 開始錄影 */
    record=(to:boolean)=>{
        if(self.openRecord || to)
        {
            self.openRecord = false;
            const possibleTypes = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm;codecs=h264,opus',
                'video/mp4;codecs=h264,aac',
            ];

            const options = {
                mimeType: 'video/webm;codecs=vp9,opus',
                audioBitsPerSecond: 44100*16,
            }
            
            try {
                self.mediaRecorder = new (eval("MediaRecorder"))(self.mediaStream, options);
            } 
            catch (e) 
            {
                console.error(e);
            }

            self.mediaRecorder.addEventListener('dataavailable', self.handleDataAvailable);

            setTimeout(()=>{
                self.stopRecording();
            },600);
            self.mediaRecorder.start();
        }
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
        }catch(e)
        {
            
        }
    }

    /** change camera */
    changeScreen =()=>{
        pb.v($t,"liveView").async((Live)=>
        {
            Live.change=!Live.change;//鏡頭停止等後切換
           /** video obj */
           let getVideo:HTMLMediaElement = pb.el.id("meLiveVideo").get;
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
    
    /** open Screen */
    toScreen = ()=>
    {
        importLoad.m.js["adapterRTC"]((ea)=>
        {//補丁browser RTC error
            /** video obj */
            let getVideo:HTMLMediaElement = pb.el.id("meLiveVideo").get;
            pb.v($t,"liveView").async((Live)=>
            {
                const constraints = ((Live.change)?{
                    audio:{
                        sampleRate: 48000,
                        channelCount: 2,
                        volume: 1.0
                    },
                    video: { facingMode: "user"} //"user"=前鏡頭
                }:
                {
                    audio:{
                        sampleRate: 48000,
                        channelCount: 2,
                        volume: 1.0
                    },
                    video: { facingMode: "environment" }  //開後鏡頭 "environment"
                });

                let handleSuccess:any =(stream:MediaStream):MediaStream=>{
                    self.mediaStream = stream;
                    if ("srcObject" in getVideo) {
                        getVideo.srcObject = stream;
                    } else {
                        // Avoid using this in new browsers, as it is going away.
                        (getVideo as any).src = window.URL.createObjectURL(stream);
                    }
                    return stream
                }

                let handleError:any =(error:any)=>{
                    if(!Live.change)
                    {//因鏡頭錯誤而取可行性鏡頭
                        Live.change = true;
                        self.toScreen();
                    }
                }

                navigator.mediaDevices.getUserMedia(constraints)
                .then(handleSuccess).catch(handleError);

                // vedio播放時觸發
                getVideo.addEventListener('play', function ()
                {
                    self.record(false);
                }, false);
            });
        });
    }
}


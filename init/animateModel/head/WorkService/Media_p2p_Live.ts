import pbM from "../../../../models/pb";
import * as jEnum from "../../../../JsonInterface/enum";

import iLoad from "../../../../models/importLoad";
import * as pub from "../../../../JsonInterface/pub";
import webSocket from "../../../../models/WebSocket/interface";

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

/** 會員 web socket/Media 即時通訊 */
export default class model
{
    //<video id="localVideo" autoplay></video>
   // <video id="remoteVideo" autoplay></video>
    /** p2p 連線 */
    private peer:RTCPeerConnection| undefined;
    /** 溝通socket連線 */
    private socket:webSocket| undefined;
    /** 發起身份(answer 回答我方/offer 發起注入對方) */
    private target:string="answer";
    /** 回答我方碎檔資訊 */
    private answerGET:Array<string>=[];
    /** 發起注入對方碎檔資訊 */
    private offerGET:Array<string>=[];
    /** 自己視頻題示畫面 */
    private localVideo:HTMLMediaElement = document.getElementById("localVideo") as HTMLMediaElement;
    /** 對方視頻提示畫面 */
    private remoteVideo:HTMLMediaElement = document.getElementById("remoteVideo") as HTMLMediaElement;
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        importLoad = $eObj.importLoad;
        importLoad.m.js["adapterRTC"]((ea)=>
        {//補丁browser RTC error
            self.localVideo.onloadeddata = () => 
            {/** 載入完成則播放 */
                self.localVideo.play();
            };

            self.remoteVideo.onloadeddata = () => 
            {/** 載入完成則播放 */
                self.remoteVideo.play();
            };
            self.openRomate();
        });
    }

    /** media 靜音 */
    private Mute = (stream:MediaStream):MediaStreamAudioSourceNode=>
    {
        if(eval("window.AudioContext"))
        {
            AudioContext = eval("window.AudioContext");
        }
        else
        {
            AudioContext = eval("window.webkitAudioContext");
        }

       let audioCtx:AudioContext = new AudioContext();//消除自己video 聲音
       let audioInput:MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(stream);
       let gainNode:GainNode = audioCtx.createGain();
        audioInput.connect(gainNode);//回插變化量
        gainNode.connect(audioCtx.destination);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        return audioInput;
    }

    /** join Media Stream */
    private JoinStream = (stream:MediaStream,Media:HTMLMediaElement) => 
    {
        if ("srcObject" in Media) 
        {
            Media.srcObject = stream;
        } 
        else 
        {
            Media.src = window.URL.createObjectURL(stream);
        }
    };

    /** me上線-初始化 */
    private openRomate=()=>
    {    
        importLoad.m.js["WebSocket"]((e)=>
        {
            /** protocol string */
            let protocol:string = ((window.location.protocol.toLowerCase().indexOf("https")>-1)?"wss":"ws");
            /** 繼承socket */
            let socketOBJ:webSocket = new (eval("wSocket") as webSocket)(protocol+"://"+window.location.host+"/mbsocket");
            socketOBJ.connectToken();
            socketOBJ.input = (e)=>
            {//接收訊息
                if(e.error=="received" && e.mes.indexOf("@init:")!=0)
                {
                    if(JSON.parse(e.mes).tp=="data")
                    {
                        let obj:any = JSON.parse(e.mes);
                        if(obj.error==jEnum.Enum_SystemErrorCode.Null)
                        {
                            switch(obj.type)
                            {
                                case 'answer':
                                    self.peer?.setRemoteDescription(new RTCSessionDescription({ type:obj.type, sdp:self.answerGET.join('')+obj.data}));
                                break;
                                case "answer_ice":
                                    try
                                    {
                                        self.peer?.addIceCandidate(obj.data);
                                    }
                                    catch(e)
                                    {

                                    }
                                break;
                                case "offer":
                                    self.startLive(new RTCSessionDescription({ type:obj.type, sdp:self.offerGET.join('')+obj.data}));
                                break;
                                case "offer_ice":
                                    try
                                    {
                                        self.peer?.addIceCandidate(obj.data);
                                    }
                                    catch(e)
                                    {

                                    }
                                break;
                            }
                        }
                
                    }
                    else if(JSON.parse(e.mes).tp=="dataSplit")
                    {
                        let obj:any = JSON.parse(e.mes);
                        switch(obj.type)
                        {
                            case 'answer':
                                if(obj.nu==0)
                                {
                                    self.answerGET=[];
                                }
                                self.answerGET.push(obj.data);
                            break;
                            case "offer":
                                if(obj.nu==0)
                                {
                                    self.offerGET=[];
                                }
                                self.offerGET.push(obj.data);
                            break;
                        }
                    }
                }
                else if(e.mes.indexOf("@init:")==0)
                {//取socketid
                    $t.sid = e.mes.replace("@init:","");
                    console.log($t.sid);
                }
            };

            self.socket = socketOBJ;

            RTCPeerConnection = window.RTCPeerConnection;
            // Chrome
            if (eval("navigator.webkitGetUserMedia")) {
                RTCPeerConnection = eval("webkitRTCPeerConnection");
                // Firefox
            } else if(eval("navigator.mozGetUserMedia")) {
                RTCPeerConnection = eval("mozRTCPeerConnection");
                RTCSessionDescription = eval("mozRTCSessionDescription");
                RTCIceCandidate = eval("mozRTCIceCandidate");
            }

            self.peer = new RTCPeerConnection();//websocket 為中繼server/及判斷對像

            self.peer.onicegatheringstatechange = () => 
            {/** 對接狀態 */
                if (self.peer?.iceGatheringState === 'complete') 
                {

                }
            }

            self.peer.ontrack = (e) => 
            {
                if (e && e.streams.length>0) 
                {
                    self.JoinStream(e.streams[0],self.remoteVideo);
                }
            };

            self.peer.onicecandidate = (e) => {
                if (e.candidate && e.candidate!=null) {
                    self.socket?.sendMes(JSON.stringify({
                        tp:"data",
                        error:jEnum.Enum_SystemErrorCode.Null,
                        type: self.target+'_ice',
                        data: e.candidate
                    }));
                } else {

                }
            };
        });
    }

    /** 開始播接 */
    startLive =(offerSdp?:any)=>
    {
        const constraints = ((true)?{
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

        /** Handler to be called as soon as the remote stream becomes available */
        let successCallback:(stream:MediaStream)=>void = (stream:MediaStream)=>
        {
            self.JoinStream(self.Mute(stream).mediaStream,self.localVideo);

            stream.getTracks().forEach((track) => 
            {//stream 送入 p2p
                self.peer?.addTrack(track, stream);
            });

            if (!offerSdp) 
            {//發起
            self.peer?.createOffer().then((offer)=>{
                    self.target="offer";
                    self.peer?.setLocalDescription(offer as any);
                    let countNu:number=0;
                    while(((offer.sdp!=null)?offer.sdp:'').length>countNu*600)
                    {
                        self.socket?.sendMes(JSON.stringify({
                            tp:"dataSplit",
                            nu:countNu,
                            type: self.target,
                            error:jEnum.Enum_SystemErrorCode.Null,
                            data:offer.sdp?.substring(countNu*600,countNu*600+600)
                        }));
                        countNu++;
                    }
                    self.socket?.sendMes(JSON.stringify({
                        tp:"data",
                        type: self.target,
                        error:jEnum.Enum_SystemErrorCode.Null,
                        data:((((offer.sdp!=null)?offer.sdp:'').length>countNu*600)?offer.sdp?.substring(countNu*600):'')
                    }));

                });
            } 
            else
            {//回應
                self.peer?.setRemoteDescription(offerSdp);
                self.peer?.createAnswer().then((answer)=>{
                    let countNu:number=0;
                    while(((answer.sdp!=null)?answer.sdp:'').length>countNu*600){
                        self.socket?.sendMes(JSON.stringify({
                            tp:"dataSplit",
                            nu:countNu,
                            type: self.target,
                            error:jEnum.Enum_SystemErrorCode.Null,
                            data:answer.sdp?.substring(countNu*600,countNu*600+600)
                        }));
                        countNu++;
                    }
                    self.socket?.sendMes(JSON.stringify({
                        tp:"data",
                        type: self.target,
                        error:jEnum.Enum_SystemErrorCode.Null,
                        data:((((answer.sdp!=null)?answer.sdp:'').length>countNu*600)?answer.sdp?.substring(countNu*600):'')
                    }));
                    self.peer?.setLocalDescription(answer as any);
                });
            }
        };

        /** media 錯誤處理 */
        let handleError:any =(error:any)=>{
            //因鏡頭錯誤而取可行性鏡頭
            self.startLive();
        }

        try
        {
            navigator.mediaDevices.getUserMedia(constraints)
            .then(successCallback).catch(handleError);
        }
        catch(e)
        {
            try
            {
                eval("navigator.getUserMedia")(constraints, successCallback,handleError);
            }
            catch(e)
            {

            }
        }
    }
}
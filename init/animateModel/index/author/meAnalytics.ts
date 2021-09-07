
import * as pub from "../../../../JsonInterface/pub";
import pbM from "../../../../models/pb";
import iLoad from "../../../../models/importLoad";

import SSChart from "./meAnalytics/SequencesSunburst";

/** 顏色格式 */
interface ColorData
{
    /* 標題名 */
    key:string
    /** color 16進位 */
    val:string
}

/** key name format {} */
interface getChartColorName
{
    [key:string]:string
}

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** 入口點init project */
let mt:pub.mainTemp;
/** 系統共用 */
let main:pub.main;
/** psyl oad system */
let importLoad:iLoad;
/** 知識背景 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
        importLoad = $eObj.importLoad;
        
    }


    /** PSYL 誕生材料/我的素質 */
    meChart =()=>{
        importLoad.m.js["d3v4Chart"]((em)=>
        {//載入分析chart Model
            let colorAry:Array<string> = ["#6C6C6C","#AE0000","#F00078","#D200D2","#8600FF","#2828FF","#0072E3","#00CACA","#02DF82","#00DB00","#8CEA00","#C4C400","#D9B300","#FF8000","#F75000",
            "#0000C6","#548C00","#5B5B00","#9F5000","#019858","#007979","#3A006F","#820041","#272727","#743A3A","#707038","#3D7878","#5151A2","#7E3D76"];

            /** 標籤*/
            let getKey:Array<string>=[
            "Tool","programme","DataBase","Video/Draw","Communication","txt/file"
            ,"Developer","JWT Token","service","Draw Chart","Web Style","Browser","Oauth","Command Prompt",

            "Microsoft","Adobe","Apple","Linux","Event","Google","Facebook","Line","ORACLE","AWS",

            "Net Core","Cloud",
            "Visual studio","VSCode","Android studio","GCP","Xcode",
            "WPF","Win from","Console App","Web MVC","Web API","Web From",
            "Ubuntu","Centos","XOS/MAC","Windows",
            "asp","Ruby",
            "PHP","YII","Laravel","oop",
            "Framk Work"
            ,"Memory","socket","httpRequest","Client/CURL","Web Socket","TCP/IP",

            "C#","C++","VB","Python","WEBRTC",

            "Java","Tomcat",
            "VM","Vagrant","Docker",
            "Marriadb","MysqlDB","SQL Server","Access","Mongodb","redis",
            "SQL","TSql","Mysql",
            "JSON","XML","ini","yaml",
            "PSYL JWT",
            "video","ffmpeg","rtmp/smtp",
            "SVG","Canvas",
            "CSS","scss","sass",
            "Javascript","ES5","ES6","Node.js/Express","Webpack","Typescript","vue.js","JQuery","PSYL Animate","PSYL Vue.js",
            "Chrome","Safari","IE6~Edge","Firefox",
            "Command line","Terminal","shell",
            "IIS","Nginx","Apache",

            "XCode","Swift","Android",

            "Illustartor","photoshop","Animate","Dreamweaver","Flash","Action Script 3","Action Script 2"];
            
            /** 參數 */
            let getData:Array<Array<string>>=[
                ["Tool-Microsoft-Visual studio","100"],
                ["Tool-Microsoft-VSCode","100"],
                ["Tool-Google-Android studio","100"],

                ["Communication-Windows-Memory","100"],
                ["Communication-Windows-socket","100"],
                ["Communication-Windows-Web Socket","100"],
                ["Communication-Windows-httpRequest","100"],
                ["Communication-Windows-TCP/IP","100"],
    
                ["Communication-Centos-httpRequest","100"],
                ["Communication-Centos-socket","100"],
                ["Communication-Centos-Web Socket","100"],
                ["Communication-Centos-TCP/IP","100"],
    
                ["Communication-XOS/MAC-httpRequest","100"],
                ["Communication-XOS/MAC-socket","100"],
                ["Communication-XOS/MAC-Web Socket","100"],
                ["Communication-XOS/MAC-TCP/IP","100"],
    
                ["Communication-Ubuntu-httpRequest","100"],
                ["Communication-Ubuntu-socket","100"],
                ["Communication-Ubuntu-Web Socket","100"],
                ["Communication-Ubuntu-TCP/IP","100"],

                ["Developer-Microsoft-Net Core-C#-Console App","100"],
                ["Developer-Microsoft-Net Core-C#-Web MVC","100"],
                ["Developer-Microsoft-Net Core-C#-Web API","100"],
                ["programme-Microsoft-asp","100"],
                ["Developer-Microsoft-C#-Framk Work-WPF","90"],
                ["Developer-Microsoft-C#-Framk Work-Win from","60"],
                ["Developer-Microsoft-C#-Framk Work-Console App","90"],
                ["Developer-Microsoft-C#-Framk Work-Web MVC","80"],
                ["Developer-Microsoft-C#-Framk Work-Web API","80"],
                ["Developer-Microsoft-C#-Framk Work-Web From","80"],
                ["Developer-Microsoft-VB-Framk Work-Web From","60"],
                ["programme-Event-Ruby","60"],
                ["programme-Event-PHP","60"],
                ["Developer-Event-PHP-YII","70"],
                ["Developer-Event-PHP-Laravel","60"],
                ["Developer-Event-PHP-oop","30"],
                ["programme-Microsoft-C++","30"],
                ["programme-Event-Python","50"],
                ["Developer-ORACLE-Java-Tomcat","30"],
                ["Developer-Event-webRTC","90"],

                ["Tool-VM-Vagrant","100"],
                ["Tool-VM-Docker","40"],
                ["DataBase-Windows-Marriadb","100"],
                ["DataBase-Windows-MysqlDB","100"],
                ["DataBase-Windows-SQL Server","100"],
                ["DataBase-Windows-Access","100"],
                ["DataBase-Windows-Mongodb","100"],
                ["DataBase-Windows-redis","100"],

                ["DataBase-Ubuntu-Marriadb","100"],
                ["DataBase-Ubuntu-MysqlDB","100"],
                ["DataBase-Ubuntu-Mongodb","100"],
                ["DataBase-Ubuntu-redis","100"],

                ["DataBase-XOS/MAC-Marriadb","100"],
                ["DataBase-XOS/MAC-MysqlDB","100"],
                ["DataBase-XOS/MAC-Mongodb","100"],
                ["DataBase-XOS/MAC-redis","100"],

                ["DataBase-Centos-Marriadb","100"],
                ["DataBase-Centos-MysqlDB","100"],
                ["DataBase-Centos-Mongodb","100"],
                ["DataBase-Centos-redis","100"],
                ["programme-Event-SQL-TSql","100"],
                ["programme-Event-SQL-Mysql","100"],

                ["Event-txt/file-JSON","100"],
                ["Event-txt/file-XML","100"],
                ["Event-txt/file-ini","100"],
                ["Event-txt/file-yaml","100"],
                ["JWT Token-Event-PSYL JWT","100"],
                ["JWT Token-Apple","100"],
                ["Tool-video-ffmpeg","100"],
                ["service-rtmp/smtp","100"],
                ["Draw Chart-Javascript-SVG","100"],
                ["Draw Chart-Javascript-Canvas","100"],
                ["Web Style-CSS","100"],
                ["Web Style-scss","100"],
                ["Web Style-sass","100"],

                ["programme-Event-Javascript-ES5","100"],
                ["programme-Event-Javascript-ES6","70"],
                ["programme-Microsoft-Typescript","100"],
                ["Tool-Javascript-Node.js/Express","70"],
                ["Tool-Javascript-Webpack","30"],
                ["Tool-Javascript-vue.js","100"],
                ["Tool-Javascript-JQuery","100"],
                ["Tool-Javascript-PSYL Animate","100"],
                ["Tool-Javascript-PSYL Vue.js","100"],
                ["Browser-Microsoft-IE6~Edge","100"],
                ["Browser-Linux-Firefox","30"],
                ["Browser-Apple-Safari","70"],
                ["Browser-Google-Chrome","100"],
                ["service-Cloud-AWS","90"],
                ["service-Cloud-Google-GCP","70"],
                ["service-Oauth-Google","70"],
                ["service-Oauth-Facebook","70"],
                ["service-Oauth-Line","70"],
                ["Command Prompt-Command line-Windows","60"],
                ["Command Prompt-Terminal-Ubuntu","70"],
                ["Command Prompt-Terminal-Centos","70"],
                ["Command Prompt-Terminal-XOS/MAC","100"],
                ["Command Prompt-shell-Windows","30"],
                ["Command Prompt-shell-Ubuntu","70"],
                ["Command Prompt-shell-Centos","100"],
                ["Command Prompt-shell-XOS/MAC","100"],

                ["service-Centos-Apache","60"],
                ["service-Centos-Nginx","100"],
                ["service-Ubuntu-Apache","60"],
                ["service-Ubuntu-Nginx","100"],
                ["service-XOS/MAC-Apache","60"],
                ["service-XOS/MAC-Nginx","100"],
                ["service-Windows-Apache","60"],
                ["service-Windows-Nginx","100"],
                ["service-Windows-IIS","80"],

                ["Tool-Apple-Xcode","30"],
                ["programme-Apple-Swift","70"],
                ["programme-Google-Android","70"],
    
                ["Tool-Adobe-photoshop","50"],
                ["Tool-Adobe-Illustartor","100"],
                ["Tool-Adobe-Dreamweaver","100"],
                ["Tool-Adobe-Flash","100"],
                ["Tool-Adobe-Animate","70"],
    
                ["programme-Adobe-Action Script 3","90"],
                ["programme-Adobe-Action Script 2","70"],
            ];
            /** 標籤color */
            let getKeyVal:Array<ColorData>=[];
            /** 注入標籤顏色 */
            var getKeyChart:getChartColorName={};
            getKey.forEach((val,nu)=>{
                getKeyVal.push({key:val,val:colorAry[nu%colorAry.length]}as ColorData);
                getKeyChart[val]=colorAry[nu%colorAry.length];
            });
            
            pb.v($t,"meAnVue").async((ae)=>{
                ae.color=getKeyVal;
            });
            
            SSChart(eval("d3"),getData,getKeyChart);
        });
    }
}
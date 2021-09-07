import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
import {jObj as jObjM} from "../../../models/Jobj/interface";
import iLoad from "../../../models/importLoad";
import * as vue from "../../../models/vueComponent";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
    Jobj:jObjM,
    /** 注入 psyl vue template */
    vueComponent?:vue.vueComponent,
    /** psyl oad system */
    importLoad?:iLoad,
}

import h from "./head";
import l from "./login";
import tm from "./tagbag";
import google from "./login/googleLogin";
import facebook from "./login/facebookLogin";
import lineM from "./login/lineLogin";
import gitM from "./login/gitHub";
const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax"),vueComponent:eval("vueComponent"),importLoad:eval("importLoad"),Jobj:eval("Jobj")};
export default class main{
    h:h|undefined;
    l:l|undefined;
    t:tm|undefined;
    g:google|undefined;
    fb:facebook|undefined;
    line:lineM|undefined;
    github:lineM|undefined;
    constructor($tObj:any) 
    {
        this.h = new h($tObj,$e);
        this.l = new l($tObj,$e);
        this.t = new tm($tObj,$e);
        this.g = new google($tObj,$e);
        this.fb = new facebook($tObj,$e);
        this.line = new lineM($tObj,$e);
        this.github = new gitM($tObj,$e);
        let self=this;
        setTimeout(()=>{//初始化 Head
            self.h?.toInit($e);
         },100);
    }
};


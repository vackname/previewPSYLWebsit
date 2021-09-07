import Tool from "./AnTool";//ctr tool
import pUpload from "./photoUpload";
import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";
// 字串過慮 model
import * as charFilter from "../../../JsonInterface/charFilter";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
}

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    tool:Tool|undefined;
    photo:pUpload |undefined;
    char = charFilter;
    $t:any;
    constructor($tObj:any) {
        this.$t=$tObj;
        this.tool = new Tool($tObj,$e);
        this.photo = new pUpload($tObj,$e);
    }

    /**
     *  商品編緝load bar動畫閃爍
     * 折、套餐、商品編緝 共用
     */
    loadProductEdit=()=>
    {
        /** self=class=this */
        var self:any=this;
        $e.pb.el.id("ProductEditLoad").style({
            "position":"relative",
            "margin-left":"auto",
            "margin-right":"auto"
        }).animate({"duration":1,"delay":0,"count":1},
                {//閃燐 升縮
                    "0%":{"opacity": "0.3","width":"60%"},
                    "33%":{"opacity": "1","width":"20%"},
                    "66%":{"opacity": "0.3","width":"100%"},
                    "88%":{"opacity": "1","width":"30%"},
                    "100%":{"opacity": "0.3","width":"90%"},
                }).remove()
                .frame((e:any)=>{//再次喚醒動畫
                    setTimeout(function(){
                        $e.pb.v(self.$t,"editview").async((e1:any)=>{
                            if(e1.load)
                            {
                                self.loadProductEdit();
                            }
                        });
                    },20);
            });
    }

    /**
     * 載入編緝wait (main view)
    */
    loadEdit=()=>
    {
        /** self=class=this */
        var self:any=this;
        $e.pb.el.id("productloadprogress").animate({"duration":1,"delay":0,"count":1},
                {//漸顯動畫
                    "0%":{"opacity": "0.3"},
                    "33%":{"opacity": "1"},
                    "66%":{"opacity": "0.3"},
                    "88%":{"opacity": "1"},
                    "100%":{"opacity": "0.3"},
                }).remove()
                .frame((e:any)=>{//再次喚醒動畫
                    setTimeout(function(){
                        if(self.$t.load)
                        {
                            self.loadEdit();
                        }
                    },20);
       });
    }
};


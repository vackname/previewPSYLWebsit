
import ajaxM from "../../../models/ajax";
import pbM from "../../../models/pb";

/** models */
interface modelsFormat
{
    ajax:ajaxM,
    pb:pbM,
}

const $e:modelsFormat = {pb:eval("pb"),ajax:eval("ajax")};
export default class main{
    $t:any;
    constructor($tObj:any) {
        this.$t = $tObj;
    }

 
    /**
     *  動畫閃爍
     */
    LoginRun=()=>
    {
        /** self=class=this */
        let self:main = this;
        $e.pb.el.id("loginPanelLoad").animate({"duration":1,"delay":0,"count":1},
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
                            self.LoginRun();
                        }
                    },20);
            });
    }

    /** 使用者是否觸發 */
    loginclick:boolean=true;
    /**
     * login logo 動畫
    */
    loginManAn=(init:boolean)=>{
        /** self=class=this */
        let self:main = this;
        if(init)
        {
            $e.pb.el.id("loginAnMB").on("click",(e:any)=>{
                if( self.loginclick)
                {
                    self.loginclick = false;
                    e.animate({"duration":0.1,"delay":0,"count":1},
                    {//漸顯動畫
                        "0%":{ "left":"0px","top":"0px","transform": "rotate(0deg)" },
                        "33%":{ "left":"0px","top":"0px","transform": "rotate(2deg)" },
                        "66%":{ "left":"0px","top":"0px","transform": "rotate(-2deg)" },
                        "88":{ "left":"0px","top":"0px","transform": "rotate(1deg)" },
                        "100%":{ "left":"0px","top":"0px","transform": "rotate(-1deg)" },
                    }).frame((e:any)=>{
                        self.loginclick = true;
                    }).remove();
                }
            });
        }
        setTimeout(function(){
            $e.pb.el.id("loginAnMB").animate({"duration":0.2,"delay":0,"count":1},
            {//漸顯動畫
                "0%":{ "left":"0px","top":"0px","transform": "rotate(0deg)" },
                "33%":{ "left":"0px","top":"0px","transform": "rotate(2deg)" },
                "66%":{ "left":"0px","top":"0px","transform": "rotate(-2deg)" },
                "88":{ "left":"0px","top":"0px","transform": "rotate(1deg)" },
                "100%":{ "left":"0px","top":"0px","transform": "rotate(-1deg)" },
            }).frame((e:any)=>{
                e.remove();
                $e.pb.el.id("loginAnKey").animate({"duration":5,"delay":0,"count":1},
                {//key移動
                    "0%":{ "left":"15px","top":"28px","transform": "rotate(0deg)" },
                    "43%":{ "left":"8px","top":"50px","transform": "rotate(-20deg)" },
                    "66%":{ "left":"5px","top":"45px","transform": "rotate(-10deg)" },
                    "88%":{ "left":"8px","top":"50px","transform": "rotate(-20deg)" },
                    "100%":{ "left":"5px","top":"45px","transform": "rotate(-10deg)" },
                }).animate({"duration":1,"delay":0,"count":1},
                {//key還原
                    "0%":{ "left":"5px","top":"45px","transform": "rotate(-10deg)" },
                    "100%":{ "left":"15px","top":"28px","transform": "rotate(0deg)" },
                }).remove();

                $e.pb.el.id("loginAnARM").animate({"duration":5,"delay":0,"count":1},
                {//手臂擺動
                    "0%":{ "left":"17px","top":"25px","transform": "rotate(0deg)" },
                    "43%":{ "left":"5px","top":"30px","transform": "rotate(50deg)" },
                    "66%":{ "left":"10px","top":"28px","transform": "rotate(35deg)" },
                    "88%":{ "left":"5px","top":"30px","transform": "rotate(50deg)" },
                    "100%":{ "left":"10px","top":"28px","transform": "rotate(35deg)" },
                }).animate({"duration":1,"delay":0,"count":1},
                {//手臂擺動還原
                    "0%":{ "left":"10px","top":"28px","transform": "rotate(35deg)" },
                    "100%":{ "left":"17px","top":"25px","transform": "rotate(0deg)" },
                }).remove();
            }).delay(6.5).frame((e:any)=>{//再次喚醒動畫
                self.loginManAn(false);
            }).remove();
        },9000);
    }
};


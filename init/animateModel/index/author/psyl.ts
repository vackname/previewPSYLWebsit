import * as pub from "../../../../JsonInterface/pub";
import pbM from "../../../../models/pb";


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
/** 顯示文章提示 連接動畫 model */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
        mt = $t.mainTemp;
        main = $t.main;
    }

    runStep1=()=>
    {//Create Project/創建專案、Create MVC View/創建 MVC View、Create event View/創建 event View、Create Model/創建模組、Create event View/創建 event View
       /** 隱藏藏元素 */
       let toHiden:any=  {
            "from":{"opacity":"0","position":"absolute"},
            "to":{"opacity":"0","position":"absolute"}
        };

        /** Create元素 */
       let toCreate:any=  {
            "from":{"opacity":"0","position":"absolute","right":"-200px"},
            "to":{"opacity":"1","position":"absolute","right":"0px"}
        };

        /** Show元素 */
       let toShow:any=  {
        "from":{"opacity":"1"},
        "to":{"opacity":"1"}
        };

       /** 閃爍Show元素 */
       let shShow:any=  {
        "from":{"opacity":"0"},
        "to":{"opacity":"1"}
        };

        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action){
                setTimeout(()=>{
                    ep.action = true;
                },100);
                ep.step = 0;
                pb.el.id("PSYLStepAn1_NewViewRS").animate({"duration":3,"delay":0,"count":1},toHiden).animate({"duration":1,"delay":0,"count":1},toCreate).delay(9)
                .animate({"duration":10,"delay":0,"count":1},toHiden).remove();//view
                pb.el.id("PSYLStepAn1_NewView").animate({"duration":3,"delay":0,"count":1},toHiden).frame((e)=>{

                        ep.step = 1;

                }).animate({"duration":1,"delay":0,"count":1},toCreate).animate({"duration":1,"delay":0,"count":3},shShow).animate({"duration":6,"delay":0,"count":1},toShow).animate({"duration":10,"delay":0,"count":1},toHiden).remove();//view

                pb.el.id("PSYLStepAn1_model1Data").animate({"duration":1,"delay":0,"count":1},toCreate).animate({"duration":1,"delay":0,"count":3},shShow).animate({"duration":2,"delay":0,"count":1},toShow)
                .animate({"duration":15,"delay":0,"count":1},toHiden).remove();//model1

                pb.el.id("PSYLStepAn1_EV1RS").animate({"duration":6,"delay":0,"count":1},toHiden).animate({"duration":1,"delay":0,"count":4},toCreate).delay(3)
                .animate({"duration":10,"delay":0,"count":1},toHiden).remove();//Vent Event View1
                pb.el.id("PSYLStepAn1_EV1").animate({"duration":6,"delay":0,"count":1},toHiden).frame((e)=>{

                        ep.step = 2;

                }).animate({"duration":1,"delay":0,"count":1},toCreate).animate({"duration":1,"delay":0,"count":3},shShow).animate({"duration":3,"delay":0,"count":1},toShow)
                .animate({"duration":8,"delay":0,"count":1},toHiden).remove();//Vent Event View1

                pb.el.id("PSYLStepAn1_EV2").animate({"duration":10,"delay":0,"count":1},toHiden).animate({"duration":1,"delay":0,"count":1},toCreate).delay(3)
                .animate({"duration":7,"delay":0,"count":1},toHiden).remove();//Vent Event View2
                pb.el.id("PSYLStepAn1_EV2RS").animate({"duration":10,"delay":0,"count":1},toHiden).animate({"duration":1,"delay":0,"count":1},toCreate).delay(3)
                .animate({"duration":7,"delay":0,"count":1},toHiden).remove();//Vent Event View2

                pb.el.id("PSYLStepAn1_Con1").animate({"duration":3,"delay":0,"count":1},toHiden)
                .animate({"duration":1,"delay":0,"count":1},toCreate).delay(9).animate({"duration":8,"delay":0,"count":1},toHiden).remove();//view controllers動畫
                pb.el.id("PSYLStepAn1_Con1RS").animate({"duration":3,"delay":0,"count":1},toHiden)
                .animate({"duration":1,"delay":0,"count":1},toCreate).delay(9).animate({"duration":8,"delay":0,"count":1},toHiden).remove();//view controllers動畫
                
                pb.el.id("PSYLStepAn1_controllerPanel").delay(6).animate({"duration":15,"delay":0,"count":1},toHiden).remove();//Controller隱藏內容

                pb.el.id("PSYLStepAn1_model1RS").animate({"duration":14,"delay":0,"count":1},toHiden)
                .animate({"duration":1,"delay":0,"count":1},toCreate).remove();//model Animate1
                
                pb.el.id("PSYLStepAn1_model1").animate({"duration":14,"delay":0,"count":1},toHiden).frame((e)=>
                {
                        ep.step = 3;
                }).animate({"duration":1,"delay":0,"count":1},toCreate).animate({"duration":1,"delay":0,"count":3},shShow).animate({"duration":3,"delay":0,"count":1},toShow)
                .frame((e)=>{
                    if(ep.AllRun)
                    {
                        //結束Step psyl js 結構 前往MVVM 架構解說
                        self.runStep2();
                    }
                    else
                    {
                        ep.action = false;
                        ep.step=-1;
                    }
                }).remove();//model Animate1
            }
        });
    }

    /** PSYL Vue.js MVVM */
    runStep2 =()=>
    {
        /** Create元素 */
       let toCreate:any=  {
        "from":{"opacity":"0"},
            "to":{"opacity":"1"}
        };

        /** Create元素 */
       let toCreateMVVMRemove:any=  {
        "from":{"opacity":"0","left":"0px"},
            "to":{"opacity":"1","left":"300px"}
        };

        /** Show元素 */
        let toShow:any=  {
        "from":{"opacity":"1"},
        "to":{"opacity":"1"}
        };
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 4;
                pb.el.id("PSYLMVVMANLine1").delay(1).animate({"duration":1,"delay":0,"count":8},toCreate).animate({"duration":4,"delay":0,"count":1},toShow);
                pb.el.id("PSYLMVVMANLine2").delay(1).animate({"duration":1,"delay":0,"count":8},toCreate).animate({"duration":4,"delay":0,"count":1},toShow);
                pb.el.id("PSYLMVVMANLine3").delay(1).animate({"duration":1,"delay":0,"count":8},toCreate).animate({"duration":4,"delay":0,"count":1},toShow);
                pb.el.id("PSYLMVVMAN1").animate({"duration":3,"delay":0,"count":1},toCreateMVVMRemove).animate({"duration":9,"delay":0,"count":1},toShow);
                pb.el.id("PSYLMVVMAN2").animate({"duration":3,"delay":0,"count":1},toCreateMVVMRemove).animate({"duration":9,"delay":0,"count":1},toShow);
                pb.el.id("PSYLMVVMAN3").animate({"duration":3,"delay":0,"count":1},toCreateMVVMRemove).animate({"duration":9,"delay":0,"count":1},toShow).frame((e)=>{
                    if(ep.AllRun)
                    {
                        //結束MVVM 說明 前往PSYL Vue.js combine PSYL DBconfig 
                        self.runStep3();
                    }
                    else
                    {
                        ep.action = false;
                    }
                });
            }
        });
    }

    /** PSYL Vue.js combine PSYL DBconfig */
    runStep3 =()=>
    {
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 5;
                ep.bundlePsyl = 0;
                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };
                pb.el.id("psylShowNetCoreCombine").animate({"duration":1,"delay":0,"count":1},toCreate).delay(5).frame((e)=>{
                    ep.bundlePsyl = 1;
                }).animate({"duration":1,"delay":0,"count":1},toCreate).delay(5).frame((e)=>{
                    ep.bundlePsyl = 2;
                }).animate({"duration":1,"delay":0,"count":1},toCreate).delay(5).frame((e)=>{
                    ep.bundlePsyl = 3;
                    pb.el.id("psylShowVueCombine").animate({"duration":1,"delay":0,"count":1},toCreate)
                    .delay(5).frame((e2)=>{
                        if(ep.AllRun)
                        {
                            self.runStep4();//close
                        }
                        else
                        {
                            ep.action = false;
                        }
                    });
                });
            }
        });
    }

    /** DBConfig tb import tsc */
    runStep4 =()=>
    {
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.actio || ep.AllRunn){
                ep.action = true;
                ep.step = 6;
                ep.psylimporttb=0;
                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };


                pb.el.id("psylImportAnTB").animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylimporttb=1;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylimporttb=2;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylimporttb=3;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    if(ep.AllRun)
                    {
                        self.runStep5();//close DBConfig tb import tsc step
                    }
                    else
                    {
                        ep.action = false;
                    }
                });
            }
        });
    }

    /** Bundle relase/封裝 relase */
    runStep5 =()=>
    {
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 7;
                ep.bundleRelease=-1;
                /** 隱藏藏元素 */
                let toHiden:any=  {
                    "from":{"opacity":"0","position":"absolute"},
                    "to":{"opacity":"0","position":"absolute"}
                };

                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };

                pb.el.id("PSYLStepAn1_tool").animate({"duration":1,"delay":0,"count":3},toCreate).frame((e)=>{
                    ep.bundleRelease=0;
                })
                .animate({"duration":12,"delay":0,"count":1},toHiden);

                pb.el.id("PSYLBundleRelease1").animate({"duration":3,"delay":0,"count":1}, toHiden).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.bundleRelease=1;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.bundleRelease=2;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    if(ep.AllRun)
                    {
                        self.runStep6();
                        // 結束 Cliet Input of Init/初始化
                    }
                    else
                    {
                        ep.action = false;
                    }
                });

                pb.el.id("PSYLBundleRelease2").animate({"duration":3,"delay":0,"count":1}, toHiden).animate({"duration":4,"delay":0,"count":1}, toHiden).animate({"duration":1,"delay":0,"count":4},toCreate).animate({"duration":1,"delay":0,"count":4},toCreate);
            }
        });
    }

    /** input api */
    runStep6 =()=>
    {
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 8;
                ep.psylJSLoad=0;
                /** 隱藏藏元素 */
                let toHiden:any=  {
                    "from":{"opacity":"0","position":"absolute"},
                    "to":{"opacity":"0","position":"absolute"}
                };

                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };


                pb.el.id("psylInputData").animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=1;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=2;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=3;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=4;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=5;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=6;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=7;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylJSLoad=8;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    if(ep.AllRun)
                    {
                        self.runStep7();
                        // 結束 Cliet Input of Init/初始化 to DBConnection
                    }
                    else
                    {
                        ep.action = false;
                    }
                });
            }
        });
    }

    /** DBConnection */
    runStep7 =()=>
    {
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 9;
                ep.psylDBConnection=0;
                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };


                pb.el.id("PSYLDBConnectionStep").animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylDBConnection=1;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylDBConnection=2;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylDBConnection=3;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    if(ep.AllRun)
                    {
                        self.runStep8()// close DBConnection
                    }
                    else
                    {
                        ep.action = false;
                    }
                });
            }
        });
    } 

    /** ui */
    runStep8 =()=>
    {
        
        pb.v($t,"psylModelVue").async((ep)=>{
            if(!ep.action || ep.AllRun){
                ep.action = true;
                ep.step = 10;
                ep.psylVueUI=0;
                /** Create元素 */
                let toCreate:any=  {
                "from":{"opacity":"0"},
                    "to":{"opacity":"1"}
                };


                pb.el.id("PSYLUIANStep").animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylVueUI=1;
                }).animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    ep.psylVueUI=2;
                })
                .animate({"duration":1,"delay":0,"count":4},toCreate).frame((e)=>{
                    //ep.step = 11;
                    // close ui
                    ep.AllRun= false;
                    ep.action = false;
                });
            }
        });
    }
}
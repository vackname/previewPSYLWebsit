import pbM from "../../../models/pb";

/** temp this */
let $t:any | undefined;
/** psyl public api */
let pb:pbM;
/** class this */
let self:model;
/** example model item1 */
export default class model{
    constructor($tObj:any,$eObj:any) 
    {
        $t = $tObj;
        pb = $eObj.pb;
        self = this;
    }

    /**
     * panel id 類別選取select error area
     */
    classBorderError = (id:string)=>
    {
        pb.el.id(id).frame((e)=>{
            e.animate({"duration":1,"delay":0,"count":1},
                {//閃耀動畫
                    "0%":{"opacity": "1","border":"2px solid #FF3300"},
                    "33%":{"opacity": "0.5","border":"2px solid #FF8800"},
                    "66%":{"opacity": "1","border":"2px solid #FF3300"},
                    "88%":{"opacity": "0.5","border":"2px solid #FF8800"},
                    "100%":{"opacity": "1","border":"2px solid #FF3300"},
                }).remove();//移除動畫
        });
    };
};


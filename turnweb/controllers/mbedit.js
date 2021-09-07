self.data = {
    pw2:"",//修改密碼-登入密碼
    pw:"",//修改資訊密碼-登入密碼
    input:{//修改欄位記錄-宣告init 避免get set 取不到
        name:"",
        pw:"",
        repassword:"",
        mbid:"",
        mail:"",
        imgfile:null,
        imgfileAry:[],
        update:false,
        photo:[],
        storyData:{},
        objImg:null,
    },
    BankInput:{//銀行資訊 避免get set 取不到
        imgfile:null,
        imgfileAry:[],
        photo:[],
        update:false,
        objImg:null,
    },
    perData:{//個資宣告
        /** 
        * DB:主鍵 key */
        key:"",
        /** 
        * DB:身份識別碼 */
        id:"",
        /** 
        * DB:性別  0=女,1=男 */
        gender:1,
        /** 
        * DB:實名 */
        name:"",
        /** 
        * DB:生日 */
        birthday:0,
        /** 
        * DB:mobile 手機 */
        phone:"",
        /** 
        * DB:市話 */
        tel:"",
        /** input 個資生日年 */
        inputY:0,
        /** input 個資生日月 */
        inputM:0,
        /** input 個資生日日 */
        inputD:0,
        runYear:[],//生日選擇器
        runMonth:[],
        runMonthDayMax:[0,31,28,31,30,31,30, 31,31,30,31,30,31],
        runMonthDay:[]
    }
};

self.tsc=["model/mbedit"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    if($t.mainTemp.NormalLevel())
    {
        $t.$m.pe.sysYearDate($t.perData);
        if($t.langLoad.indexOf($t.main.pub.lang)==-1)
        {/** 載入語系初始記錄 */
            $t.langLoad.push($t.main.pub.lang);
        }
    }
    else
    {//其它模式
        $t.$m.mb.mbdata();
    }
    $t.load = true;
};
        

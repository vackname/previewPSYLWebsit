
self.data = {
        data:
        {
                /** 
                 * DB:主鍵 key */
                key:"",

                /** 
                 * DB:起動 */
                display:false,

                /** 
                 * DB:寄送地址-功能 */
                adrCk:false,

                /** 
                 * DB:實名個資-功能 */
                peCK:false,

                /** 
                 * DB:聯絡資訊-功能 */
                amCK:false,

                /** 
                 * DB:開通功能 */
                appck:false,

                /** 
                 * DB:稅額/運費/手續費 表項顯示不列入計算 */
                fee:0,

                /** 
                 * DB:語系起用代號 */
                lang:"[]",

                /** 
                 * json:語系起用 list */
                langAry:[],

                /** 
                 * DB:title array */
                title:"",

                /** 
                 * json:title list */
                titleAry:[],

                /** 
                 * json:活動圖 list */
                imgAry:[],

                /** 
                 * DB:活動費 */
                cash:0,

                /** 
                 * DB:限額 */
                count:0,

                /** 
                 * json:簡章 list */
                descriptionAry:[],

                /** 
                 * DB:活動時間 */
                indate:0,

                /** 
                 * DB:報名時間開始 */
                stdate:0,

                /** 
                 * DB:報名時間結束 */
                edate:0,

                /** 
                 * DB:備註 */
                mark:"",
                /** 其它備註輸入欄位 */
                usermark:"",
                /** 
                 * DB:日期 */
                date:0,
                /** QRcode */
                QR : null,
                /** 加購 */
                pdataAry:[],
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

        },
        ames:{//其它人聯絡個資
                 /** 
                 * DB:主鍵 key */
                key:"",

                /** 
                 * DB:聯絡人 */
                name:"",

                /** 
                 * DB:稱謂 */
                title:"",

                /** 
                 * DB:gender 性別  0=女,1=男 */
                gender:1,

                /** 
                 * DB:mobile 手機 */
                phone:"",

                /** 
                 * DB:市話 */
                tel:"",
        },
        adr://寄件地址
        {
                /** 
                 * DB:主鍵 key */
                key:"",

                /** 
                 * DB:收貨人 */
                name:"",

                /** 
                 * DB:gender 性別  0=女,1=男 */
                gender:1,

                /** 
                 * DB:mobile 手機 */
                phone:"",

                /** 
                 * DB:市話 */
                tel:"",

                /** 
                 * DB:國家 */
                country:"TW",

                /** 
                 * DB:城市 */
                city:"-",

                /** 
                 * DB:區域 */
                area:"-",

                /** 
                 * DB:區_號 */
                zip:"-",

                /** 
                 * DB:詳細地址 */
                address:"",

                /** 
                 * DB:其它 */
                mark:"",

                /** 
                 * DB:日期 */
                date:0,
                /** 寄送時段 */
                dtime:2,
        }
};
self.tsc = ["model/pay"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    $t.loadModel=true;
    setTimeout(()=>
    {//載入文章
        if($t.data.key!="")
        {
            $t.$m.main.catchDoc($t.data,true);
        }
    },300);
};

self.data = {
    productCar:[],//與init head pcarTemp->同步 productCar
    usermark:"",//支付其它備註
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

self.tsc=["model/pay"];
self.completed = function($t,tscAry)
{
    $t["$m"] = tscAry[0];
    $t.$m.main.read();//同步購物車
    $t.$m.main.loadAdr();//取得寄件資訊
};
/**
 * client browser/解析 browser info
*/
interface browser
{
    /** 瀏覽器 */
    browser:string,
    /** 
     * 版本
    */
    version:string,
    /**
     * 系統name
     */
    OS:string,
    /**
     * browser 語系
    */
    lang:string
}

/**
 *  vue catch teamp
 */
interface vueProp
{
    /**
     * vue
     * @param map tamp map ex: "a1/b1/c1"
     * @param wait now set wait create tamp 20 ms
    */
    v:(map:string,wait?:number)=>vueProp,
    /**
     * catch tamp this
     * @param fun async this
    */
    async:(fun:(e:any)=>void)=>void,
}


/**
 * html element animate format
*/
interface AnimateAction
{
    /** 動畫持續時間 unit sec */
    duration?:number,
    /** wait 後再 action(unit sec) */
    delay?:number,
    /** number = 運行次數,string "infinite" = 永久運行 */
    count?:any

    /** 播放方向 
     * reverse, alternate, alternate-reverse, alternate, reverse, normal
    */
    direction?:string,
    
    /** 結束 開始 停留狀態
     * none, forwards, backwards, both
     */
    model?:string,
    /**
     * 起用 停止
     * running, paused
     */
    play?:string,
    /** 速率 動作
     * 
     *  -- Keyword values --
     *  ease; ease-in; ease-out; ease-in-out; linear; step-start; step-end;
     *
     *  -- Function values  --
     *  ex
     *  cubic-bezier(0.1, 0.7, 1.0, 0.1);
     *  steps(4, end);
     *
     *  -- Steps Function keywords  --
     *  ex
     *  steps(4, jump-start);
     *  steps(10, jump-end);
     *  steps(20, jump-none);
     *  steps(5, jump-both);
     *  steps(6, start);
     *  steps(8, end);
     *
     *  -- Multiple animations  --
     *  ex
     *  ease, step-start, cubic-bezier(0.1, 0.7, 1.0, 0.1);
     *
     *  -- Global values  --
     * inherit, initial, unset
     */
    timing?:string
}

/** animate 被觸發內容動作 */
interface anActionVal
{
    /** animate 被觸發內容動作 */
    [x:string]:String
}
/** animate 階段觸發 */
interface anAction
{
    /** animate 階段觸發 */
    [x:string]:anActionVal
}
/**
 * 動畫
 */
interface animateModel
{
     /**
     * @param set set 影格運行
     * @param action set 動作  ex {"0%":{"opacity": "0.3"},}
     * @param touch 觸發事件css ex "hover"
    */
    (set:AnimateAction,action:anAction,touch?:string):elOnly,
}

/**
 * html element animate
*/
interface elOnly
{
    /** html element */
    get:any,
    /** element attr id */
    id:(name:string)=>elOnly,
    /** element attr class */
    class:(name:string)=>elList,
    /** element attr name */
    name:(name:string)=>elList,
    /** element name */
    tag:(name:string)=>elList
    /**
     * html element 觸發時間
    */
    on:(action:string,fun:(element:elOnly)=>void)=>elOnly,
    /** delay 影格再起動
     * @param sec setting wait 秒
     */
    delay:(sec:number)=>elOnly,
    /** 前往已設定標旗名位置影格
     * @param flagName 前往 標旗位置影格
     * @param count 迴轉次數
     */
    toFrame:(flagName:string,count:number)=>elOnly,

    /** 影格
     * @param $t element this
     * @param sec setting wait 秒
     * @param flagname 標旗名
     */
    frame:($t:($t:elOnly)=>void,sec?:number,flagname?:string)=>elOnly,
    /**
     * 動畫
    */
    animate:animateModel,
    /**
     * style json ex:{"color":"#FF8800"}
    */
    style:(json:any)=>elOnly,
    /**
     * 刪除運行事件
    */
    remove:()=>elOnly,
    /**
     * 元素是否存在
     */
    exist:boolean
}

interface elList
{
    /**
     * html element 觸發時間
    */
     on:(action:string,fun:(element:elList)=>void)=>elList,
     /** delay 影格再起動
      * @param sec setting wait 秒
      */
     delay:(sec:number)=>elList,
     /** 前往已設定標旗名位置影格
      * @param flagName 前往 標旗位置影格
      * @param count 迴轉次數
      */
     toFrame:(flagName:string,count:number)=>elList,
 
     /** 影格
      * @param $t element this
      * @param sec setting wait 秒
      * @param flagname 標旗名
      */
     frame:($t:($t:elList)=>void,sec?:number,flagname?:string)=>elList,
     /**
      * 動畫
     */
     animate:animateModel,
     /**
      * style json ex:{"color":"#FF8800"}
     */
     style:(json:any)=>elList,
     /**
      * 刪除運行事件
     */
     remove:()=>elList,

    /**
     *  element list
     * @param row $t=element this, nu=row number
    */
    list:(row:($t:elOnly,nu:number)=>void)=>Array<elOnly>,
    /**
     * element indexOf number
    */
    at:(nu:number)=>elOnly,
    /**
     * 元素是否存在
     */
    exist:boolean
}
/**
 * html element animate
*/
interface elAnimate
{
    /** element attr id */
    id:(name:string)=>elOnly,
    /** element attr class */
    class:(name:string)=>elList,
    /** element attr name */
    name:(name:string)=>elList,
    /** element name */
    tag:(name:string)=>elList
}

/**
 * browser 解析 format
 */
interface BrowserInfo
{
    /**
     * 語系
    */
    lang:string,
    /**
     * 廠商
    */
    vendor:string,
    userAgent:string,
    /**
     * 版本
    */
    appVersion:string,
    /**
     * os 平台
    */
    platform:string
}

export default interface pb
{
    /** 取的sever local time 同步unixtime */
    setServerTime:(fun:Function)=>void,
    /** 金額三位一點 
     * @param val cash
     * @returns cash ex:1,000
    */
    MoneyFormat:(val:number)=>string,
    /**
     * date to unix
     * @param val date ex:"2000-01-01 18:00:00" or "2000/01/01 18:00:00" 
     * @returns unix time
     */
    unixRe:(val:string)=>number,
    /**
     * unix to date string
     * @param val date unix
     * @returns date to string ex:"2000/01/01 18:00:00" 
     */
    reunixDate:(val:number)=>string,
    /**
     * now unix time(client)
     */
    unixReNow:()=>number,
    /**
     * add cookie
     * @param name cookie name
     * @param value value
     * @param geTimeval life time(unit:1 equals sec)
     */
    LogindoCookieSetup:(name:string, value:string,geTimeval?:number)=>void,
    /**
     * cookie value
     * @param name cookie name
     */
    LogingetCookie:(name:string)=>string,

    /**
     * cookie delete
     * @param name cookie name
     */
    LogindelCookie:(name:string)=>string,

    /**
     * client browser
    */
     browserInfo:(info?:BrowserInfo)=>browser,

     /**
      * string to base64
      * @param data string value
      * @returns base64 string
     */
     UTF8ToBase64:(data:string)=>string,

     /**
      * base64 to string
      * @param data base64 string
      * @returns string value
     */
     Base64ToUTF8:(data:string)=>string,
     
     /**
      * html element(css animate)
     */
     el:elAnimate,

     /**
      * join json object prototype
      * @param now 被注入 json 物件
      * @param json 取得資料源 物件
     */
     AddPrototype:<T>(now:any,json:any)=>T,

     /** psyl 驗證加密 token to json*/
     tokenToJson:(token:string)=>any,
    /**
     * vue
     * @param $t now vue this
     * @param map tamp map ex: "a1/b1/c1"
     * @param wait now set wait create tamp 20 ms
    */
     v:($t:any,map:string,wait?:number)=>vueProp,

}
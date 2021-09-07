interface asyncGet
{
    /**
     * @param async response function
    */
     async:async,

     /**
      * send data (json object)
     */
    input:(json:any)=>asyncGet

    /**
      * send web head (json object)
     */
    head:(json:any)=>asyncGet
}

/**
 * @param url Api 路經
*/
type goApi = (url:string)=>asyncGet;

/**
 * @param re response data
*/
type asyncTp = (re:string)=>void;
/**
 * async response data
*/
interface async
{
    /**
     * @param fun response function
    */
    (fun:asyncTp):void;
}

export default interface ajax
{
    /**
     *  ajax get
    */
    get:goApi,
    /**
     *  ajax get & token 驗證
    */
    getToken:goApi,

    /**
     *  ajax post
    */
    post:goApi,

    /**
     *  ajax post & token 驗證
    */
    postToken:goApi,
    /**
     *  ajax json body post
    */
    Json:goApi,
    /**
     *  ajax json body post & token 驗證
    */
    JsonToken:goApi,
    /**
     *  ajax post file
    */
    file:goApi,
    /**
     *  ajax post file token 驗證
    */
    fileToken:goApi
}
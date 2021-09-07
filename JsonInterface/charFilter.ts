/**
 * Youtube Url 過濾取值
 * @param val 
 */
export function YoutubeChar(url:string)
{
    if(url.indexOf("?v=")>-1)
    {
        return url.split("?v=")[1].split('&')[0];
    }
    else
    {
        let urlSplit:Array<string>=url.split("?")[0].split('/');
        return urlSplit[urlSplit.length-1];
    }
}
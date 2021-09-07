this.vue = {
    data:{
        
    },
    init:function($t,$temp){
        $t.main$m.$m.st.serData(true);//初始化搜尋
    },
    temp:function($t){
        /*init $temp() run to temp*/
        return {

            }
    },
    tsc:[],//project -> typescript model
    completed:function($t,tscAry,$temp)
    {
        /*init $temp() run to completed or not exist init*/
    },
    methods:{
        reContent:function(val,dataAry)
        {/** 文碼編緝(\r \n) */
            if(val.langAry.indexOf(this.main.pub.langNu)>-1)
            {//已開起語系
                return this.main.pub.catchLangName(dataAry).substr(0,20).substr(0,16).replace(/\r/g, "").replace(/\n/g, "")+"...";
            }
            else
            {
                try
                {
                    return dataAry[val.langAry[0]].substr(0,20).substr(0,16).replace(/\r/g, "").replace(/\n/g, "")+"...";
                }
                catch(e)
                {
                    return "(null)";
                }
 
            }
        },
        month:function(val)
        {//月份翻譯
            return ((this.main.pub.langNu!=0)?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"][Number(val)-1]:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"][Number(val)-1]);
        },
        week:function(val)
        {//星期
            var nu = Math.ceil(((val/60)/60)/24+2)%7;
            return {
                w:((this.main.pub.langNu!=0)?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][nu]:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"][nu]),
                nu:nu
            };
        },
        LangTitle:function(str)
        {//page 語系
            return this.main.pub.config.get("page")[str];
        }
    }
};

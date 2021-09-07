self.data = {
  pageTagetNu:-1,//當下頁碼
  InputSer:"",//搜尋欄
  RecodeInputSer:"",//記錄搜尋字串
  mbList:[],//mb list
  mbset:{ //使用者設定
    InputEditLimit:"--",//chief、sys 管理者設定權限 input container
    mb:{//db interface member
        /** 
         * DB:帳戶 */
        mbid:null,

        /** 
         * json:登入使用(帳戶) */
        id:null,

        /** 
         * DB:管理者-管理帳號(分享app分想) */
        mg:null,

        /** 
         * DB:確認綁定 */
        ck:null,

        /** 
         * DB:目前已綁定url 並且可使用之 auto key */
        autoAry:null,

        /** 
         * DB:可用點數-被使用 */
        MBCount:null,

        /** 
         * DB:目前起用點數-可歸還 */
        usCount:null,

        /** 
         * DB:支付費用時間 */
        pay:null,

        /** 
         * DB:匿稱 */
        name:null,

        /** 
         * DB:e-mainl 取回帳密用 */
        mail:null,

        /** 
         * DB:密碼 */
        pw:null,

        /** 
         * DB:system UID 副索引 */
        uid:null,

        /** 
         * DB:帳戶操作時間記錄 unix */
        activity:null,

        /** 
         * DB:權限 參閱 enum MBLevel */
        level:null,

        /** 
         * DB:app apns */
        token:null,

        /** 
         * DB:app 種類 */
        mobile:null,

        /** 
         * DB:備註 (最後修改者) */
        mark:null,
    },
    ShareUrlListdata:[],//share url 資料陣列
  },
  paylList:{//單據記錄
    history:[],
    statusfilter:[],//支付狀態
    typefilter:[],//支付類別
    mb:{//db interface member
      /** 
       * DB:帳戶 */
      mbid:null,

      /** 
       * json:登入使用(帳戶) */
      id:null,

      /** 
       * DB:管理者-管理帳號(分享app分想) */
      mg:null,

      /** 
       * DB:確認綁定 */
      ck:null,

      /** 
       * DB:目前已綁定url 並且可使用之 auto key */
      autoAry:null,

      /** 
       * DB:可用點數-被使用 */
      MBCount:null,

      /** 
       * DB:目前起用點數-可歸還 */
      usCount:null,

      /** 
       * DB:支付費用時間 */
      pay:null,

      /** 
       * DB:匿稱 */
      name:null,

      /** 
       * DB:e-mainl 取回帳密用 */
      mail:null,

      /** 
       * DB:密碼 */
      pw:null,

      /** 
       * DB:system UID 副索引 */
      uid:null,

      /** 
       * DB:帳戶操作時間記錄 unix */
      activity:null,

      /** 
       * DB:權限 參閱 enum MBLevel */
      level:null,

      /** 
       * DB:app apns */
      token:null,

      /** 
       * DB:app 種類 */
      mobile:null,
      /**
       * DB:營業占成
      */
      profit:0,

      /** 
       * DB:備註 (最後修改者) */
      mark:null,
    }  
  }
};

self.tsc=["model/MGMBtsc"];
self.completed = function($t,tscAry)
{
  $t["$m"] = tscAry[0];
  pb.v($t.mainTemp,"head_temp").async(function(e)
  {
    $t.headPortal = e;//注入Head
    $t.$m.ma.initHead();
  });
};

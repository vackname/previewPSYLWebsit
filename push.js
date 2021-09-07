/** 
 * node npm -D install web-push
 * web psuh 測試及生成 key */
const webPush = require('web-push');
// VAPID keys should be generated only once.
//const vapidKeys = webpush.generateVAPIDKeys();
//console.log(vapidKeys);
var vapidkeys = {
    publicKey: 'BFJZicEEHLm16qgv-Kqan_qbOIET27m1j2xbaT62BdhJjPeJLE2Y8W-2Sm-ETCYDNNXr4gv10mpVB6JZDRR5XuI',
    privateKey: 'PQFYoFg6Co-b3mqAUA8UDZUBZfeQp84nR5V_uNJU5lk'
  };

  webPush.setVapidDetails(
    'mailto:psyltw@gmail.com',
    vapidkeys.publicKey,
    vapidkeys.privateKey
  );

  var senNotification = {
      "endpoint":"https://fcm.googleapis.com/fcm/send/d49BkGsMo-g:APA91bFGUgUofhLIREymxXLosc6Kn_DYQOrAzr7Ups9uUTlbO3bInWNQr1XG3vJ0-VIebsB6kNApE_o7bq8Embz5CjC4TPbj8CUSTtJFO1uWwrWNKMpXtvPPMkjV-KgqT9uE44JafKFq",
      "expirationTime":null,
      "keys":{"p256dh":"BH_qwV3REJR2-unGsswg4D49u5uZbLqOlPPgBsWoB585s2qvULLlWjVaHlbQv8wXPYmp7x6aVURcXdQywhPzGrU","auth":"hurKKpr8wEU5ncOo8rviqQ"}
    };//推播
  webPush.sendNotification(senNotification,"test Mes");

  

  var senNotification2 = {"endpoint":"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABhLdipHlZLHQZ1R24W82OlOo4d_gIMvBd_RcFY9CBjL3LocF87nDsQDwMKew7_0LHOP6DnqomBuZ1ULQ0adMxLxlL4NlJ9eNSTAgclnMKBV6rEeNXAKtXldU61tFvFSFEz9U5H4XTQaonrpgOacmLBALrz9v7mIzQ45mPKZcfCskoIAsI",
  "keys":{"auth":"FpRByAB4Wn4geSll8l-y7Q","p256dh":"BDirqMjSumAs4gEZehQY_oXcajW0rN0bojacwuSJYzJsXyIHfPrFr0yzTnmnUAU65oi-2zPIoH_8F7FZMc4C0Mk"}
};

webPush.sendNotification(senNotification2,"test Mes");
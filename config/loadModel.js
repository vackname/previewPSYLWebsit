
//---
//載入 oder
//---

var configObj = new configDataList();

$t.m.css.sit(function(e){
    console.log("Model css =>sit_"+e);
});

$t.m.js["googleLogin"](function(e)
{//載入google model
    $t.m.js.Jobj(function(e1){//載入 序列化 model          
        console.log("Model js =>jobj_"+e1);
        $t.pub = configObj.setPublic(function(){//download libary            
            console.log("libary =>init");
            pb.setServerTime(function()
            {//sever localtime setting
                console.log("set local time => server");
                $t.p.init(function(e3){//載入口點
                    console.log("page vue =>init---"+e3);
                    console.log("在找我/find me？https://psyltw.com/author");
                });
            });
        });
    });
});


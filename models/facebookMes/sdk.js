if(window.location.host.indexOf("psyltw.com")>-1)
{//網域名阻擋
    var chatbox = document.getElementById('fb-customer-chat');
    chatbox.setAttribute("page_id", "160200721204316");
    chatbox.setAttribute("attribution", "biz_inbox");
    window.fbAsyncInit = function() {
    FB.init({
        xfbml            : true,
        version          : 'v11.0'
    });
    };

    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/zh_TW/sdk/xfbml.customerchat.js';
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

  
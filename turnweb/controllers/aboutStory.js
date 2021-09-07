//data bind (self.data)
self.data = {

};
self.tsc = [];
self.completed = function($t,tscAry){
    $t.inviteImg=  new Jobj();
    $t.inviteImg.loadlib("Invite",function(e){//載入img
        $t.inviteimgload=true;
    });
};

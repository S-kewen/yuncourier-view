window.callback = function(res){
    showToastrSucc("","驗證成功",7,1000);
    var username = $("#username").val();
    var password = $("#password").val();
    if(username==''){
        showToastrWarn("","用戶名不能為空",7,1000);
        $("#username").focus();
        return false;
    }
    if(password==''){
        showToastrWarn("","密碼不能為空",7,1000);
        $("#password").focus();
        return false;
    }
    if(res.ret === 0){
        const validate = res.ticket;
        const randstr = res.randstr;
        if(validate==''){
            showToastrWarn("","驗證碼不能為空",7,1000);
            return false;
        }
        showToastrInfo("","正在發出登錄請求...",7,1000);
        $.ajax({
            url:"//courier-api.iskwen.com/api/userLogin",
            type:"POST",
            dataType: "json",
            data:"username="+username+"&password="+hex_md5(password)+"&vall="+validate+"&randstr="+randstr,
            success:function(msg){
                if(msg.status!=0){
                    showToastrError("",msg.tip,7,2000);
                    if(msg.status===-15){
                        showConfirm("溫馨提示","經系統檢測,該賬號存在重大風險現已凍結,需重置密碼後才能解除凍結!",function(index){
                            showConfirm("溫馨提示","新密碼將會發往該賬號所綁定的郵箱,是否現在重置密碼解除凍結？",function(index){
                            $.ajax({
                                url : "//courier-api.iskwen.com/api/resetPassword",
                                type : "post",
                                dataType:"json",
                                data:"username="+username,
                                success:function(msg){
                                    if(msg.status==0){
                                        showMsg("重置成功,請前往郵箱查看")
                                    }else {
                                        showTip(msg.tip);
                                    }
                                },
                                error:function(XMLHttpRequest, textStatus, errorThrown){
                                    showTip("系统在开小差，请稍后再试");
                                }
                            })
                        });
                        });
                    }
                }
                else{
                    showToastrSucc("","登錄成功",7,2000);
                    setCookie("token",msg.token,1000*60*60*2);
                    top.window.location='/index';
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                showErrorMsg("系统在开小差，请稍后再试");
            }
        });

    }else if (res.ret===2){
        showTip("弟弟,不要放棄.XDDDDD");
    }
}
function keyLogin(){
    if (event.keyCode===13){
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: 'easeOutQuart' },

            strokeDasharray: {
                value: '530 1386',
                duration: 700,
                easing: 'easeOutQuart' } });
        document.getElementById("TencentCaptcha").click();
    }   //回车键的键值为13
}

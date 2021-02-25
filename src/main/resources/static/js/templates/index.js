var task_refreshUnreadMessage = window.setInterval('getUnreadMessageCount()',10000);//刷新未讀消息
var task_checkToken = window.setInterval('checkToken()',30000);//刷新未讀消息
$(document).ready(function() {
    $.ajax({
        url : "//courier-api.iskwen.com/api/checkToken",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                //showRockTip("用戶:"+msg.username+"\nttl:"+msg.ttl)
            }else{
                top.location.href = '/logout';
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
    $.ajax({
        url : "//courier-api.iskwen.com/api/getIndexInfo",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#usernameByCite").html(msg.username);
                //$("#usernameBySpan").html(msg.username);
                if(msg.messageState>99){
                    $("#messageState").html("99+");
                }else{
                    $("#messageState").html(msg.messageState);
                }
            }else{
                showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
})
function modifyInfo(){
    layer.open({
        type : 2,
        title : false,
        content : '/user/modifyInfo',
        btn : [ "修改",'取消' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '450px', '210px' ],
        yes : function(index, layero) {
            var body = layer.getChildFrame('#modifyInfo', index);
            var mail = body.find("input[name='mail']").val();
            var phone = body.find("input[name='phone']").val();
            if (mail==''){
                showTip("郵箱地址不能為空");
                return false;
            }
            if (!checkEmail(mail)){
                showTip("郵箱地址格式不正確");
                return false;
            }
            if (phone!='' && !checkPhone(phone)){
                showTip("手機號碼格式不正確,目前僅支持台灣和中國大陸手機號碼");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/modifyInfo",
                type : "post",
                dataType:"json",
                data:body.serialize(),
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("修改成功");
                        layer.close(index);
                    }else{
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })
        },
        btn2 : function(index, layero) {
            layer.close(index);
        }
    });
}
function modifyPassword(){
    layer.open({
        type : 2,
        title : false,
        content : '/user/modifyPassword',
        btn : [ "修改",'取消' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '450px', '260px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#modifyPassword', index);
            const oldPwd = body.find("input[name='oldPwd']").val();
            const newPwd = body.find("input[name='newPwd']").val();
            const renewPwd = body.find("input[name='renewPwd']").val();
            if (renewPwd==='' || newPwd==='' || oldPwd===''){
                showTip("密碼不能為空");
                return false;
            }
            if (newPwd!==renewPwd){
                showTip("新密碼兩次輸入不一致");
                return false;
            }
            if (newPwd===oldPwd){
                showTip("原密碼不能與新密碼一致");
                return false;
            }
            if (newPwd.length<8){
                showTip("新密碼長度必須大於8");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/modifyPassword",
                type : "post",
                dataType:"json",
                data:"oldPassword="+hex_md5(oldPwd)+"&newPassword="+hex_md5(newPwd),
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status===0){
                        showMsg("修改成功");
                        showConfirm("溫馨提示","當前登錄已失效,是否重新登錄？",function(index){
                            showToastrSucc("","正在退出登錄...",7,1000);
                            top.location.href = '/logout';
                        });
                        layer.close(index);
                    }else{
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })
        },
        btn2 : function(index, layero) {
            layer.close(index);
        }
    });
}
function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
function checkPhone(str){
    if (RegExp(/^[0][0-9]{9}$/).test(str)) {
        return true;
    }else if (RegExp(/^[1][0-9]{10}$/).test(str)){
        return true;
    }else{
        return false;
    }
}
function logout(){
    showConfirm("溫馨提示","您確認要退出登錄嗎？",function(index){
        showToastrSucc("","正在退出登錄...",7,1000);
        top.location.href = '/logout';
    });
}
function getUnreadMessageCount() {
    $.ajax({
        url : "//courier-api.iskwen.com/api/getUnreadMessageCount",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                var nowCount=$("#messageState").html();
                if(msg.unreadMessageCount>99){
                    $("#messageState").html("99+");
                }else{
                    if(msg.unreadMessageCount>0){
                        $("#messageState").html(msg.unreadMessageCount);
                    }else{
                        $("#messageState").html(0);
                    }
                }
                if(nowCount!=="99+" && msg.unreadMessageCount>0 && nowCount<msg.unreadMessageCount){
                    newMessageTip();
                }
            }else{
                // showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            // showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}
function refresh(){
    $.ajax({
        url : "//courier-api.iskwen.com/api/checkToken",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                // getUnreadMessageCount();
            }else{
                top.location.href = '/logout';
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}
function checkToken(){
    $.ajax({
        url : "//courier-api.iskwen.com/api/checkToken",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                //showRockTip("用戶:"+msg.username+"\nttl:"+msg.ttl)
            }else{
                clearInterval(task_refreshUnreadMessage);
                clearInterval(task_checkToken);
                showConfirm("溫馨提示",msg.tip+",是否重新登錄?",function(index){
                    showToastrSucc("","正在退出登錄...",7,1000);
                    top.location.href = '/logout';
                });
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}
function note() {
    showSimpleTip("便簽內容只會存儲在本地，清除瀏覽記錄後就會永久消失");
}
function locking() {
    showSimpleTip("暫不支持鎖定功能");
}
function newMessageTip() {
    layer.tips('您有新的消息,請注意查看哦~', '#messageButton', {
        tips: 3
    });
    // var auto = $("#auto");
    // auto.attr("src","https://static.iskwen.com/yuncourier/mp3/messageTip.mp3");
}
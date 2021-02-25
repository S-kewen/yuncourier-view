$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com/api/getUserIndexInfo",
        type:"POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#todayMailNum").html(msg.todayMailNum);
                $("#allMailNum").html(msg.allMailNum);
                $("#todaySmsNum").html(msg.todaySmsNum);
                $("#allSmsNum").html(msg.allSmsNum);
                $("#todayLinkNum").html(msg.todayLinkNum);
                $("#allLinkNum").html(msg.allLinkNum);
                $("#allFailNum").html(msg.allFailNum);
                if(msg.allFailNum===0){
                    $("#successRate").html("100");
                }else{
                    $("#successRate").html(((((msg.allSmsNum+msg.allMailNum+msg.allLinkNum)-msg.allFailNum)/(msg.allSmsNum+msg.allMailNum+msg.allLinkNum))*100).toFixed(2));
                }
                $("#todayPay").html(msg.todayPay.toFixed(2));
                $("#allPay").html(msg.allPay.toFixed(2));
                if (msg.balance>10000){
                    $("#todayBalance").html((msg.balance/1000).toFixed(2));
                    $("#todayBalanceUnit").html('k');
                }else{
                    $("#todayBalance").html(msg.balance.toFixed(2));
                }
                $("#allBalance").html((msg.balance+msg.allPay).toFixed(2));
                $(".numToThousands").numScroll({
                    toThousands:true
                });
                $(".num").numScroll();
                $("#username").html(msg.username);
                $("#balance").html(toThousands(msg.balance.toFixed(2)));
                $("#email").html(msg.email);
                $("#ip").html(msg.ip);
                $("#phone").html(msg.phone);
                if(msg.state==1){
                    $("#state").html("正常");
                }else{
                    $("#state").html("異常");
                }
            }else{
                showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
    $.ajax({
        url:"//courier-api.iskwen.com/api/listUserIndexLoginRecord",
        type:"POST",
        dataType: "json",
        data:"state=0&type=1",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.list!==undefined){
                var loginList="";
                var login_state_tip;
                var login_time_Date;
                var date;
                var loginRecordCount=0;
                $.each(msg.list, function(index,json) {
                    loginRecordCount++;
                    if (json.state==1){
                        login_state_tip="登錄成功";
                    }else if (json.state===2){
                        login_state_tip="<font  color=\"blue\">登錄失敗</font>";
                    }else if (json.state===3){
                        login_state_tip="<font  color=\"#ff4500\">登錄禁止</font>";
                    }else if (json.state===4){
                        login_state_tip="<font  color=\"red\">登錄凍結</font>";
                    }else{
                        login_state_tip="<font  color=\"#20b2aa\">未知</font>";
                    }
                    if (json.add_time=='' || json.add_time ==undefined){
                        login_time_Date="-";
                    }else{
                        date = new Date(json.add_time);
                        login_time_Date=formatter(date,"yyyy-MM-dd hh:mm:ss");
                    }
                    loginList=loginList+"<tr><br><td>"+login_time_Date+"</td><br><td>"+json.ip+"</td><br><td><p class=\"small\">"+json.position+"</p></td><br><td>"+login_state_tip+"</td><br></tr><br>";
                });
                $("#loginList").html(loginList);
            }else{
                showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
    $.ajax({
        url:"//courier-api.iskwen.com/api/listUserIndexMessage",
        type:"POST",
        dataType: "json",
        data:"state=0",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.list!==undefined){
                var newsList="";
                var time_Date;
                var newsCount=0;
                var unreadTip="";
                $.each(msg.list, function(index2,json2) {
                    newsCount++;
                    if (json2.add_time=='' || json2.add_time ==undefined){
                        time_Date="-";
                    }else{
                        date = new Date(json2.add_time);
                        time_Date=formatter(date,"yyyy-MM-dd hh:mm:ss");
                    }
                    if (json2.state==1){
                        unreadTip="<span class=\"layui-badge-dot\"></span>";
                    }else{
                        unreadTip="";
                    }
                    newsList=newsList+"<a href=\"#\" class=\"pull-left\"> <img alt=\"image\"class=\"img-circle\" src=\"https://static.iskwen.com/yuncourier/images/Sender_admin.jpg\">"+unreadTip+"</a><div class=\"media-body \"><strong>"+json2.title+"</strong><br><small class=\"text-muted\">"+time_Date+" 來自 <strong>"+json2.sender+"</strong></small><div class=\"well\">"+json2.msg+"</div></div>";
                });
                if (newsCount>=50){
                    newsList=newsList+"<div style=\"text-align:center;font-size:11px\" >僅顯示近50條記錄</div>"
                }
                $("#newsList").html(newsList);
            }else{
                showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
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
                        location.reload();
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
function goRecharge() {
    showTip("暫不開放儲值服務");
}
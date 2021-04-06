$(document).ready(function() {
    $.ajax({
        url : "//courier-api.iskwen.com/api/getConsoleInfo",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                let cpuTip;
                let ramTip;
                $("#todayRunNum").html(msg.todayRunNum);
                $("#allRunNum").html(msg.allRunNum);
                if(msg.todayPay>=10000){
                    $("#todayPay").html((msg.todayPay/1000).toFixed(2));
                    $("#todayPayUnit").html('k');
                }else{
                    $("#todayPay").html(msg.todayPay.toFixed(2));
                }
                if(msg.allPay>=10000){
                    $("#allPay").html((msg.allPay/1000).toFixed(2));
                    $("#allPayUnit").html('k');
                }else{
                    $("#allPay").html(msg.allPay.toFixed(2));
                }
                $(".numToThousands").numScroll({
                    toThousands:true
                });
                $("#mailRunNum").html(toThousands(msg.mailRunNum));
                $("#smsRunNum").html(toThousands(msg.smsRunNum));
                $("#linkRunNum").html(toThousands(msg.linkRunNum));
                $("#lineRunNum").html(toThousands(msg.lineRunNum));
                $("#interceptNum").html(toThousands(msg.interceptNum));
                $("#runFailNum").html(toThousands(msg.runFailNum));
                if(msg.runFailNum===0 || msg.allRunNum===0){
                    $("#successRate").html('100%');
                }else{
                    $("#successRate").html((((msg.allRunNum-msg.runFailNum)/msg.allRunNum)*100).toFixed(2)+'%');
                }
                $("#mailRunNum").html(toThousands(msg.mailRunNum));
                $("#mailRunNum").html(toThousands(msg.mailRunNum));
                if (msg.cpu-65>0){
                    cpuTip="CPU使用率(較預期增長 "+(msg.cpu-65).toFixed(2)+"% <span class=\"layui-edge layui-edge-top\" lay-tips=\"增长\" lay-offset=\"-15\"></span>)";
                }else{
                    cpuTip="CPU使用率(較預期下降 "+(65-msg.cpu).toFixed(2)+"% <span class=\"layui-edge layui-edge-bottom\" lay-tips=\"下降\" lay-offset=\"-15\"></span>)";
                }
                if (msg.ram-75>0){
                    ramTip="內存使用率(較預期增長 "+(msg.ram-75).toFixed(2)+"% <span class=\"layui-edge layui-edge-top\" lay-tips=\"增长\" lay-offset=\"-15\"></span>)";
                }else{
                    ramTip="內存使用率(較預期下降 "+(75-msg.ram).toFixed(2)+"% <span class=\"layui-edge layui-edge-bottom\" lay-tips=\"下降\" lay-offset=\"-15\"></span>)";
                }
                $("#cpu").attr("lay-percent",msg.cpu.toFixed(2)+"%");
                $("#ram").attr("lay-percent",msg.ram.toFixed(2)+"%");
                if(msg.cpu>75){
                    $("#cpu").attr("class","layui-progress-bar layui-bg-red");
                }else if(msg.cpu>50){
                    $("#cpu").attr("class","layui-progress-bar layui-bg-orange");
                }else if(msg.cpu>25){
                    $("#cpu").attr("class","layui-progress-bar layui-bg-blue");
                }else{
                    $("#cpu").attr("class","layui-progress-bar layui-bg-green");
                }
                if(msg.ram>75){
                    $("#ram").attr("class","layui-progress-bar layui-bg-red");
                }else if(msg.ram>50){
                    $("#ram").attr("class","layui-progress-bar layui-bg-orange");
                }else if(msg.ram>25){
                    $("#ram").attr("class","layui-progress-bar layui-bg-blue");
                }else{
                    $("#ram").attr("class","layui-progress-bar layui-bg-green");
                }
                $("#cpuTip").html(cpuTip);
                $("#ramTip").html(ramTip);
                layui.use('element', function() {
                    const element = layui.element;
                    element.init();
                });
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
            layer.iframeAuto(index);
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
        showToastrSucc("","正在退出登錄",7,1000);
        top.location.href = '/logout';
    });
}
function addSoftware(){
    layer.open({
        type : 2,
        anim: 1,
        title : "添加應用",
        content : '/app/addSoftware',
        btn : ['添加', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '350px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#addSoftware', index);
            const softwareName = body.find("input[name='softwareName']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareName===''){
                showTip("應用名稱不能為空");
                return false;
            }
            if(softwareName.length>16){
                showTip("應用名稱長度不能大於16");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於16");
                return false;
            }
            $.ajax({
                    url : "//courier-api.iskwen.com/api/addSoftware",
                    type : "post",
                    dataType:"json",
                    data:body.serialize(),
                headers: {'Authorization': getCookie("token")},
                    success:function(msg){
                        if(msg.status==0){
                            showMsg("添加成功")
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
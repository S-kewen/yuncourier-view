$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com/api/getSmsInfo",
        type:"POST",
        dataType: "json",
        data:"id="+getUrlValue("id"),
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#softwareName").val(msg.softwareName);
                $("#softwareId").val(msg.softwareId);
                $("#token").val(msg.token);
                $("#type").find("option[value='"+msg.type+"']").attr("selected",true);
                // $("#content_type").val(msg.content_type);
                $("#state").find("option[value='"+msg.state+"']").attr("selected",true);
                $("#receive_phone").val(msg.receive_phone);
                // $("#sender").val(msg.sender);
                $("#subject").val(msg.subject);
                $("#msg").html(msg.msg);
                $("#ip").val(msg.ip);
                $("#addTime").val(msg.addTime);
                $("#remark").html(msg.remark);
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
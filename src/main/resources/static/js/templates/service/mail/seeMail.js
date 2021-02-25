$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com/api/getMailInfo",
        type:"POST",
        dataType: "json",
        data:"id="+getUrlValue("id"),
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#softwareName").val(msg.softwareName);
                $("#softwareId").val(msg.softwareId);
                $("#token").val(msg.token);
                $("#content_type").find("option[value='"+msg.content_type+"']").attr("selected",true);
                // $("#content_type").val(msg.content_type);
                $("#state").find("option[value='"+msg.state+"']").attr("selected",true);
                $("#receive_mail").val(msg.receive_mail);
                $("#sender").val(msg.sender);
                $("#title").val(msg.title);
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
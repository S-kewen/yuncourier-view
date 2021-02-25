$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com/api/getModifyInfo",
        type:"POST",
        dataType: "json",
        data:"id="+getUrlValue("id"),
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#mail").val(msg.mail);
                $("#phone").val(msg.phone);
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
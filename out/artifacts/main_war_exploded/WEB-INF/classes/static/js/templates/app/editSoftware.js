$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com:8888/api/getSoftwareInfo",
        type:"POST",
        dataType: "json",
        data:"id="+getUrlValue("id"),
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                $("#softwareName").val(msg.softwareName);
                $("#token").val(msg.token);
                $("#copyToken").attr("data-clipboard-text",msg.token);
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
function changeToken() {
    showConfirm("溫馨提示","重置後原Token將失效,您確認要重置Token嗎？",function(index){
        showMsg("重置成功");
        $("#token").val(getRandomStr(32));
    });
}
const clipboard = new ClipboardJS('.btn');
clipboard.on('success', function(e) {
    showMsg("複製成功");
    console.log(e);
});
clipboard.on('error', function(e) {
    showTip("複製失敗");
    console.log(e);
});
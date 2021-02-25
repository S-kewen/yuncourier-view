var grid = $("#listMyMail").bootstrapTable({
    url:"//courier-api.iskwen.com:8888/api/listMyMail" ,
    height:document.body.clientHeight*0.8,
    method:"post",
    dataType:"json",
    contentType: "application/x-www-form-urlencoded",
    pagination: true,//是否显示分页（*）
    pageList: [10, 20, 50, 100, 200], ////可供选择的每页的行数（*）
    sortable: false,      //是否启用排序
    sortOrder: "asc",
    pageSize: 20,  //每页显示的记录数
    pageNumber:1, //当前第几页
    queryParamsType : "undefined",
    striped: true,
    sidePagination: "server", //服务端请求
    ajaxOptions: {
        headers: {"Authorization": getCookie("token")}
    },
    columns: [{
        field: 'mail_id',
        title: '編號',
        align : 'center',
        sortable:true,
        width:50
    },{
        field: 'software_name',
        title: '應用名稱',
        align : 'center',
        width:100
    },{
        field: 'ip',
        title: 'IP地址',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'receive_mail',
        title: '收信人',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            return "<a class='btn btn-danger btn-rounded btn-xs' href='mailto:"+value+"'>"+value+"</a>";
        }
    },{
        field: 'title',
        title: '標題',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            if(value.length>20){
                return value.substring(0,20)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    },{
        field: 'content_type',
        title: '類型',
        align : 'center',
        width:80,
        formatter : function(value, row, index) {
            if(value == 1){
                return "<button id='type_"+row.mail_id+"' onClick='javascript:typeTip(1,\"type_"+row.mail_id+"\")' class='layui-btn layui-btn-xs btn-normal'>普通</a>";
            }else if(value == 2){
                return "<button id='type_"+row.mail_id+"' onClick='javascript:typeTip(2,\"type_"+row.mail_id+"\")' class='layui-btn layui-btn-xs layui-btn-warm'>html</a>";
            }else if(value == 3){
                return "<button id='type_"+row.mail_id+"' onClick='javascript:typeTip(3,\"type_"+row.mail_id+"\")' class='layui-btn layui-btn-xs layui-btn-danger btn-rounded'>flowWarn</a>";
            }else{
                return "<button id='type_"+row.mail_id+"' onClick='javascript:typeTip(-1,\"type_"+row.mail_id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'sender',
        title: '發件人',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            if (value==undefined || value==""){
                return "-";
            }else{
                return value;
            }
        }
    },{
        field: 'state',
        title: '狀態',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value === 1){
                return "<button id='state_"+row.mail_id+"' onClick='javascript:stateTip(1,\"state_"+row.mail_id+"\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
            }else if(value === 2){
                return "<button id='state_"+row.mail_id+"' onClick='javascript:stateTip(2,\"state_"+row.mail_id+"\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
            }else if(value === 3){
                return "<button id='state_"+row.mail_id+"' onClick='javascript:stateTip(3,\"state_"+row.mail_id+"\")' class='btn btn-warning btn-rounded btn-xs'>補發</a>";
            }else{
                return "<button id='state_"+row.mail_id+"' onClick='javascript:stateTip(-1,\"state_"+row.mail_id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'add_time',
        title: '發送時間',
        align : 'center',
        width:150,
        formatter : function(value,row,index){
            if (value==''||value ==undefined){
                return '-';
            }
            var date = new Date(value);
            return formatter(date,"yyyy-MM-dd hh:mm:ss");
        }
    },
        {
            field: '',
            title: '操作',
            formatter : function(value,row,index){
                var result="<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:seeMail("+row.mail_id+")'>查看</button>";
                if (row.state==1){
                    result=result+"<button class='layui-btn layui-btn-xs layui-btn-disabled' >重發</button>";
                }else if (row.state==2){
                    result=result+"<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:retryMail("+row.mail_id+")'>重發</button>";
                }
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteMail("+row.mail_id+")'>刪除</button>";
            }
        }],
    queryParams: queryParams
});

function reload(){
    grid.bootstrapTable('refresh');
}

function queryParams(params){
    var content = $("#content").val();
    if(content!=''){
        params.content = content;
    }
    var startTime = $("#startTime").val();
    if(startTime!=''){
        params.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if(endTime!=''){
        params.endTime = endTime;
    }
    var state = $("#state").val();
    if(state!=''){
        params.state = state;
    }
    var content_type = $("#content_type").val();
    if(content_type!=''){
        params.content_type = content_type;
    }
    if (endTime!='' && startTime!=''){
        if (endTime<startTime){
            showTip("開始時間不能大於結束時間");
            return false;
        }
    }
    return params;
}
function resetSearch(){
    $("#content").val('');
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    $("#content_type").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteMail(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/deleteMail",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("刪除成功")
                        layer.close(index);
                        reload();
                    }else {
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showTip("系统在开小差，请稍后再试");
                }
            })
        });

    }
}
function retryMail(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要補發該郵件嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/retryMail",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("補發成功")
                        layer.close(index);
                        reload();
                    }else {
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showTip("系统在开小差，请稍后再试");
                }
            })
        });

    }
}
function typeTip (type,id){
    if (type==1){
        layer.tips('簡單的文字郵件~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('可以運行html代碼的郵件~', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('yuntechflow模板郵件~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function stateTip (state,id){
    if (state==1){
        layer.tips('發送成功~', '#'+id, {
            tips: 1
        });
    }else if (state==2){
        layer.tips('發送失敗,可以點擊重發試試哦~', '#'+id, {
            tips: 1
        });
    }else if (state==3){
        layer.tips('補發成功,不收取任何費用哦~!', '#'+id, {
            tips: 1
        });
    }else if (state==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function seeMail(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "查看",
        content : '/service/mail/seeMail?id='+id,
        resize : false,
        scrollbar : false,
        area : [ '700px', '520px' ]
    });
}
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/token/IP/收件人/發件人/標題/內容/備註");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function(e) {
    showMsg("複製成功");
    console.log(e);
});
clipboard.on('error', function(e) {
    showTip("複製失敗");
    console.log(e);
});
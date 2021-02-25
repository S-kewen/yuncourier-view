var grid = $("#listMessage").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listMessage" ,
    height : document.body.clientHeight * 0.821,
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
        field: 'id',
        title: '編號',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(row.state===1){
                return value;
            }else{
                return value;
            }
        }
    },{
        field: 'sender',
        title: '類型',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            if(row.state===1){
                return value;
            }else{
                return value;
            }
        }
    },{
        field: 'title',
        title: '標題',
        align : 'center',
        width:150
    },{
        field: 'msg',
        title: '內容',
        align : 'left',
        width:450,
        formatter : function(value, row, index) {
            if(value.length>30){
                return value.substring(0,30)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
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
            if(value == 1){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(1,\"state_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>未讀</a>";
            }else if(value == 2){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(2,\"state_"+row.id+"\")' class='btn btn-primary btn-rounded btn-xs'>已讀</a>";
            }else{
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(-1,\"state_"+row.id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'add_time',
        title: '创建时间',
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
                var result="";
                if(row.state==1){
                    result="<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:readMessage("+row.id+")'>確認已讀</button>"
                }
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteMessage("+row.id+")'>删除</button>";
            }
        }], onLoadSuccess:function(){
        // const pages = $("#listMessage").bootstrapTable("getOptions").totalPages;
        // showMsg("成功查詢到"+pages+"條數據");
    },onLoadSuccess:function(msg){

    },onLoadError:function(status){
        showErrorMsg("獲取數據失敗,請重新登錄後再試("+status+")");
    },
    queryParams: queryParams
});

function reload(){
    updateAllReadButtonState();
    grid.bootstrapTable('refresh');
}

function queryParams(params){
    var content = $("#content").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var state = $("#state").val();
    if(content!=''){
        params.content = content;
    }
    if(startTime!=''){
        params.startTime = startTime;
    }
    if(endTime!=''){
        params.endTime = endTime;
    }
    if(state!=''){
        params.state = state;
    }else{
        params.state = 0;
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
    updateAllReadButtonState();
    $("#content").val('');
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}
$(document).ready(function() {
    $.ajax({
        url : "//courier-api.iskwen.com/api/getUnreadMessageCount",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                if(msg.unreadMessageCount>99){
                    $("#unreadMessageCount").html("99+");
                }else{
                    if(msg.unreadMessageCount>0){
                        $("#unreadMessageCount").html(msg.unreadMessageCount);
                    }else{
                        $("#allRead").attr('disabled',true);
                    }

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
function deleteMessage(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("温馨提示","您确定要删除该信息吗？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteMessage",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("删除成功")
                        layer.close(index);
                        reload();
                    }else{
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
function allReadMessage(){
        showConfirm("温馨提示","您确定要將全部消息設置完已讀嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/allReadMessage",
                type : "post",
                dataType:"json",
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("成功閱讀了"+msg.count+"條消息");
                        updateAllReadButtonState();
                        layer.close(index);
                        reload();
                    }else{
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showTip("系统在开小差，请稍后再试");
                }
            })
        });
}
function readMessage(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        // showConfirm("温馨提示","您确定要將該信息設已讀吗？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/readMessage",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("設置成功");
                        updateAllReadButtonState();
                        // layer.close(index);
                        reload();
                    }else{
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showTip("系统在开小差，请稍后再试");
                }
            })
        // });

    }
}
function stateTip (type,id){
    if (type==1){
        layer.tips('您還沒閱讀呢~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('已經閱讀完了~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function updateAllReadButtonState() {
    $.ajax({
        url : "//courier-api.iskwen.com/api/getUnreadMessageCount",
        type : "post",
        dataType:"json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                if(msg.unreadMessageCount>99){
                    $("#allRead").attr('disabled',false);
                    $("#unreadMessageCount").html("99+");
                }else{
                    if(msg.unreadMessageCount>0){
                        $("#allRead").attr('disabled',false);
                        $("#unreadMessageCount").html(msg.unreadMessageCount);
                    }else{
                        $("#unreadMessageCount").html(0);
                        $("#allRead").attr('disabled',true);
                    }

                }
            }else{
                showTip(msg.tip);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}
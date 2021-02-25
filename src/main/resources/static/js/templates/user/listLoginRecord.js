var grid = $("#listLoginRecord").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listLoginRecord" ,
    height:document.body.clientHeight * 0.821,
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
        sortable:true,
        width:50
    },{
        field: 'ip',
        title: 'IP地址',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'position',
        title: '詳細信息',
        align : 'center',
        width:450
    },{
            field: 'state',
            title: '登錄狀態',
            align : 'center',
            width:50,
            formatter : function(value, row, index) {
                if(value == 1){
                    return "<button id='login_state_"+row.id+"' onClick='javascript:stateTip(1,\"login_state_"+row.id+"\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
                }else if(value == 2){
                    return "<button id='login_state_"+row.id+"' onClick='javascript:stateTip(2,\"login_state_"+row.id+"\")' class='btn btn-warning btn-rounded btn-xs'>失敗</a>";
                }else if(value == 3){
                    return "<button id='login_state_"+row.id+"' onClick='javascript:stateTip(3,\"login_state_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>禁止</a>";
                }else if(value == 4){
                    return "<button id='login_state_"+row.id+"' onClick='javascript:stateTip(4,\"login_state_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>凍結</a>";
                }else{
                    return "<button id='login_state_"+row.id+"' onClick='javascript:stateTip(-1,\"login_state_"+row.id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        },{
            field: 'add_time',
            title: '登錄時間',
            align : 'center',
            width:180,
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
                return "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteLoginRecord("+row.id+")'>刪除</button>";
            }
        }],onLoadSuccess:function(msg){

    },onLoadError:function(status){
        showErrorMsg("獲取數據失敗,請重新登錄後再試("+status+")");
    },
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
    $("#content").val('');
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteLoginRecord(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteLoginRecord",
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
function stateTip (type,id){
    if (type==1){
        layer.tips('登錄成功~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('登錄失敗~!', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('賬號已被禁止登錄~!', '#'+id, {
            tips: 1
        });
    }else if (type==4){
        layer.tips('系統檢測到賬號異常~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function(e) {
    showMsg("複製成功");
    console.log(e);
});
clipboard.on('error', function(e) {
    showTip("複製失敗");
    console.log(e);
});
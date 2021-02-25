var email="";
var grid = $("#listPushMessage").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listPushMessage",
    height: document.body.clientHeight * 0.821,
    method: "post",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    pagination: true,//是否显示分页（*）
    pageList: [10, 20, 50, 100, 200], ////可供选择的每页的行数（*）
    sortable: false,      //是否启用排序
    sortOrder: "asc",
    pageSize: 20,  //每页显示的记录数
    pageNumber: 1, //当前第几页
    queryParamsType: "undefined",
    striped: true,
    sidePagination: "server", //服务端请求
    ajaxOptions: {
        headers: {"Authorization": getCookie("token")}
    },
    columns: [{
        field: 'id',
        title: '編號',
        align: 'center',
        width: 50
    }, {
        field: 'software_name',
        title: '應用名稱',
        align: 'center',
        width: 100
    }, {
        field: 'line_config_name',
        title: '配置名稱',
        align: 'center',
        width: 100
    }, {
        field: 'ip',
        title: 'ip',
        align: 'center',
        width: 100,
        formatter: function (value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'to',
        title: 'userId',
        align: 'center',
        width: 80,
        formatter: function (value, row, index) {
            return "<button class='btn layui-btn-primary btn-rounded btn-xs' data-clipboard-text='" + value + "'>點擊複製</a>";
        }
    }, {
        field: 'type',
        title: '類型',
        align: 'center',
        width: 80,
        formatter: function (value, row, index) {
            if (value === 'text') {
                return "<button id='type_" + row.id + "' onClick='javascript:typeTip(1,\"type_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>"+value+"</a>";
            }  else {
                return "<button id='type_" + row.id + "' onClick='javascript:typeTip(-1,\"type_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>"+value+"</a>";
            }
        }
    }, {
        field: 'remark',
        title: '備註',
        align: 'center',
        width: 150,
        formatter : function(value, row, index) {
            if(value===null || value==='' || value===undefined){
                return '-';
            }
            return value;
        }
    }, {
        field: 'state',
        title: '狀態',
        align: 'center',
        width: 50,
        formatter: function (value, row, index) {
            if (value === 1) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
            } else if (value === 2) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
            }  else {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
        }
    }, {
        field: 'add_time',
        title: '生成時間',
        align: 'center',
        width: 150,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            var date = new Date(value);
            return formatter(date, "yyyy-MM-dd hh:mm:ss");
        }
    },
        {
            field: '',
            title: '操作',
            formatter: function (value, row, index) {
                var result = "<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:seePushMessage("+row.id+")'>查看</button>";
                result += "<button class='layui-btn  layui-btn-xs layui-btn-danger'  onClick='javascript:deletePushMessage(" + row.id + ")'>刪除</button>";
                return result;
            }
        }], onLoadSuccess: function (msg) {

    }, onLoadError: function (status) {
        showErrorMsg("獲取數據失敗,請重新登錄後再試(" + status + ")");
    },
    queryParams: queryParams
});

function reload() {
    grid.bootstrapTable('refresh');
}

function queryParams(params) {
    var content = $("#content").val();
    if (content != '') {
        params.content = content;
    }
    var startTime = $("#startTime").val();
    if (startTime != '') {
        params.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if (endTime != '') {
        params.endTime = endTime;
    }
    var state = $("#state").val();
    if (state != '') {
        params.state = state;
    }
    if (endTime != '' && startTime != '') {
        if (endTime < startTime) {
            showTip("開始時間不能大於結束時間");
            return false;
        }
    }
    return params;
}

function resetSearch() {
    $("#content").val('');
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}

function seePushMessage(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "查看",
        content : '/service/line/seePushMessage?id='+id,
        resize : false,
        scrollbar : false,
        area : [ '700px', '530px' ]
    });
}

function deletePushMessage(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deletePushMessage",
                type: "post",
                dataType: "json",
                data: "id=" + id,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("刪除成功")
                        layer.close(index);
                        reload();
                    } else {
                        showTip(msg.tip);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showTip("系统在开小差，请稍后再试");
                }
            })
        });

    }
}

function stateTip(state, id) {
    if (state == 1) {
        layer.tips('發送成功~', '#' + id, {
            tips: 1
        });
    } else if (state == 2) {
        layer.tips('發送失敗了...', '#' + id, {
            tips: 1
        });
    } else if (state == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}
function typeTip(type, id) {
    if (type == 1) {
        layer.tips('純文字傳輸~', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>應用名稱/配置名稱/ip/userId/type/text/備註");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function (e) {
    showMsg("複製成功");
});
clipboard.on('error', function (e) {
    showTip("複製失敗");
});
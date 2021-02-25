var grid = $("#listVarRecord").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listVarRecord",
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
        width: 100,
        formatter: function (value, row, index) {
            return "<button id='software_" + row.id + "' onClick='javascript:softwareTip(\"software_" + row.id + "\",\"appId:" + row.software_id + "\")' class='btn btn-danger btn-rounded btn-xs'>" + value + "</a>";
        }
    }, {
        field: 'ip',
        title: 'ip',
        align: 'center',
        width: 100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    }, {
        field: 'request',
        title: '請求內容',
        align: 'center',
        width: 80,
        formatter : function(value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='"+value+"'>點擊複製</a>";
        }
    }, {
        field: 'header',
        title: '協議頭',
        align: 'center',
        width: 50,
        formatter : function(value, row, index) {
            return "<button class='btn btn-warning btn-rounded btn-xs btn-xs' data-clipboard-text='"+value+"'>複製</a>";
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
            } else if (value === -3) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-3,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>校驗失敗</a>";
            }else if (value === -4) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-4,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>超時請求</a>";
            }else if (value === -5) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-5,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>已刪除</a>";
            }else if (value === -6) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-6,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>停用</a>";
            }else if (value === -7) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-7,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>過期</a>";
            } else if (value === -8) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-8 ,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>防火攔截</a>";
            }else if (value === -9) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-9 ,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>無效token</a>";
            } else {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
        }
    }, {
        field: 'add_time',
        title: '調用時間',
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
                var result = "";
                result += "<button class='layui-btn  layui-btn-xs layui-btn-danger'  onClick='javascript:deleteOne(" + row.id + ")'>刪除</button>";
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

function deleteOne(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteVarRecord",
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
        layer.tips('狀態正常~', '#' + id, {
            tips: 1
        });
    } else if (state == -3) {
        layer.tips('sign校驗錯誤!', '#' + id, {
            tips: 1
        });
    } else if (state == -4) {
        layer.tips('時間戳異常!', '#' + id, {
            tips: 1
        });
    }else if (state == -5) {
        layer.tips('該變量已刪除!', '#' + id, {
            tips: 1
        });
    }else if (state == -6) {
        layer.tips('該變量已停用!', '#' + id, {
            tips: 1
        });
    }else if (state == -7) {
        layer.tips('該變量已過期!', '#' + id, {
            tips: 1
        });
    }else if (state == -8) {
        layer.tips('防火墻攔截!', '#' + id, {
            tips: 1
        });
    }else if (state == -9) {
        layer.tips('無效token!', '#' + id, {
            tips: 1
        });
    }else if (state == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>應用名稱/ip/請求內容/協議頭/備註");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function (e) {
    showMsg("複製成功");
});
clipboard.on('error', function (e) {
    showTip("複製失敗");
});
function softwareTip(id, tip) {
    layer.tips(tip, '#' + id, {
        tips: 1
    });
}

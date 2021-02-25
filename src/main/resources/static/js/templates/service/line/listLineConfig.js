var email="";
var grid = $("#listLineConfig").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listLineConfig",
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
            if (row.software_id === -1) {
                return "<button id='software_" + row.id + "' onClick='javascript:softwareTip(\"software_" + row.id + "\",\"面向所有應用\")' class='btn btn-danger btn-rounded btn-xs'>不限</a>";
            } else {
                return "<button id='software_" + row.id + "' onClick='javascript:softwareTip(\"software_" + row.id + "\",\"對應單一應用[id:" + row.software_id + "]\")' class='btn btn-danger btn-rounded btn-xs'>" + value + "</a>";
            }
        }
    }, {
        field: 'line_config_name',
        title: '配置名稱',
        align: 'center',
        width: 100
    }, {
        field: 'channel_id',
        title: 'channelId',
        align: 'center',
        width: 120,
        formatter: function (value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'channel_secret',
        title: 'Secret',
        align: 'center',
        width: 80,
        formatter: function (value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='" + value + "'>點擊複製</a>";
        }
    }, {
        field: 'token',
        title: 'token',
        align: 'center',
        width: 80,
        formatter: function (value, row, index) {
            return "<button data-clipboard-text='" + value + "' class='btn btn-danger btn-rounded btn-xs'>點擊複製</button>"
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
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>啟用</a>";
            } else if (value === 2) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>停止</a>";
            } else if (value === 3) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(3,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>異常</a>";
            } else {
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
                var result = "";
                if (row.state === 1) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState(" + row.id + ",2)'>停止</button>";
                } else if (row.state === 2) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState(" + row.id  + ",1)'>啟用</button>";
                } else {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:changeState(" + row.id + ",1)'>解除</button>";
                }
                result += "<button class='layui-btn layui-btn-xs layui-btn-warm' onClick='javascript:editLineConfig(" + row.id + ")'>編輯</button>";
                result += "<button class='layui-btn  layui-btn-xs layui-btn-danger'  onClick='javascript:deleteLineConfig(" + row.id + ")'>刪除</button>";
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

function editLineConfig(id) {
    layer.open({
        type: 2,
        anim: 2,
        title: "編輯",
        content: '/service/line/editLineConfig?id=' + id,
        btn: ['更新', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '450px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#editLineConfig', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const lineName = body.find("input[name='lineName']").val();
            const channelId = body.find("input[name='channelId']").val();
            const channelSecret = body.find("input[name='channelSecret']").val();
            const token = body.find("input[name='token']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                showTip("請先選擇應用");
                return false;
            }
            if (lineName === '' || lineName === null) {
                showTip("配置名稱不能為空");
                return false;
            }
            if (lineName.length > 255) {
                showTip("配置名稱長度不能大於255");
                return false;
            }
            if (channelId === '' || channelId === null) {
                showTip("channelId不能為空");
                return false;
            }
            if (channelId.length > 255) {
                showTip("channelId長度不能大於255");
                return false;
            }
            if (channelSecret === '' || channelSecret === null) {
                showTip("channelSecret不能為空");
                return false;
            }
            if (channelSecret.length > 255) {
                showTip("channelSecret長度不能大於255");
                return false;
            }
            if (token === '' || token === null) {
                showTip("token不能為空");
                return false;
            }
            if (token.length > 255) {
                showTip("token長度不能大於255");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/updateLineConfig?id=" + id,
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&lineName=" + lineName + "&channelId=" + channelId + "&channelSecret=" + channelSecret + "&accessToken=" + URLencode(token) + "&remark=" + remark,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("修改成功")
                        layer.close(index);
                        reload();
                    } else {
                        showTip(msg.tip);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
}

function addLineConfig() {
    layer.open({
        type: 2,
        anim: 2,
        title: "添加配置",
        content: '/service/line/addLineConfig',
        btn: ['確定', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '450px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#addLineConfig', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const lineName = body.find("input[name='lineName']").val();
            const channelId = body.find("input[name='channelId']").val();
            const channelSecret = body.find("input[name='channelSecret']").val();
            const token = body.find("input[name='token']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                showTip("請先選擇應用");
                return false;
            }
            if (lineName === '' || lineName === null) {
                showTip("配置名稱不能為空");
                return false;
            }
            if (lineName.length > 255) {
                showTip("配置名稱長度不能大於255");
                return false;
            }
            if (channelId === '' || channelId === null) {
                showTip("channelId不能為空");
                return false;
            }
            if (channelId.length > 255) {
                showTip("channelId長度不能大於255");
                return false;
            }
            if (channelSecret === '' || channelSecret === null) {
                showTip("channelSecret不能為空");
                return false;
            }
            if (channelSecret.length > 255) {
                showTip("channelSecret長度不能大於255");
                return false;
            }
            if (token === '' || token === null) {
                showTip("token不能為空");
                return false;
            }
            if (token.length > 255) {
                showTip("token長度不能大於255");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/addLineConfig",
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&lineName=" + lineName + "&channelId=" + channelId + "&channelSecret=" + channelSecret + "&accessToken=" + URLencode(token) + "&remark=" + remark,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("添加成功")
                        layer.close(index);
                        reload();
                    } else {
                        showTip(msg.tip);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
}

function changeState(id ,state) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        $.ajax({
            url: "//courier-api.iskwen.com/api/changeLineConfigState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&state=" + state,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    if (state === 1) {
                        showMsg("啟用成功")
                    } else {
                        showMsg("停用成功")
                    }
                    reload();
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip("系统在开小差，请稍后再试");
            }
        })
    }
}

function deleteLineConfig(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteLineConfig",
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
        layer.tips('準備就緒~', '#' + id, {
            tips: 1
        });
    } else if (state == 2) {
        layer.tips('休假中...', '#' + id, {
            tips: 1
        });
    } else if (state == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>應用名稱/配置名稱/channelId/備註");
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
function URLencode(sStr)
{
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
}
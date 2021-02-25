var grid = $("#listLog").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listLog",
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
    },{
        field: 'ip',
        title: 'ip',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'mac',
        title: 'mac',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    }, {
        field: 'title',
        title: '標題',
        align: 'center',
        width: 120
    }, {
        field: 'content',
        title: '內容',
        align: 'center',
        width: 120
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
        field: 'header',
        title: '協議頭',
        align: 'center',
        width: 50,
        formatter : function(value, row, index) {
            return "<button class='btn btn-warning btn-rounded btn-xs btn-xs' data-clipboard-text='"+value+"'>複製</a>";
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
    grid.bootstrapTable('resetFormSearch');
}

function deleteOne(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteLog",
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

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>應用名稱/ip/mac/header/標題/內容/備註");
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

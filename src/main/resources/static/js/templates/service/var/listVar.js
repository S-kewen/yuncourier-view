var grid = $("#listVar").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listVar",
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
        field: 'token',
        title: 'token',
        align: 'center',
        width: 80,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>點擊複製</a>";
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
        field: 'expire_time',
        title: '有效期',
        align: 'center',
        width: 150,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            var date = new Date(value);
            return formatter(date, "yyyy-MM-dd hh:mm:ss");
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
                result += "<button class='layui-btn layui-btn-xs layui-btn-warm' onClick='javascript:editOne(" + row.id + ")'>編輯</button>";
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
function encrypt(str) { //key,iv：16位的字符串
    var wordArray = CryptoJS.enc.Utf8.parse(str);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}
function editOne(id) {
    layer.open({
        type: 2,
        anim: 2,
        title: "編輯",
        content: '/service/var/editVar?id=' + id,
        btn: ['更新', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '620px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#editVar', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const token = body.find("input[name='token']").val();
            const expireTime = body.find("input[name='expireTime']").val();
            const title = body.find("input[name='title']").val();
            const content = body.find("textarea[name='content']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                showTip("請先選擇應用");
                return false;
            }
            if (token === '' || token === null) {
                showTip("token不能為空");
                return false;
            }
            if (token.length != 32) {
                showTip("token長度必須為32位");
                return false;
            }
            if (expireTime === '' || expireTime === null) {
                showTip("到期時間不能為空");
                return false;
            }
            if (title === '' || title === null) {
                showTip("標題不能為空");
                return false;
            }
            if (title.length > 255) {
                showTip("標題長度不能大於255");
                return false;
            }
            if (content === '' || content === null) {
                showTip("內容不能為空");
                return false;
            }
            if (token.length > 2550) {
                showTip("內容長度不能大於2550");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/updateVar?id=" + id,
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&tokenStr=" + token + "&expireTime=" + expireTime + "&title=" + title + "&content=" +encodeURIComponent(content) + "&remark=" + remark,
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

function addVar() {
    layer.open({
        type: 2,
        anim: 2,
        title: "添加變量",
        content: '/service/var/addVar',
        btn: ['確定', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '550px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#addVar', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const expireTime = body.find("input[name='expireTime']").val();
            const title = body.find("input[name='title']").val();
            const content = body.find("textarea[name='content']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                showTip("請先選擇應用");
                return false;
            }
            if (expireTime === '' || expireTime === null) {
                showTip("到期時間不能為空");
                return false;
            }
            if (title === '' || title === null) {
                showTip("標題不能為空");
                return false;
            }
            if (title.length > 255) {
                showTip("標題長度不能大於255");
                return false;
            }
            if (content === '' || content === null) {
                showTip("內容不能為空");
                return false;
            }
            if (content.length > 2550) {
                showTip("內容長度不能大於2550");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/addVar",
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&expireTime=" + expireTime + "&title=" + title + "&content=" + encodeURIComponent(content)  + "&remark=" + remark,
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
            url: "//courier-api.iskwen.com/api/changeVarState",
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

function deleteOne(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteVar",
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
    } else if (state == 2) {
        layer.tips('已停用!', '#' + id, {
            tips: 1
        });
    } else if (state == 3) {
        layer.tips('狀態異常!', '#' + id, {
            tips: 1
        });
    }else if (state == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>應用名稱/token/標題/內容/備註");
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

var email="";
var grid = $("#listMySmtp").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listMySmtp",
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
        field: 'host',
        title: '請求地址',
        align: 'center',
        width: 120,
        formatter: function (value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'account',
        title: '用戶名',
        align: 'center',
        width: 120,
        formatter: function (value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'password',
        title: '密碼',
        align: 'center',
        width: 120,
        formatter: function (value, row, index) {
            if (row.type === 1) {
                return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>點擊查看</button>"
            } else {
                return "<button data-clipboard-text='" + value + "' class='btn btn-danger btn-rounded btn-xs'>點擊複製</button>"
            }
            // return "<button class='btn btn-danger btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    }, {
        field: 'priority',
        title: '優先級',
        align: 'center',
        width: 80
    }, {
        field: 'remark',
        title: '備註',
        align: 'center',
        width: 50,
        formatter: function (value, row, index) {
            if (value === '' || value === undefined || value === null) {
                return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>查看</button>"
            } else {
                return "<button onClick=\"layer.alert('" + value + "');\" class='btn layui-btn-primary btn-rounded btn-xs'>查看</button>"
            }
        }
    }, {
        field: 'type',
        title: '類型',
        align: 'center',
        width: 50,
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<button id='type_" + row.id + "' onClick='javascript:typeTip(1,\"type_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>官方</a>";
            } else if (value == 2) {
                return "<button id='type_" + row.id + "' onClick='javascript:typeTip(2,\"type_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>個人</a>";
            } else {
                return "<button id='type_" + row.id + "' onClick='javascript:typeTip(-1,\"type_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
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
                var result = "<button id='checkSmtpById_" + row.id + "' name='checkSmtpById_" + row.id + "' class='layui-btn layui-btn-xs layui-btn-normal' onClick='javascript:checkSmtpById(" + row.id + ")'>通信測試</button>";
                if (row.state === 1) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState(" + row.id + "," + row.type + ",2)'>停止</button>";
                } else if (row.state === 2) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState(" + row.id + "," + row.type + ",1)'>啟用</button>";
                } else {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:changeState(" + row.id + "," + row.type + ",1)'>解除</button>";
                }
                if (row.type === 1) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-disabled' >編輯</button>";
                    result += "<button class='layui-btn layui-btn-xs layui-btn-disabled' >刪除</button>";
                } else if (row.type === 2) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-warm' onClick='javascript:editSmtp(" + row.id + ")'>編輯</button>";
                    result += "<button class='layui-btn  layui-btn-xs layui-btn-danger'  onClick='javascript:deleteSmtp(" + row.id + ")'>刪除</button>";
                }
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

function editSmtp(id) {
    layer.open({
        type: 2,
        anim: 2,
        title: "編輯",
        content: '/service/mail/editSmtp?id=' + id,
        btn: ['更新', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '450px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#editSmtp', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const host = body.find("input[name='host']").val();
            const account = body.find("input[name='account']").val();
            const password = body.find("input[name='password']").val();
            const priority = body.find("input[name='priority']").val();
            const remark = body.find("textarea[name='remark']").val();
            console.log(softwareId);
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                showTip("請先選擇應用");
                return false;
            }
            if (host === '' || host === null) {
                showTip("host地址不能為空");
                return false;
            }
            if (host.length > 255) {
                showTip("host地址長度不能大於255");
                return false;
            }
            if (account === '' || account === null) {
                showTip("用戶名不能為空");
                return false;
            }
            if (account.length > 255) {
                showTip("用戶名長度不能大於255");
                return false;
            }
            if (password === '' || password === null) {
                showTip("密碼不能為空");
                return false;
            }
            if (password.length > 255) {
                showTip("密碼長度不能大於255");
                return false;
            }
            if (!checkInt(priority)) {
                showTip("優先級必須為1~10000的整數");
                return false;
            }
            if (priority > 10000 || priority < 1) {
                showTip("優先級必須為1~10000的整數");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/updateSmtp?id=" + id,
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&host=" + host + "&account=" + account + "&password=" + password + "&priority=" + priority + "&remark=" + remark,
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

function addSmtp() {
    layer.open({
        type: 2,
        anim: 2,
        title: "添加配置",
        content: '/service/mail/addSmtp',
        btn: ['確定', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '450px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#addSmtp', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const host = body.find("input[name='host']").val();
            const account = body.find("input[name='account']").val();
            const password = body.find("input[name='password']").val();
            const priority = body.find("input[name='priority']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (softwareId === undefined || softwareId === null || softwareId === 0) {
                console.log(softwareId);
                showTip("請先選擇應用");
                return false;
            }
            if (host === '' || host === null) {
                showTip("host地址不能為空");
                return false;
            }
            if (host.length > 255) {
                showTip("host地址長度不能大於255");
                return false;
            }
            if (account === '' || account === null) {
                showTip("用戶名不能為空");
                return false;
            }
            if (account.length > 255) {
                showTip("用戶名長度不能大於255");
                return false;
            }
            if (password === '' || password === null) {
                showTip("密碼不能為空");
                return false;
            }
            if (password.length > 255) {
                showTip("密碼長度不能大於255");
                return false;
            }
            if (!checkInt(priority)) {
                showTip("優先級必須為1~10000的整數");
                return false;
            }
            if (priority > 10000 || priority < 1) {
                showTip("優先級必須為1~10000的整數");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/addSmtp",
                type: "post",
                dataType: "json",
                data: "softwareId=" + softwareId + "&host=" + host + "&account=" + account + "&password=" + password + "&priority=" + priority + "&remark=" + remark,
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

function changeState(id, type, state) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        if (type === 1 && state === 2) {
            showConfirm("溫馨提示", "停用後可能會造成mail接口異常,確定要停用嗎？", function (index) {
                $.ajax({
                    url: "//courier-api.iskwen.com/api/changeSmtpState",
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
            });
        } else {
            $.ajax({
                url: "//courier-api.iskwen.com/api/changeSmtpState",
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
}

function deleteSmtp(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteSmtp",
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

function typeTip(type, id) {
    if (type == 1) {
        layer.tips('官方原生配置,不允許編輯與刪除~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('私人Stmp,後台數據已加密~', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

function stateTip(state, id) {
    if (state == 1) {
        layer.tips('正在積極的等待任務上門~', '#' + id, {
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
    showSimpleTip("目前搜索對象支持:<br>應用名稱/host/account/備註");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function (e) {
    showMsg("複製成功");
    console.log(e);
});
clipboard.on('error', function (e) {
    showTip("複製失敗");
    console.log(e);
});

function checkInt(int) {
    if (!(/(^[1-9]\d*$)/.test(int))) {
        return false;
    }
    return true;
}

function seePassword(id, buttonId) {
    $("#" + buttonId).attr('disabled', true);
    $.ajax({
        url: "//courier-api.iskwen.com/api/getSmtpInfo",
        type: "POST",
        dataType: "json",
        data: "id=" + id,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                $("#" + buttonId).attr('disabled', false);
                $("#" + buttonId).text(msg.password);
                $("#" + buttonId).removeAttr("onClick");
                $("#" + buttonId).attr("data-clipboard-text", msg.password);
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}

function checkSmtpById(id) {
    layer.prompt({title: '請輸入您的email',value: email,}, function (val, index2) {
        if (val===undefined || val===null || val===""){
            showTip("email不能為空");
            return false;
        }
        if (!checkEmail(val)){
            showTip("email格式有誤");
            return false;
        }
        showSimpleTip("正在進行通訊測試...");
        let startTime = Date.now();
        $("#checkSmtpById_" + id).attr('disabled', true);
        $("#checkSmtpById_" + id).attr("class", "layui-btn layui-btn-xs layui-btn-disabled");
        layer.close(index2);
        $.ajax({
            url: "//courier-api.iskwen.com/api/checkSmtpById",
            type: "POST",
            dataType: "json",
            data: "id=" + id+"&email="+val,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                $("#checkSmtpById_" + id).attr('disabled', false);
                $("#checkSmtpById_" + id).attr("class", "layui-btn layui-btn-xs layui-btn-normal");
                if (msg.status == 0) {
                    showMsg("通訊成功,耗時:" + (Date.now() - startTime) + "ms");
                } else {
                    if (msg.message !== null && msg.message !== undefined) {
                        layer.open({
                            title: '失敗返回',
                            icon: 2
                            , content: msg.message
                        });
                    } else {
                        layer.open({
                            title: '失敗返回',
                            icon: 7
                            , content: msg.tip
                        });
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系统在开小差，请稍后再试");
            }
        });
    });
}

function softwareTip(id, tip) {
    layer.tips(tip, '#' + id, {
        tips: 1
    });
}
$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com/api/getModifyInfo",
        type:"POST",
        dataType: "json",
        data:"id="+getUrlValue("id"),
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                email=msg.mail;
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
function checkEmail(str){
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
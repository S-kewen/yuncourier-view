var shortHost = "https://x.ly2.run/";
var grid = $("#listMyFile").bootstrapTable({
    url: "//courier-api.iskwen.com/api/listMyFile",
    height: document.body.clientHeight * 0.8,
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
        sortable: true,
        width: 50
    }, {
        field: 'cos_name',
        title: 'Cos名稱',
        align: 'center',
        width: 100,
        formatter : function(value, row, index) {
            if(value.length>15){
                return value.substring(0,15)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    }, {
        field: 'file_name',
        title: '文件名',
        align: 'center',
        width: 150,
        formatter : function(value, row, index) {
            if(value.length>20){
                return value.substring(0,20)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    }, {
            field: 'short_url',
            title: '短連',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value == '' || value == undefined || value == '-') {
                    return "<button class='btn btn-info btn-rounded btn-xs btn-danger' id='" + row.id + "'onClick='javascript:createShortUrl(" + row.id + ")'>生成</a>";
                } else {
                    return "<button class='btn layui-btn-primary btn-rounded btn-xs' data-clipboard-text='" +shortHost+ value + "'>複製</a>";
                }
            }
        }, {
            field: 'qrcode',
            title: '二維碼',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                return "<div class='qrcode-list' id='qrcode_" + row.id + "' onclick='showimg(this)'></div>"
            }
        }, {
            field: 'file_type',
            title: '類型',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                var tip = "";
                var fileTypeClass="";
                if (value == 0) {
                    tip = "未知";
                    fileTypeClass="btn btn-default btn-rounded btn-xs";
                } else if (value === 1) {
                    tip = "文檔";
                    fileTypeClass="btn btn-primary btn-rounded btn-xs";
                } else if (value === 2) {
                    tip = "圖片";
                    fileTypeClass="btn btn-info btn-rounded btn-xs";
                } else if (value === 3) {
                    tip = "視頻";
                    fileTypeClass="btn btn-info btn-rounded btn-xs";
                } else if (value === 4) {
                    tip = "壓縮包";
                    fileTypeClass="btn btn-warning btn-rounded btn-xs";
                } else if (value === 5) {
                    tip = "執行文件";
                    fileTypeClass="btn btn-danger btn-rounded btn-xs";
                } else if (value === 6) {
                    tip = "網頁文件";
                    fileTypeClass="btn btn-danger btn-rounded btn-xs";
                } else if (value === 7) {
                    tip = "其他";
                    fileTypeClass="btn layui-btn-primary btn-rounded btn-xs";
                } else {
                    fileTypeClass="btn btn-default btn-rounded btn-xs";
                    tip = "異常";
                }
                var sizeTip;
                if (row.size < 1024) {
                    sizeTip = row.size.toFixed(2) + "B";
                } else if (row.size > 1024 && row.size < 1024 * 1024) {
                    sizeTip = (row.size / 1024).toFixed(2) + "KB";
                } else if (row.size > 1024 * 1024 && row.size < 1024 * 1024 * 1024) {
                    sizeTip = (row.size / 1024 / 1024).toFixed(2) + "MB";
                } else if (row.size > 1024 * 1024 * 1024) {
                    sizeTip = (row.size / 1024 / 1024 / 1024).toFixed(2) + "Gb";
                } else {
                    sizeTip = row.size.toFixed(2) + "B";
                }
                return "<button id ='fileType_" + row.id + "' class='"+fileTypeClass+"' onClick='javascript:showSimpleTip(\"size:" + sizeTip + "   \")'>" + tip + "</button>"
                // return "<button id ='fileType_" + row.id + "' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:showSimpleTip(\"size:" + sizeTip + "<br>md5:" + row.md5 + "   \")'>" + tip + "</button>"
            }
        }, {
            field: 'open_type',
            title: '开放',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button class='btn btn-danger btn-rounded btn-xs' onClick='javascript:changeOpenType(" + row.id + ",2)'>公開</a>";
                } else if (value === 2) {
                    return "<button class='btn btn-primary btn-rounded btn-xs' onClick='javascript:changeOpenType(" + row.id + ",1)'>私有</a>";
                } else {
                    return "<button class='btn btn-info btn-rounded btn-xs' onClick='javascript:changeOpenType(" + row.id + ",1)'>未知</a>";
                }
            }
        }, {
            field: 'deposit_type',
            title: '期限',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value === 1) {
                    return "<button  class='btn btn-primary btn-rounded btn-xs' onClick='javascript:changeDepositType(" + row.id + ",2)'>永久</button>";
                }else if(value === 2){
                    var nowTime=formatter(new Date(),"yyyy-MM-dd hh:mm:ss");
                    var expireTime= formatter(new Date(row.expire_time.time),"yyyy-MM-dd hh:mm:ss");
                    if(new Date().getTime()>new Date(row.expire_time).getTime()){
                        return "<button  class='btn btn-danger btn-rounded btn-xs' onClick='javascript:changeDepositType(" + row.id + ",1)'>過期</button>";
                    }else{
                        return "<button  class='btn btn-warning btn-rounded btn-xs' onClick='javascript:changeDepositType(" + row.id + ",1)'>臨時</button>";
                    }
                }else {
                    return "<button  class='tn btn-default btn-rounded btn-xs' onClick='javascript:changeDepositType(" + row.id + ",1)'>異常</button>";
                }
            }
        }, {
            field: 'expire_time',
            title: '到期時間',
            align: 'center',
            width: 80,
            formatter: function (value, row, index) {
                if(row.deposit_type === 1){
                    return "<button id='expire_time_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:customizeTip(\"expire_time_" + row.id + "\",\"永久有效~\")'>查看</button>";
                }else if(row.deposit_type === 2){
                    var date = new Date(value);
                    return "<button id='expire_time_"+row.id+"' class='btn btn-danger btn-rounded btn-xs' onClick='javascript:customizeTip(\"expire_time_" + row.id + "\",\""+ formatter(date, "yyyy-MM-dd hh:mm:ss")+"\")'>查看</button>";
                }else{
                    return "<button id='expire_time_"+row.id+"' class='btn btn-default btn-rounded btn-xs' onClick='javascript:customizeTip(\"expire_time_" + row.id + "\",\"系統一臉懵逼的搖了搖頭~\")'>異常</button>";
                }
            }
        }, {
            field: 'remark',
            title: '備註',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value === '' || value === undefined || value === null) {
                    return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>查看</button>"
                } else {
                    return "<button onClick=\"layer.alert('" + value + "');\" class='btn btn-warning btn-rounded btn-xs'>查看</button>"
                }
            }
        }, {
            field: 'state',
            title: '狀態',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button class='btn btn-primary btn-rounded btn-xs' onClick='javascript:changeState(" + row.id + ",2)'>啟用</button>";
                } else if (value === 2) {
                    return "<button class='btn btn-warning btn-rounded btn-xs' onClick='javascript:changeState(" + row.id + ",1)'>停用</button>";
                } else if (value === 3) {
                    return "<button class='btn btn-danger btn-rounded btn-xs' onClick='javascript:changeState(" + row.id + ",1)'>异常</button>";
                } else {
                    return "<button class='btn btn-default btn-rounded btn-xs' onClick='javascript:changeState(" + row.id + ",1)'>未知</button>";
                }
            }
        }, {
        field: 'password',
        title: '密匙',
        align: 'center',
        width: 50
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
                var result="";
                if(row.open_type===1){
                    result +="<button class='layui-btn layui-btn-xs layui-btn-primary' data-clipboard-text=\""+row.download_url+"?id="+row.id+"&sign="+row.sign+"\">分享</button>"
                }else{
                    result +="<button class='layui-btn layui-btn-xs layui-btn-primary' data-clipboard-text=\""+row.download_url+"?id="+row.id+"&sign="+row.sign+"&password="+row.password+ "\">分享</button>"
                }
                result += "<button class='layui-btn layui-btn-xs layui-btn-normal' onClick='javascript:seeFile(\"" +row.bucket + "\",\""+row.region+"\",\""+row.secret_id+"\",\""+row.secret_key+"\",\""+row.key+"\")'>預覽</button>";
                result += "<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:editFile(" + row.id + ")'>編輯</button>"
                return result + "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteFile(" + row.id +",\""+row.bucket+"\",\""+row.region+"\",\""+row.secret_id+"\",\""+row.secret_key+"\",\""+row.key+ "\")'>刪除</button>";
            }
        }], onLoadSuccess: function (msg) {
        var allTableData = $('#listMyFile').bootstrapTable('getData');
        $.each(allTableData, function (i, e) {
            if(e.open_type===1){
                getQrcode("qrcode_" + e.id, e.download_url+"?id="+e.id+"&sign="+e.sign, 50, 50);
            }else{
                getQrcode("qrcode_" + e.id, e.download_url+"?id="+e.id+"&sign="+e.sign+"&password="+e.password, 50, 50);
            }

        })
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
    var fileType = $("#fileType").val();
    if (fileType != '') {
        params.fileType = fileType;
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
    $("#fileType").val(0);
    grid.bootstrapTable('resetFormSearch');
}

function changeOpenType(id, openType) {
    showConfirm("溫馨提示", "您確定要修改該文件開放狀態嗎?", function (index) {
        if (id == '') {
            showTip("請選擇一條記錄");
        } else {
            $.ajax({
                url: "//courier-api.iskwen.com/api/changeFileState",
                type: "post",
                dataType: "json",
                data: "id=" + id + "&state=0&depositType=0&openType=" + openType,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        if (openType === 1) {
                            showMsg("已公開");
                        } else if (openType === 2) {
                            showMsg("已私有");
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
    });
}

function changeState(id, state) {
    showConfirm("溫馨提示", "您確定要修改該文件狀態嗎?", function (index) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        $.ajax({
            url: "//courier-api.iskwen.com/api/changeFileState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&depositType=0&openType=0&state=" + state,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    if (state === 1) {
                        showMsg("已啟用");
                    } else if (state === 2) {
                        showMsg("已停用");
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
    });
}

function changeDepositType(id, depositType) {
    showConfirm("溫馨提示", "您確定要修改該文件期限類型嗎?", function (index) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        $.ajax({
            url: "//courier-api.iskwen.com/api/changeFileState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&openType=0&state=0&depositType=" + depositType,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    if (depositType === 1) {
                        showMsg("已永久");
                    } else if (depositType === 2) {
                        showMsg("已臨時");
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
    });
}

$("#content").focus(function () {
    showSimpleTip("目前搜索對象支持:<br>Cos名稱/文件名/密匙/MD5/儲存桶/目錄/key/地區/備註/連接");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function (e) {
    showMsg("複製成功");
});
clipboard.on('error', function (e) {
    showTip("複製失敗");
});
var clipboard2 = new ClipboardJS('.layui-btn');
clipboard2.on('success', function (e) {
    showMsg("複製成功");
});
clipboard2.on('error', function (e) {
    showTip("複製失敗");
});
function encrypt(str) { //key,iv：16位的字符串
    var wordArray = CryptoJS.enc.Utf8.parse(str);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}

function getQrcode(id, url, width, height) {
    var qrcode = new QRCode(document.getElementById(id), {
        width: width,
        height: height,
        useSVG: true
    });
    qrcode.makeCode(url);
}

function showimg(t) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['300px', '300px'],
        shade: 1,
        offset: 'auto',
        // skin: 'layui-layer-nobg',
        shadeClose: true,
        content: '<div id="showimg_' + t.id + '"></div>',
        success: function (layero, index) {
            getQrcode("showimg_" + t.id, t.title, 300, 300);
        }
    });
}

function createShortUrl(id) {
    if (id == '') {
        showTip("编号不能缺省");
    } else {
        $("#" + id).attr('disabled', true);
        $("#" + id).text('生成中');
        $.ajax({
            url: "//courier-api.iskwen.com/api/createShortUrlByFile",
            type: "post",
            dataType: "json",
            data: "id=" + id,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("生成成功");
                    reload();
                } else {
                    showErrorMsg(msg.tip);
                    $("#" + id).attr('disabled', false);
                    $("#" + id).text('重試');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showErrorMsg("系统在开小差，请稍后再试");
            }
        });
    }

}

function topTips(index, msg) {
    layer.msg(msg, {
        offset: 't',
        anim: 1
    });
}

function uploadFile() {
    layer.open({
        type: 2,
        anim: 2,
        title: "請選擇需要上傳的Cos",
        content: '/service/file/selectCos',
        btn: ['確定', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['500px', '150px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#selectCos', index);
            var cosId = body.find("select[name='cosId']").val();
            if (cosId === undefined || cosId === null || cosId === 0) {
                showTip("請先選擇對應的Cos配置");
                return false;
            }
            var cosName = body.find("select[name='cosId']").text();
            layer.close(index);
            layer.open({
                type: 2,
                title: cosName,
                anim: 2,
                maxmin: true,
                shade: 0,
                resize: false,//不允許拉伸
                content: '/service/file/queueUpload?id=' + cosId,
                btnAlign: 'c',
                scrollbar: false,
                area: ['1000px', '600px'],
                cancel: function () {
                    reload();
                }
            });
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
}

function seeFile(bucket,region,secretId,secretKey,Key) {
    showMsg("正在生成臨時連接...");
    getCosUrl(bucket,region,secretId,secretKey,Key);
}

function editFile(id) {
    layer.open({
        type: 2,
        anim: 2,
        title: "編輯",
        content: '/service/file/editFile?id=' + id,
        btn: ['更新', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['700px', '450px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#editFile', index);
            const fileName = body.find("input[name='fileName']").val();
            const password = body.find("input[name='password']").val();
            const state = body.find("select[name='state']").val();
            const openType = body.find("select[name='openType']").val();
            const depositType = body.find("select[name='depositType']").val();
            const expireTime = body.find("input[name='expireTime']").val();
            const remark = body.find("textarea[name='remark']").val();
            if (fileName === '' || fileName === null) {
                showTip("文件名不能為空");
                return false;
            }
            if (fileName.length > 255) {
                showTip("文件名長度不能大於255");
                return false;
            }
            if (password === '' || password === null) {
                showTip("訪問密碼不能為空");
                return false;
            }
            if (password.length > 6) {
                showTip("訪問密碼長度不能大於6");
                return false;
            }
            if (state === undefined || state === null || state === 0) {
                showTip("請先選擇狀態");
                return false;
            }
            if (openType === undefined || openType === null || openType === 0) {
                showTip("請先選擇開放類型");
                return false;
            }
            if (depositType === undefined || depositType === null || depositType === 0) {
                showTip("請先選擇期限類型");
                return false;
            }
            if (expireTime === null || expireTime == "") {
                showTip("到期時間不能為空");
                return false;
            }
            if (!checkTime(expireTime)) {
                showTip("到期時間格式錯誤,請遵循yyyy-MM-dd hh:mm:ss格式");
                return false;
            }
            if (remark.length > 255) {
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url: "//courier-api.iskwen.com/api/updateFile?id=" + id,
                type: "post",
                dataType: "json",
                data: "fileName=" + fileName +"&password=" + password + "&state=" + state + "&openType=" + openType + "&depositType=" + depositType + "&expireTime=" + expireTime + "&remark=" + remark,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("更新成功")
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

function deleteFile(id,bucket,region,secretId,secretKey,Key) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該文件嗎？", function (index) {
            layer.confirm('是否保留儲存桶文件?', {
                btn: ['保留','不保留'],
                title: bucket,
                icon: 7
            }, function(index2){
                //保留
                $.ajax({
                    url: "//courier-api.iskwen.com/api/deleteFile",
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
                layer.close(index2);
            }, function(){
                //不保留
                deleteObject(id,bucket,region,secretId,secretKey,Key);
                layer.close(index);
            });
    });

    }
}

function checkTime(str)//判断日期时间格式是否正常
{
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}
function customizeTip(id,str) {
        layer.tips(str, '#' + id, {
            tips: 1
        });
}

function editDepositType(id) {
        layer.open({
            type : 2,
            anim: 1,
            title : "編輯",
            content : '/service/file/editDepositType?id='+id,
            btn : ['修改', '關閉' ],
            btnAlign : 'c',
            resize : false,
            scrollbar : false,
            area : [ '400px', '250px' ],
            yes : function(index, layero) {
                const body = layer.getChildFrame('#editDepositType', index);
                const depositType = body.find("input[name='depositType']").val();
                const expireTime = body.find("input[name='expireTime']").val();
                if(depositType===undefined || depositType===0 || depositType===null){
                    showTip("請先選擇類型");
                    return false;
                }
                if(expireTime===''){
                    showTip("過期時間不能為空");
                    return false;
                }
                if (!checkTime(expireTime)) {
                    showTip("到期時間格式錯誤,請遵循yyyy-MM-dd hh:mm:ss格式");
                    return false;
                }
                $.ajax({
                    url : "//courier-api.iskwen.com/api/updateDepositType?id="+id,
                    type : "post",
                    dataType:"json",
                    data:"depositType="+depositType+"&expireTime="+expireTime,
                    headers: {'Authorization': getCookie("token")},
                    success:function(msg){
                        if(msg.status==0){
                            showMsg("更新成功");
                            layer.close(index);
                            reload();
                        }else{
                            showTip(msg.tip);
                        }
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){
                        showErrorMsg("系统在开小差，请稍后再试");
                    }
                })
            },
            btn2 : function(index, layero) {
                layer.close(index);
            }
        });
}
function getCosUrl(bucket,region,secretId,secretKey,Key) {
    var getAuthorization = function (options, callback) {
        var authorization = COS.getAuthorization({
            SecretId: secretId, // 可传固定密钥或者临时密钥
            SecretKey: secretKey, // 可传固定密钥或者临时密钥
            Method: options.Method,
            Pathname: options.Pathname,
            Query: options.Query,
            Headers: options.Headers,
            Expires: 60,
        });
        callback({
            Authorization: authorization,
            // XCosSecurityToken: credentials.sessionToken, // 如果使用临时密钥，需要传 XCosSecurityToken
        });

    };
    var cos = new COS({
        getAuthorization: getAuthorization,
    });
        var url = cos.getObjectUrl({
            Bucket: bucket, // Bucket 格式：test-1250000000
            Region: region,
            Key: Key,
            Expires: 60,
            Sign: true,
        }, function (err, data) {
            if(data.Url!==null && data.Url!==undefined && data.Url!==""){
                window.open(data.Url);
            }else{
                showTip("生成sign失敗,請稍後再試");
            }
        });
}
function deleteObject(id,bucket,region,secretId,secretKey,Key) {
    var getAuthorization = function (options, callback) {
        var authorization = COS.getAuthorization({
            SecretId: secretId, // 可传固定密钥或者临时密钥
            SecretKey: secretKey, // 可传固定密钥或者临时密钥
            Method: options.Method,
            Pathname: options.Pathname,
            Query: options.Query,
            Headers: options.Headers,
            Expires: 60,
        });
        callback({
            Authorization: authorization,
            // XCosSecurityToken: credentials.sessionToken, // 如果使用临时密钥，需要传 XCosSecurityToken
        });

    };
    var cos = new COS({
        getAuthorization: getAuthorization,
    });
    cos.deleteObject({
        Bucket: bucket, /* 必须 */
        Region: region,     /* 存储桶所在地域，必须字段 */
        Key: Key        /* 必须 */
    }, function (err, data) {
        if(data.statusCode===204){
            $.ajax({
                url: "//courier-api.iskwen.com/api/deleteFile",
                type: "post",
                dataType: "json",
                data: "id=" + id,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("刪除成功")
                        reload();
                    } else {
                        showTip(msg.tip);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showTip("系统在开小差，请稍后再试");
                }
            })
        }else{
            console.log(err);
            console.log(data);
            showTip("刪除儲存桶文件失敗,請檢查Cos配置!");
        }
    });
}
function clearFile() {
    layer.open({
        type: 2,
        anim: 2,
        title: "請選擇需要清空的Cos",
        content: '/service/file/selectCos',
        btn: ['確定', '關閉'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['500px', '150px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#selectCos', index);
            var cosId = body.find("select[name='cosId']").val();
            if (cosId === undefined || cosId === null || cosId === 0) {
                showTip("請先選擇對應的Cos配置");
                return false;
            }
            var cosName = body.find("select[name='cosId']").text();
            // showConfirm("溫馨提示", "您確定要清空該配置下的所有文件記錄嗎(文件仍會保留)？", function (index2) {
                layer.prompt({
                    formType: 1,
                    title: '請輸入用戶登錄密碼',
                },function(value, index3, elem){
                    $.ajax({
                        url: "//courier-api.iskwen.com/api/clearFile",
                        type: "post",
                        dataType: "json",
                        data: "cosId=" + cosId+"&password="+hex_md5(value),
                        headers: {'Authorization': getCookie("token")},
                        success: function (msg) {
                            if (msg.status == 0) {
                                layer.confirm('成功清空'+msg.count+'條數據,是否前往騰訊雲清空文件?', {
                                    icon: 1,
                                    btn: ['前往','取消']
                                }, function(index4){
                                    layer.close(index4);
                                    layer.close(index3);
                                    // layer.close(index2);
                                    layer.close(index);
                                    window.open("https://console.cloud.tencent.com/cos5");
                                    reload();
                                }, function(){
                                    layer.close(index3);
                                    // layer.close(index2);
                                    layer.close(index);
                                    reload();
                                });
                            } else {
                                showTip(msg.tip);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            showTip("系统在开小差，请稍后再试");
                        }
                    })
                });
           // });
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
}
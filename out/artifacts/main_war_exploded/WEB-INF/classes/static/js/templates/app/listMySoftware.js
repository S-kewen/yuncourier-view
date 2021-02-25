var grid = $("#listMySoftware").bootstrapTable({
    url:"//courier-api.iskwen.com:8888/api/listMySoftware" ,
    height : document.body.clientHeight * 0.8,
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
        field: 'software_id',
        title: '編號',
        align : 'center',
        sortable:true,
        width:50
    },{
        field: 'software_name',
        title: '應用名稱',
        align : 'center',
        width:150
    },{
        field: 'token',
        title: 'Token',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
        return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
            field: 'state',
            title: '狀態',
            align : 'center',
            width:70,
            formatter : function(value, row, index) {
                if(value === 1){
                    return "<button id='state_"+row.software_id+"' onClick='javascript:stateTip(1,\"state_"+row.software_id+"\")' class='btn btn-primary btn-rounded btn-xs'>啟用</a>";
                }else if (value === 2){
                    return "<button id='state_"+row.software_id+"' onClick='javascript:stateTip(2,\"state_"+row.software_id+"\")' class='btn btn-warning btn-rounded btn-xs'>停用</a>";
                }else if (value === 3){
                    return "<button id='state_"+row.software_id+"' onClick='javascript:stateTip(3,\"state_"+row.software_id+"\")' class='btn btn-danger btn-rounded btn-xs'>異常</a>";
                }else{
                    return "<button id='state_"+row.software_id+"' onClick='javascript:stateTip(-1,\"state_"+row.software_id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        },{
        field: 'remark',
        title: '備註',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            if (value==='' || value===undefined){
                return "-";
            }else{
                if(value.length>20){
                    return value.substring(0,20)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
                }else{
                    return value;
                }
            }

        }
    },{
            field: 'add_time',
            title: '生成時間',
            align : 'center',
            width:150,
            formatter : function(value,row,index){
                if (value===''||value ===undefined){
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
                if (row.state===1){
                    result=result+"<button class='layui-btn  layui-btn-xs layui-btn-primary' onClick='javascript:changeSoftwareState("+row.software_id+",2)'>停用</button>";
                }else if (row.state===2){
                    result=result+"<button class='layui-btn  layui-btn-xs layui-btn' onClick='javascript:changeSoftwareState("+row.software_id+",1)'>啟用</button>";
                }else if (row.state===3){
                    result=result+"<button class='layui-btn  layui-btn-xs layui-btn' onClick='javascript:changeSoftwareState("+row.software_id+",1)'>解禁</button>";
                }
                result=result+"<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:seeSoftware("+row.software_id+")'>查看</button>";
                result=result+"<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:editSoftware("+row.software_id+")'>編輯</button>";
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteSoftware("+row.software_id+")'>刪除</button>";
            }
        }],
    queryParams: queryParams
});

function reload(){
    grid.bootstrapTable('refresh');
}

function queryParams(params){
    var content = $("#content").val();
    if(content!==''){
        params.content = content;
    }
    const startTime = $("#startTime").val();
    if(startTime!==''){
        params.startTime = startTime;
    }
    var endTime = $("#endTime").val();
    if(endTime!==''){
        params.endTime = endTime;
    }
    var state = $("#state").val();
    if(state!==''){
        params.state = state;
    }
    if (endTime!=='' && startTime!==''){
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
function changeSoftwareState(id,newState) {
    if(id===''){
        showTip("請選擇一條記錄");
    }else{
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/changeSoftwareState",
                type : "post",
                dataType:"json",
                data:"id="+id+"&state="+newState,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status===0){
                        if (newState===1){
                            showMsg("開啟成功");
                        }else{
                            showMsg("關閉成功");
                        }
                        reload();
                    }else {
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })

    }
}
function deleteSoftware(id){
    if(id===''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該應用嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/deleteSoftware",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status===0){
                        showMsg("刪除成功")
                        reload();
                    }else {
                        showTip(msg.tip);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    showErrorMsg("系统在开小差，请稍后再试");
                }
            })
        });

    }
}
function stateTip (state,id){
        if (state===1){
            layer.tips('沒日沒夜的工作ing~', '#'+id, {
                tips: 1
            });
        }else if(state==2){
            layer.tips('休息中~', '#'+id, {
                tips: 1
            });
        }else if(state==3){
            layer.tips('趕緊找客服問問吧~', '#'+id, {
                tips: 1
            });
        }else if(state==-1){
            layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
                tips: 1
            });
        }
}
function editSoftware(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "編輯",
        content : '/app/editSoftware?id='+id,
        btn : ['更新', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '400px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#editSoftware', index);
            const softwareName = body.find("input[name='softwareName']").val();
            const token = body.find("input[name='token']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareName===""){
                showTip("應用名稱長度不能為空");
                return false;
            }
            if(softwareName.length>16){
                showTip("應用名稱長度不能大於16");
                return false;
            }
            if(token.length!==32){
                showTip("token長度必須為32位");
                return false;
            }
            if(!checkStrByLettersOrNumber(token)){
                showTip("token長度必須為數字和字母組成");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                    url : "//courier-api.iskwen.com:8888/api/updateSoftware?id="+id,
                    type : "post",
                    dataType:"json",
                    data:"softwareName="+softwareName+"&token="+token+"&remark="+remark,
                    headers: {'Authorization': getCookie("token")},
                    success:function(msg){
                        if(msg.status==0){
                            showMsg("修改成功")
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
function addSoftware(){
    layer.open({
        type : 2,
        anim: 1,
        title : "添加應用",
        content : '/app/addSoftware',
        btn : ['添加', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '350px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#addSoftware', index);
            const softwareName = body.find("input[name='softwareName']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareName===''){
                showTip("應用名稱不能為空");
                return false;
            }
            if(softwareName.length>16){
                showTip("應用名稱長度不能大於16");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於16");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/addSoftware",
                type : "post",
                dataType:"json",
                data:body.serialize(),
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("添加成功")
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
function seeSoftware(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "查看",
        content : '/app/seeSoftware?id='+id,
        resize : false,
        scrollbar : false,
        area : [ '700px', '300px' ]
    });
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
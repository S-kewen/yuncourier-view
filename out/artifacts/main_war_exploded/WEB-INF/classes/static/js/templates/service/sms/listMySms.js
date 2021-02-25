var grid = $("#listMySms").bootstrapTable({
    url:"//courier-api.iskwen.com:8888/api/listMySms" ,
    height:document.body.clientHeight*0.8,
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
        field: 'sms_id',
        title: '編號',
        align : 'center',
        sortable:true,
        width:50
    },{
        field: 'software_name',
        title: '應用名稱',
        align : 'center',
        width:100
    },{
        field: 'ip',
        title: 'IP地址',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'receive_phone',
        title: '手機號碼',
        align : 'center',
        width:150
    },{
        field: 'subject',
        title: '主題',
        align : 'left',
        width:150,
        formatter : function(value, row, index) {
            if(value.length>15){
                return value.substring(0,15)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    },{
        field: 'msg',
        title: '內容',
        align : 'left',
        width:250,
        formatter : function(value, row, index) {
            if(value.length>25){
                return value.substring(0,25)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    },{
        field: 'type',
        title: '類型',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value === 1){
                return "<button id='type_"+row.sms_id+"' onClick='typeTip(1,\"type_"+row.sms_id+"\")' class='btn btn-primary btn-rounded btn-xs'>台灣</a>";
            }else if(value === 2){
                return "<button id='type_"+row.sms_id+"' onClick='typeTip(2,\"type_"+row.sms_id+"\")' class='layui-btn  layui-btn-xs layui-btn-warm'>中國</a>";
            }else if(value === 3){
                return "<button id='type_"+row.sms_id+"' onClick='typeTip(3,\"type_"+row.sms_id+"\")' class='btn btn-danger btn-rounded btn-xs'>其他</a>";
            }else{
                return "<button id='type_"+row.sms_id+"' onClick='typeTip(-1,\"type_"+row.sms_id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'state',
        title: '狀態',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value == 1){
                return "<button id='state_"+row.sms_id+"' onClick='javascript:stateTip(1,\"state_"+row.sms_id+"\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
            }else if(value == 2){
                return "<button id='state_"+row.sms_id+"' onClick='javascript:stateTip(2,\"state_"+row.sms_id+"\")' class='layui-btn  layui-btn-xs layui-btn-warm'>失敗</a>";
            }else if(value == 3){
                return "<button id='state_"+row.sms_id+"' onClick='javascript:stateTip(3,\"state_"+row.sms_id+"\")' class='btn btn-danger btn-rounded btn-xs'>補發</a>";
            }else{
                return "<button id='state_"+row.sms_id+"' onClick='javascript:stateTip(-1,\"state_"+row.sms_id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'add_time',
        title: '發送時間',
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
                var result="<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:seeSms("+row.sms_id+")'>查看</button>";
                if (row.state==1){
                    result=result+"<button class='layui-btn layui-btn-xs layui-btn-disabled' >重發</button>";
                }else if (row.state==2){
                    result=result+"<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:retrySms("+row.sms_id+")'>重發</button>";
                }
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteSms("+row.sms_id+")'>刪除</button>";
            }
        }],
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
    var type = $("#type").val();
    if(state!=''){
        params.type = type;
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
    $("#type").val(0);
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteSms(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/deleteSms",
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
function retrySms(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要補發該短信嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/retrySms",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("補發成功")
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
function typeTip (type,id){
    if (type==1){
        layer.tips('適用於台灣(5元一條)~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('適用於中國大陸(6元一條)~', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('適用於其他地區(10元一條)~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function stateTip (state,id){
    if (state==1){
        layer.tips('發送成功~', '#'+id, {
            tips: 1
        });
    }else if (state==2){
        layer.tips('發送失敗,可以點擊重發試試哦~', '#'+id, {
            tips: 1
        });
    }else if (state==3){
        layer.tips('補發成功,不收取費用哦~!', '#'+id, {
            tips: 1
        });
    }else if (state==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function seeSms(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "查看",
        content : '/service/sms/seeSms?id='+id,
        resize : false,
        scrollbar : false,
        area : [ '700px', '530px' ]
    });
}
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/token/IP/手機號/主題/內容/備註");
})
var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function(e) {
    showMsg("複製成功");
    console.log(e);
});
clipboard.on('error', function(e) {
    showTip("複製失敗");
    console.log(e);
});
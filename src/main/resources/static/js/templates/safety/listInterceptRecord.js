var grid = $("#listInterceptRecord").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listInterceptRecord" ,
    height:document.body.clientHeight*0.821,
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
        width:50
    },{
        field: 'software_name',
        title: '應用名稱',
        align : 'center',
        width:100
    },{
        field: 'real_ip',
        title: '攔截IP',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'firewall_ip',
        title: '預設IP',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-danger btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'object',
        title: '對象',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value===1){
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(1,\"object_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>全部</a>";
            }else if(value===2){
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(2,\"object_"+row.id+"\")' class='btn btn-primary btn-rounded btn-xs'>mail</a>";
            }else if(value===3){
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(3,\"object_"+row.id+"\")' class='btn btn-warning btn-rounded btn-xs'>sms</a>";
            }else if(value===4){
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(4,\"object_"+row.id+"\")' class='btn btn-info btn-rounded btn-xs'>link</a>";
            }else if(value===5){
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(5,\"object_"+row.id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>解析</a>";
            }else{
                return "<button id='object_"+row.id+"' onClick='javascript:objectTip(-1,\"object_"+row.id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
        }
    },{
        field: 'system',
        title: '系統',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            if(value!==null && value!=="" && value!==undefined && value!=="unknown"){
                return "<button class='btn btn-danger btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
            }else{
                return "<button class='btn btn-default btn-rounded btn-xs' data-clipboard-text='"+value+"'>unknown</a>";
            }

        }
    },{
        field: 'browser',
        title: '瀏覽器',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            if(value!==null && value!=="" && value!==undefined && value!=="unknown"){
                return "<button class='btn btn-danger btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
            }else{
                return "<button class='btn btn-default btn-rounded btn-xs' data-clipboard-text='"+value+"'>unknown</a>";
            }

        }
    },{
        field: 'add_time',
        title: '添加時間',
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
               var result = "";
               if(row.whiteState!=1){
                   result+= "<button class='layui-btn layui-btn-xs layui-btn-normal' onClick='javascript:addWhite("+row.id+")'>加入白名單</button>";
               }else{
                   result+= "<button class='layui-btn layui-btn-xs layui-btn-disabled'>加入白名單</button>";
               }
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteInterceptRecord("+row.id+")'>刪除</button>";
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
    var content_type = $("#content_type").val();
    if(content_type!=''){
        params.content_type = content_type;
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
    $("#content_type").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteInterceptRecord(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteInterceptRecord",
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
function objectTip (type,id){
    if (type==1){
        layer.tips('包含所有對象哦~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('調用mail接口被攔截~', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('調用sms接口被攔截~!', '#'+id, {
            tips: 1
        });
    }else if (type==4){
        layer.tips('調用link接口被攔截~!', '#'+id, {
            tips: 1
        });
    }else if (type==5){
        layer.tips('訪問link生成的短連被攔截~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function softwareTip(id,tip){
    layer.tips(tip, '#'+id, {
        tips: 1
    });
}
function addWhite(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要要該IP加入白名單嗎？",function(index){
        $.ajax({
            url : "//courier-api.iskwen.com/api/addWhiteByInterceptRecord",
            type : "post",
            dataType:"json",
            data:"id="+id,
            headers: {'Authorization': getCookie("token")},
            success:function(msg){
                if(msg.status==0){
                    showMsg("添加成功");
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
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/攔截IP/預設IP/系統/瀏覽器");
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
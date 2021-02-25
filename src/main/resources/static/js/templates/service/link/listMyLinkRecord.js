var grid = $("#listMyLinkRecord").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listMyLinkRecord" ,
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
        field: 'short_url',
        title: '短連key',
        align : 'center',
        width:60,
        formatter : function(value, row, index) {
            return "<button class='btn layui-btn-primary btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'position',
        title: '請求地址',
        align : 'center',
        width:250
    },{
        field: 'latitude',
        title: '經緯度',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-warning btn-rounded btn-xs' data-clipboard-text='"+value+","+row.longitude+"'>"+value+","+row.longitude+"</a>";
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
        title: '生成時間',
        align : 'center',
        width:150,
        formatter : function(value,row,index){
            if (value==''||value ==undefined){
                return '-';
            }
            var date = new Date(value);
            return formatter(date,"yyyy-MM-dd hh:mm:ss");
        }
    },{
            field: '',
            title: '操作',
            formatter : function(value,row,index){
                var result="<button class='layui-btn layui-btn-xs layui-btn-normal' onClick='window.open(\""+row.long_url+"\")'>預覽</button>";
                // if (row.state==1){
                //      result+="<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState("+row.link_id+",2)'>停用</button>";
                // }else if (row.state==2){
                //      result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.link_id+",1)'>啟用</button>";
                // }else if (row.state==3){
                //      result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.link_id+",1)'>重新激活</button>";
                // }
                // result+= "<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:resetShortUrl("+row.link_id+")'>重置</button>"
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteLinkRecord("+row.id+")'>刪除</button>";
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
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteLinkRecord(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該解析記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteLinkRecord",
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
function stateTip (state,id){
    if (state==1){
        layer.tips('正在解析中~', '#'+id, {
            tips: 1
        });
    }else if (state==2){
        layer.tips('暫停解析~', '#'+id, {
            tips: 1
        });
    }else if (state==3){
        layer.tips('該鏈接異常,已被系統凍結~!', '#'+id, {
            tips: 1
        });
    }else if (state==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/IP/位置/請求鏈接/原始鏈接/短鏈接/系統/瀏覽器");
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

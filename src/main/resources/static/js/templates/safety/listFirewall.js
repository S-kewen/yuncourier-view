var grid = $("#listFirewall").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listFirewall" ,
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
        width:100,
        formatter : function(value, row, index) {
            if(row.software_id===-1){
                return "<button id='software_"+row.id+"' onClick='javascript:softwareTip(\"software_"+row.id+"\",\"面向所有應用\")' class='btn btn-danger btn-rounded btn-xs'>不限</a>";
            }else{
                return "<button id='software_"+row.id+"' onClick='javascript:softwareTip(\"software_"+row.id+"\",\"對應單一應用[id:"+row.software_id+"]\")' class='btn btn-danger btn-rounded btn-xs'>"+value+"</a>";
            }
        }
    },{
        field: 'ip',
        title: 'IP地址',
        align : 'center',
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'type',
        title: '類型',
        align : 'center',
        width:80,
        formatter : function(value, row, index) {
            if(value===1){
                return "<button id='type_"+row.id+"' class='btn layui-btn-primary btn-rounded btn-xs' onClick='javascript:typeTip(1,\"type_"+row.id+"\")'>白名單</button>";
            }else if(value===2){
                return "<button id='type_"+row.id+"' class='btn btn-warning btn-rounded btn-xs' onClick='javascript:typeTip(2,\"type_"+row.id+"\")'>黑名單</button>";
            }else{
                return "<button id='type_"+row.id+"' class='btn btn-default btn-rounded btn-xs' onClick='javascript:typeTip(-1,\"type_"+row.id+"\")'>未知</button>";
            }
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
        field: 'remark',
        title: '備註',
        align : 'center',
        halign: 'center',
        width:250,
        formatter : function(value, row, index) {
        if(value===null || value===""){
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
        field: 'state',
        title: '狀態',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value === 1){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(1,\"state_"+row.id+"\")' class='btn btn-primary btn-rounded btn-xs'>啟用</a>";
            }else if(value === 2){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(2,\"state_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>停止</a>";
            }else if(value === 3){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(3,\"state_"+row.id+"\")' class='btn btn-warning btn-rounded btn-xs'>凍結</a>";
            }else{
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(-1,\"state_"+row.id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
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
                var result="";
                if (row.state==1){
                    result=result+"<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState("+row.id+",2)'>停止</button>";
                }else if (row.state==2){
                    result=result+"<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.id+",1)'>啟用</button>";
                }else if (row.state==3){
                    result=result+"<button class='layui-btn layui-btn-xs layui-btn-normal' onClick='javascript:changeState("+row.id+",1)'>解禁</button>";
                }
                result+="<button class='layui-btn layui-btn-xs layui-btn-warm' onClick='javascript:editFirewall("+row.id+")'>編輯</button>";
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteFirewall("+row.id+")'>刪除</button>";
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
    $("#state").val(0);
    $("#content_type").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteFirewall(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteFirewall",
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
function editFirewall(id){
    layer.open({
        type : 2,
        anim: 2,
        title : "編輯",
        content : '/safety/editFirewall?id='+id,
        btn : ['更新', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '450px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#editFirewall', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const object = body.find("select[name='object']").val();
            const type = body.find("select[name='type']").val();
            const ip = body.find("input[name='ip']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareId===undefined || softwareId===null || softwareId===0){
                showTip("請先選擇應用");
                return false;
            }
            if(object===undefined || object===0 || object===null){
                showTip("請先選擇對象");
                return false;
            }
            if(type===undefined || type===0 || type===null){
                showTip("請先選擇類型");
                return false;
            }
            if(ip==='' || ip===null){
                showTip("IP不能為空");
                return false;
            }
            if(ip==='*'){
                showTip("请用*.*.*.*代表所有IP");
                return false;
            }
            if(!checkIP(ip)){
                showTip("IP輸入格式錯誤,'*'代表通用符");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/updateFirewall?id="+id,
                type : "post",
                dataType:"json",
                data:"softwareId="+softwareId+"&object="+object+"&type="+type+"&ip="+ip+"&remark="+remark,
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
function objectTip (type,id){
    if (type==1){
        layer.tips('包含所有對象哦~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('調用mail接口會受到影響~', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('調用sms接口會受到影響~!', '#'+id, {
            tips: 1
        });
    }else if (type==4){
        layer.tips('調用link接口會受到影響~!', '#'+id, {
            tips: 1
        });
    }else if (type==5){
        layer.tips('訪問link生成的短連會受到影響~!', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function typeTip (type,id){
    if (type==1){
        layer.tips('白名單優先級高於黑名單哦~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('白名單優先級高於黑名單哦~', '#'+id, {
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
function stateTip (state,id){
    if (state==1){
        layer.tips('正在沒日沒夜的工作ing~', '#'+id, {
            tips: 1
        });
    }else if (state==2){
        layer.tips('停止工作了!', '#'+id, {
            tips: 1
        });
    }else if (state==3){
        layer.tips('系統發現了異常,被凍結了~', '#'+id, {
            tips: 1
        });
    }else if (state==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function changeState(id,state){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        $.ajax({
            url : "//courier-api.iskwen.com/api/changeFirewallState",
            type : "post",
            dataType:"json",
            data:"id="+id+"&state="+state,
            headers: {'Authorization': getCookie("token")},
            success:function(msg){
                if(msg.status==0){
                    if(state==1){
                        showMsg("啟用成功");
                    }else if(state==2){
                        showMsg("停用成功");
                    }
                    reload();
                }else {
                    showTip(msg.tip);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                showTip("系统在开小差，请稍后再试");
            }
        })
    }
}
function addFirewall(){
    layer.open({
        type : 2,
        anim: 1,
        title : "添加防火墻",
        content : '/safety/addFirewall',
        btn : ['添加', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '450px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#addFirewall', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const object = body.find("select[name='object']").val();
            const type = body.find("select[name='type']").val();
            const ip = body.find("input[name='ip']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareId===undefined || softwareId===null || softwareId===0){
                showTip("請先選擇應用");
                return false;
            }
            if(object===undefined || object===0 || object===null){
                showTip("請先選擇對象");
                return false;
            }
            if(type===undefined || type===0 || type===null){
                showTip("請先選擇類型");
                return false;
            }
            if(ip==='' || ip===null){
                showTip("IP不能為空");
                return false;
            }
            if(ip==='*'){
                showTip("请用*.*.*.*代表所有IP");
                return false;
            }
            if(!checkIP(ip)){
                showTip("IP輸入格式錯誤,'*'代表通用符");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/addFirewall",
                type : "post",
                dataType:"json",
                data:"softwareId="+softwareId+"&object="+object+"&type="+type+"&ip="+ip+"&remark="+remark,
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
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/IP/備註");
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
function checkIP(str) {
    if(str.length<7 || str.length>15){
        return false;
    }
    arr=str.split(".");
    if(arr.length!=4){
        console.log("長度異常");
        return false;
    }
    for (i=0;i<4;i++){
        if((arr[i]!=="*" && (arr[i]<0 || arr[i]>255)) || (!checkRate(arr[i]))){
            console.log(checkRate(arr[i]));
            return false;
        }
    }
    return true;
}
function checkRate(str)
{
    if(str==="*"){
        return true;
    }
    var re = /^[0-9]+[0-9]*]*$/;
    if (!re.test(str))
    {
        return false;
    }else{
        return true;
    }
}
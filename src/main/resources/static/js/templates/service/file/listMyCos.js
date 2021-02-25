var grid = $("#listMyCos").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listMyCos" ,
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
        width:100,
        formatter : function(value, row, index) {
            if(row.software_id===-1){
                return "<button id='software_"+row.id+"' onClick='javascript:softwareTip(\"software_"+row.id+"\",\"面向所有應用\")' class='btn btn-danger btn-rounded btn-xs'>不限</a>";
            }else{
                return "<button id='software_"+row.id+"' onClick='javascript:softwareTip(\"software_"+row.id+"\",\"對應單一應用[id:"+row.software_id+"]\")' class='btn btn-danger btn-rounded btn-xs'>"+value+"</a>";
            }
        }
    },{
        field: 'cos_name',
        title: '配置名稱',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        }
    },{
        field: 'bucket_name',
        title: '儲存桶',
        align : 'center',
        width:150
        // ,
        // formatter : function(value, row, index) {
        //     return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='"+value+"'>"+value+"</a>";
        // }
    },{
        field : 'region',
        title : '地區',
        align : 'center',
        width : 100,
        formatter:function(value,row,index){
            //1成都，2南京，3北京，4广州，5上海，6重庆，7北京金融，8上海金融，9深圳金融，10香港
            // 11新加坡，12印度孟买，13韩国首尔，14,泰国曼谷，15日本东京===亞太地區
            // 16俄罗斯莫斯科，17德国法兰克福===歐洲地區
            // 18加拿大多伦多，19美东弗吉尼亚，20美西硅谷===北美地區
            if(value === 1){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>成都</a>";
            }else if(value === 2){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>南京</a>";
            }else if(value === 3){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>北京</a>";
            }else if(value === 4){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>廣州</a>";
            }else if(value === 5){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>上海</a>";
            }else if(value === 6){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>重慶</a>";
            }else if(value === 7){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>北京金融</a>";
            }else if(value === 8){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>上海金融</a>";
            }else if(value === 9){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>深圳金融</a>";
            }else if(value === 10){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>香港</a>";
            }else if(value === 11){
                return "<button id='region_"+row.id+"' class='layui-btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",2)'>新加坡</a>";
            }else if(value === 12){
                return "<button id='region_"+row.id+"' class='layui-btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",2)'>印度-孟買</a>";
            }else if(value === 13){
                return "<button id='region_"+row.id+"' class='layui-btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",2)'>韓國-首爾</a>";
            }else if(value === 14){
                return "<button id='region_"+row.id+"' class='layui-btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",2)'>泰國-曼谷</a>";
            }else if(value === 15){
                return "<button id='region_"+row.id+"' class='layui-btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",2)'>日本-東京</a>";
            }else if(value === 16){
                return "<button id='region_"+row.id+"' class='btn btn-warning btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",3)'>俄羅斯-莫斯科</a>";
            }else if(value === 17){
                return "<button id='region_"+row.id+"' class='btn btn-warning btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",3)'>德國-法蘭克福</a>";
            }else if(value === 18){
                return "<button id='region_"+row.id+"' class='btn btn-danger btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",4)'>加拿大-多倫多</a>";
            }else if(value === 19){
                return "<button id='region_"+row.id+"' class='btn btn-danger btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",4)'>美東-弗吉尼亞</a>";
            }else if(value === 20){
                return "<button id='region_"+row.id+"' class='btn btn-danger btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",4)'>美西-硅谷</a>";
            }
            else if(value === 21){
                return "<button id='region_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",1)'>北京一區</a>";
            }else {
                return "<button id='region_"+row.id+"' class='btn btn-default btn-rounded btn-xs' onClick='javascript:regionTip(\"region_"+row.id+"\",-1)'>未知</a>";
            }
        }
    },{
        field: 'secret_id',
        title: 'secretId',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='"+value+"'>點擊複製</a>";
        }
    },{
        field: 'secret_key',
        title: 'secretKey',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            return "<button class='btn btn-danger btn-rounded btn-xs' data-clipboard-text='"+value+"'>點擊複製</a>";
        }
    },{
        field: 'remark',
        title: '備註',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value==='' || value===undefined || value===null){
                return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>查看</button>"
            }else{
                return "<button onClick=\"layer.alert('"+value+"');\" class='btn btn-warning btn-rounded btn-xs'>查看</button>"
            }
        }
    },{
        field : 'state',
        title : '狀態',
        align : 'center',
        width : 50,
        formatter:function(value,row,index){
            if (value == 1){
                return "<button id='state_"+row.id+"' class='btn btn-primary btn-rounded btn-xs' onClick='javascript:stateTip(\"state_"+row.id+"\",1)'>啟用</button>";
            }else if(value === 2){
                return "<button id='state_"+row.id+"' class='btn btn-danger btn-rounded btn-xs' onClick='javascript:stateTip(\"state_"+row.id+"\",2)'>停用</button>";
            }else if(value === 3){
                return "<button id='state_"+row.id+"' class='btn btn-default btn-rounded btn-xs' onClick='javascript:stateTip(\"state_"+row.id+"\",3)'>异常</button>";
            }else{
                return "<button id='state_"+row.id+"' class='btn btn-warning btn-rounded btn-xs' onClick='javascript:stateTip(\"state_"+row.id+"\",-1)'>未知</button>";
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
                    result+="<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState("+row.id+",2)'>停用</button>";
                }else if (row.state==2){
                    result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.id+",1)'>啟用</button>";
                }else if (row.state==3){
                    result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.id+",1)'>解禁</button>";
                }
                result+= "<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:editCos("+row.id+")'>編輯</button>"
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteCos("+row.id+")'>刪除</button>";
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
function editCos(id){
    layer.open({
        type : 2,
        anim: 1,
        title : "編輯配置",
        content : '/service/file/editCos?id='+id,
        btn : ['更新', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '510px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#editCos', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const cosName = body.find("input[name='cosName']").val();
            const defaultPath = body.find("input[name='defaultPath']").val();
            const bucketName = body.find("input[name='bucketName']").val();
            const region = body.find("select[name='region']").val();
            const secretId = body.find("input[name='secretId']").val();
            const secretKey = body.find("input[name='secretKey']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareId===undefined || softwareId===0 || softwareId===null){
                showTip("請先選擇應用");
                return false;
            }
            if(cosName===''){
                showTip("配置名稱不能為空");
                return false;
            }
            if(cosName.length>255){
                showTip("配置名稱長度不能大於255");
                return false;
            }
            if(defaultPath===''){
                showTip("默認目錄不能為空,根目錄請輸入'/'");
                return false;
            }
            if(defaultPath.length>255){
                showTip("默認目錄長度不能大於255");
                return false;
            }
            if(!checkPath(defaultPath)){
                showTip("默認目錄輸入格式錯誤,例:文件夾名/");
                return false;
            }
            if(bucketName===''){
                showTip("儲存桶名稱不能為空");
                return false;
            }
            if(bucketName.length>255){
                showTip("儲存桶名稱長度不能大於255");
                return false;
            }
            if(region===undefined || region===0 || region===null){
                showTip("請先選擇地區");
                return false;
            }
            if(secretId===''){
                showTip("secretId不能為空");
                return false;
            }
            if(secretKey.length>255){
                showTip("secretId長度不能大於255");
                return false;
            }
            if(secretKey===''){
                showTip("secretKey不能為空");
                return false;
            }
            if(secretId.length>255){
                showTip("secretKey長度不能大於255");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/updateCos?id="+id,
                type : "post",
                dataType:"json",
                data:"softwareId="+softwareId+"&cosName="+cosName+"&defaultPath="+defaultPath+"&bucketName="+bucketName+"&region="+region+"&secretId="+secretId+"&secretKey="+secretKey+"&remark="+remark,
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
function deleteCos(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該配置？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteCos",
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
function changeState(id,state){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
            $.ajax({
                url : "//courier-api.iskwen.com/api/changeCosState",
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
function addCos(){
    layer.open({
        type : 2,
        anim: 1,
        title : "添加配置",
        content : '/service/file/addCos',
        btn : ['添加', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '530px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#addCos', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const cosName = body.find("input[name='cosName']").val();
            const defaultPath = body.find("input[name='defaultPath']").val();
            const bucketName = body.find("input[name='bucketName']").val();
            const region = body.find("select[name='region']").val();
            const secretId = body.find("input[name='secretId']").val();
            const secretKey = body.find("input[name='secretKey']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareId===undefined || softwareId===0 || softwareId===null){
                showTip("請先選擇應用");
                return false;
            }
            if(cosName===''){
                showTip("配置名稱不能為空");
                return false;
            }
            if(cosName.length>255){
                showTip("配置名稱長度不能大於255");
                return false;
            }
            if(defaultPath===''){
                showTip("默認目錄不能為空,根目錄請輸入'/'");
                return false;
            }
            if(defaultPath.length>255){
                showTip("默認目錄長度不能大於255");
                return false;
            }
            if(!checkPath(defaultPath)){
                showTip("默認目錄輸入格式錯誤,例:文件夾名/");
                return false;
            }
            if(bucketName===''){
                showTip("儲存桶名稱不能為空");
                return false;
            }
            if(bucketName.length>255){
                showTip("儲存桶名稱長度不能大於255");
                return false;
            }
            if(region===undefined || region===0 || region===null){
                showTip("請先選擇地區");
                return false;
            }
            if(secretId===''){
                showTip("secretId不能為空");
                return false;
            }
            if(secretKey.length>255){
                showTip("secretId長度不能大於255");
                return false;
            }
            if(secretKey===''){
                showTip("secretKey不能為空");
                return false;
            }
            if(secretId.length>255){
                showTip("secretKey長度不能大於255");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/addCos",
                type : "post",
                dataType:"json",
                data:"softwareId="+softwareId+"&cosName="+cosName+"&defaultPath="+defaultPath+"&bucketName="+bucketName+"&region="+region+"&secretId="+secretId+"&secretKey="+secretKey+"&remark="+remark,
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
function stateTip (id,state){
        if (state==1){
            layer.tips('可前往對象儲存進行操作~', '#'+id, {
                tips: 1
            });
        }else if (state==2){
            layer.tips('罷工了~', '#'+id, {
                tips: 1
            });
        }else if (state==3){
            layer.tips('cos異常,請檢查配置信息!', '#'+id, {
                tips: 1
            });
        }else if (state==-1){
            layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
                tips: 1
            });
        }
}
function regionTip (id,state){
    if (state==1){
        layer.tips('中國', '#'+id, {
            tips: 1
        });
    }else if (state==2){
        layer.tips('亞太地區', '#'+id, {
            tips: 1
        });
    }else if (state==3){
        layer.tips('歐洲地區', '#'+id, {
            tips: 1
        });
    }else if (state==4){
        layer.tips('北美地區', '#'+id, {
            tips: 1
        });
    }else if (state==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
$("#content").focus(function(){
    showSimpleTip("目前搜索對象支持:<br>應用名稱/token/儲存桶/備註");
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
function softwareTip(id,tip){
    layer.tips(tip, '#'+id, {
        tips: 1
    });
}
function checkPath(path) {
    if(path==="" || path===null || path===undefined){
        return false;
    }
    if(path==="/"){
        return true;
    }
    if(path==="." || path===".."){
        return false;
    }
    if(path.substr(0,1)==="/"){
        return false;
    }
    if(path.substr(path.length-1,1)!=="/"){
        return false;
    }
    return true;
}
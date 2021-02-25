var grid = $("#listTransaction").bootstrapTable({
    url:"//courier-api.iskwen.com:8888/api/listTransaction" ,
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
        field: 'transaction_id',
        title: '編號',
        align : 'center',
        sortable:true,
        width:50
    },{
        field: 'title',
        title: '交易名稱',
        align : 'center',
        width:250
    },{
        field: 'amount',
        title: '交易金額',
        align : 'center',
        width:80,
        formatter : function(value, row, index) {
            if (value=='' || value==undefined){
                return '-';
            }else{
                return value.toFixed(2);
            }
        }
    },
        {
            field: 'commission',
            title: '手續費',
            align : 'center',
            width:80,
            formatter : function(value, row, index) {
                if (value=='' || value==undefined){
                    return '-';
                }else{
                    return value.toFixed(2);
                }
            }
        },{
            field: 'actual_amount',
            title: '實際金額',
            align : 'center',
            width:80,
            formatter : function(value, row, index) {
                if (value=='' || value==undefined){
                    return '-';
                }else{
                    return value.toFixed(2);
                }
            }
        },{
            field: 'type',
            title: '交易類型',
            align : 'center',
            width:70,
            formatter : function(value, row, index) {
                if(value == 1){
                    return "<button id='type_"+row.transaction_id+"' onClick='javascript:typeTip(1,\"type_"+row.transaction_id+"\")' class='btn btn-primary btn-rounded btn-xs'>儲值</a>";
                }else if (value == 2){
                    return "<button id='type_"+row.transaction_id+"' onClick='javascript:typeTip(2,\"type_"+row.transaction_id+"\")' class='btn btn-danger btn-rounded btn-xs'>支出</a>";
                }else if (value == 3){
                    return "<button id='type_"+row.transaction_id+"' onClick='javascript:typeTip(3,\"type_"+row.transaction_id+"\")' class='btn btn-warning btn-rounded btn-xs'>收入</a>";
                }else{
                    return "<button id='type_"+row.transaction_id+"' onClick='javascript:typeTip(-1,\"type_"+row.transaction_id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        },{
            field: 'state',
            title: '狀態',
            align : 'center',
            width:70,
            formatter : function(value, row, index) {
                if(value == 1){
                    return "<button id='state_"+row.transaction_id+"' onClick='javascript:stateTip(1,"+row.type+",\"state_"+row.transaction_id+"\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
                }else if (value == 2){
                    return "<button id='state_"+row.transaction_id+"' onClick='javascript:stateTip(2,"+row.type+",\"state_"+row.transaction_id+"\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
                }else if (value == 3){
                    return "<button id='state_"+row.transaction_id+"' onClick='javascript:stateTip(3,"+row.type+",\"state_"+row.transaction_id+"\")' class='btn btn-warning btn-rounded btn-xs'>進行中</a>";
                }else{
                    return "<button id='state_"+row.transaction_id+"' onClick='javascript:stateTip(-1,"+row.type+",\"state_"+row.transaction_id+"\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        },{
            field: 'add_time',
            title: '交易時間',
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
                if (row.state==1 || row.state==2){
                    return "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteTransaction("+row.transaction_id+")'>刪除</button>";
                }else{
                    return "<button class='layui-btn  layui-btn-xs layui-btn-disabled' disabled>刪除</button>";
                }

            }
        }], onLoadSuccess:function(){
        // const pages = $("#listTransaction").bootstrapTable("getOptions").totalPages;
        // showMsg("成功查詢到"+pages+"條數據");
    },
    queryParams: queryParams
});

function reload(){
    grid.bootstrapTable('refresh');
}

function queryParams(params){
    var title = $("#title").val();
    if(title!=''){
        params.title = title;
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
    }else{
        params.state = 0;
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
    $("#title").val('');
    $("#startTime").val('');
    $("#endTime").val('');
    $("#state").val(0);
    grid.bootstrapTable('resetFormSearch');
}
function deleteTransaction(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該記錄嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com:8888/api/deleteTransaction",
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
function stateTip (state,type,id){
    if (type==1){
        if (state==1){
            layer.tips('已經到賬啦~', '#'+id, {
                tips: 1
            });
        }else if(state==2){
            layer.tips('系統在開小差,趕緊聯繫客服吧~', '#'+id, {
                tips: 1
            });
        }else if(state==3){
            layer.tips('系統正在馬不停蹄的計算中ing~', '#'+id, {
                tips: 1
            });
        }else if(state==-1){
            layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
                tips: 1
            });
        }
    }else if (type==2){
        if (state==1){
            layer.tips('滔滔江水一去不復返~', '#'+id, {
                tips: 1
            });
        }else if(state==2){
            layer.tips('咦,又出BUG了?', '#'+id, {
                tips: 1
            });
        }else if(state==3){
            layer.tips('依依不捨的回頭看了你一眼~', '#'+id, {
                tips: 1
            });
        }else if(state==-1){
            layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
                tips: 1
            });
        }
    }else if (type==3){
        if (state==1){
            layer.tips('哇,又一桶~', '#'+id, {
                tips: 1
            });
        }else if(state==2){
            layer.tips('咦,錢好像又飛走了?', '#'+id, {
                tips: 1
            });
        }else if(state==3){
            layer.tips('正在路上~', '#'+id, {
                tips: 1
            });
        }else if(state==-1){
            layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
                tips: 1
            });
        }
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
function typeTip (type,id){
    if (type==1){
        layer.tips('儲值卡儲值~', '#'+id, {
            tips: 1
        });
    }else if (type==2){
        layer.tips('支付響應的服務費用~', '#'+id, {
            tips: 1
        });
    }else if (type==3){
        layer.tips('勞動的收穫~', '#'+id, {
            tips: 1
        });
    }else if (type==-1){
        layer.tips('系統一臉懵逼的搖了搖頭~', '#'+id, {
            tips: 1
        });
    }
}
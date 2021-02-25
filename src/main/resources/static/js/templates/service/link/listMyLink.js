var shortHost="https://x.ly2.run/";
var grid = $("#listMyLink").bootstrapTable({
    url:"//courier-api.iskwen.com/api/listMyLink" ,
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
        field: 'long_url',
        title: '原始連接',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            if(value.length>20){
                return value.substring(0,20)+"<a onClick=\"layer.alert('"+value+"');\">...</a>";
            }else{
                return value;
            }
        }
    },{
        field: 'short_url',
        title: '短連',
        align : 'center',
        width:150,
        formatter : function(value, row, index) {
            return "<a class='btn btn-danger btn-rounded btn-xs'  data-clipboard-text='"+shortHost+value+"'>"+shortHost+value+"</a>";
        }
    },{
        field: 'qrcode',
        title: '二維碼',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            return "<div class='qrcode-list' id='qrcode_"+row.id+"' onclick='showimg(this)'></div>"
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
        field: 'state',
        title: '狀態',
        align : 'center',
        width:50,
        formatter : function(value, row, index) {
            if(value === 1){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(1,\"state_"+row.id+"\")' class='btn btn-primary btn-rounded btn-xs'>正常</a>";
            }else if(value === 2){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(2,\"state_"+row.id+"\")' class='btn btn-danger btn-rounded btn-xs'>停用</a>";
            }else if(value === 3){
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(3,\"state_"+row.id+"\")' class='btn btn-warning btn-rounded btn-xs'>異常</a>";
            }else{
                return "<button id='state_"+row.id+"' onClick='javascript:stateTip(-1,\"state_"+row.id+"\")' class='btn layui-btn-primary btn-rounded btn-xs'>未知</a>";
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
    },
        {
            field: '',
            title: '操作',
            formatter : function(value,row,index){
                var result="<button class='layui-btn layui-btn-xs layui-btn-normal' onClick='window.open(\""+shortHost+row.short_url+"\")'>預覽</button>";
                if (row.state==1){
                     result+="<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState("+row.id+",2)'>停用</button>";
                }else if (row.state==2){
                     result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.id+",1)'>啟用</button>";
                }else if (row.state==3){
                     result+="<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState("+row.id+",1)'>重新激活</button>";
                }
                result+= "<button class='layui-btn  layui-btn-xs layui-btn-warm' onClick='javascript:resetShortUrl("+row.id+")'>重置</button>"
                return result+"<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteLink("+row.id+")'>刪除</button>";
            }
        }],onLoadSuccess:function(msg){
        var allTableData = $('#listMyLink').bootstrapTable('getData');
        $.each(allTableData,function(i,e){
            getQrcode("qrcode_"+e.id,shortHost+e.short_url,50,50);
        })
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
function deleteLink(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要刪除該短連嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/deleteLink",
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
function resetShortUrl(id){
    if(id==''){
        showTip("請選擇一條記錄");
    }else{
        showConfirm("溫馨提示","您確定要重置該短連嗎？",function(index){
            $.ajax({
                url : "//courier-api.iskwen.com/api/resetShortUrl",
                type : "post",
                dataType:"json",
                data:"id="+id,
                headers: {'Authorization': getCookie("token")},
                success:function(msg){
                    if(msg.status==0){
                        showMsg("重置成功")
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
                url : "//courier-api.iskwen.com/api/changeLinkState",
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
function addShort(){
    layer.open({
        type : 2,
        anim: 1,
        title : "添加短連",
        content : '/service/link/addShort',
        btn : ['添加', '關閉' ],
        btnAlign : 'c',
        resize : false,
        scrollbar : false,
        area : [ '700px', '400px' ],
        yes : function(index, layero) {
            const body = layer.getChildFrame('#addShort', index);
            const softwareId = body.find("select[name='softwareId']").val();
            const longUrl = body.find("input[name='longUrl']").val();
            const remark = body.find("textarea[name='remark']").val();
            if(softwareId===undefined || softwareId===0){
                showTip("請先選擇應用");
                return false;
            }
            if(longUrl===''){
                showTip("原鏈接不能為空");
                return false;
            }
            if(!checkUrl(longUrl)){
                showTip("原鏈接輸入格式錯誤");
                return false;
            }
            if(longUrl.length>2550){
                showTip("原鏈接長度不能大於2550");
                return false;
            }
            if(remark.length>255){
                showTip("備註長度不能大於255");
                return false;
            }
            $.ajax({
                url : "//courier-api.iskwen.com/api/addShort",
                type : "post",
                dataType:"json",
                data:"softwareId="+softwareId+"&longUrl="+encrypt(longUrl)+"&remark="+remark,
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
    showSimpleTip("目前搜索對象支持:<br>應用名稱/token/IP/原始鏈接/短鏈接/備註");
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
function encrypt(str) { //key,iv：16位的字符串
    var wordArray = CryptoJS.enc.Utf8.parse(str);
    var base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}
function checkUrl (str_url) {
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
    var re=new RegExp(strRegex);
    return re.test(str_url);
}
function getQrcode(id,url,width,height) {
    var qrcode = new QRCode(document.getElementById(id), {
        width : width,
        height : height,
        useSVG: true
    });
    qrcode.makeCode(url);
}
function showimg(t) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: ['300px','300px'],
        shade:1,
        offset: 'auto',
        // skin: 'layui-layer-nobg',
        shadeClose: true,
        content: '<div id="showimg_'+t.id+'"></div>',
        success: function(layero, index){
            getQrcode("showimg_"+t.id,t.title,300,300);
        }
    });
}

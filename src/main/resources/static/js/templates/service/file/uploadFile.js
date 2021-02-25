var config={
    SecretId:'',
    SecretKey:'',
    Bucket:'',
    Region:''
};
$.ajax({
    url:"//courier-api.iskwen.com/api/getCosInfo",
    type:"POST",
    dataType: "json",
    data:"id="+getUrlValue("id"),
    headers: {'Authorization': getCookie("token")},
    success:function(msg){
        if(msg.status==0){
            config.SecretId=msg.secretId;
            config.SecretKey=msg.secretKey;
            config.Bucket=msg.bucketName;
            config.Region=getRegionById(msg.region);
            console.log(config);
        }else{
            showTip(msg.tip);
        }
    },
    error:function(XMLHttpRequest, textStatus, errorThrown){
        <!--showErrorMsg(XMLHttpRequest.status);-->
        showErrorMsg("系统在开小差，请稍后再试");
    }
});
layui.use(['element','upload'],function(){
    var upload = layui.upload;
    var element = layui.element;
    var files;
    //多文件列表示例
    var demoListView = $('#demoList')
        , uploadListIns = upload.render({
        elem: '#fileList'
        , size: 102400000 //限制文件大小，單位 KB
        , exts: '*' //只允許上傳壓縮文件
        , url: "/guarantee/upload/uploadFile?userid=123456"
        , accept: 'file'
        , multiple: true
        , auto: false
        , bindAction: '#fileListAction'
        , xhr: upload.xhrOnProgress
        , progress: function (value) {//上傳進度回調 value進度值
            element.progress('demoList', value + '%')//設置頁面進度條
        }, xhr: function (index, e) {
            var percent = e.loaded / e.total;//計算百分比
            percent = parseFloat(percent.toFixed(2));
            element.progress('progress_' + index + '', percent * 100 + '%');
            console.log("-----" + percent);
        }
        // , data: JSON.stringify(Param)
        , choose: function (obj) {
            var files = this.files = obj.pushFile(); //將每次選擇的文件追加到文件隊列
            //讀取本地文件
            obj.preview(function (index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                    , '<td><div class="layui-progress layui-progress-big" lay-filter="progress_'+index+'" lay-showPercent="yes"><div class="layui-progress-bar" lay-percent="0%"></div></div></td>'
                    , '<td>等待上傳</td>'
                    , '<td>'
                    , '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重傳</button>'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">刪除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                //單個重傳
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //刪除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //刪除對應的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免刪除後出現同名文件不可選
                });

                demoListView.append(tr);
            });
        }

        ,
        before: function (obj) {
            this.data = {
                "BUSINESS_ID": obj.BUSINESS_ID,
                "FLOW_ID": obj.FLOW_ID,
                "FLOW_NODE_ID": obj.FLOW_NODE_ID,
                "FILE_TYPE": obj.FILE_TYPE
            }///攜帶額外的數據
        }
        ,
        done: function (res, index, upload) {
            if (res.code == 0) { //上傳成功
                var tr = demoListView.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(4).html('<span style="color: #5FB878;">上傳成功</span>');
                tds.eq(5).html(''); //清空操作
                var url = webroot + "/guarantee/itemFile/getItemFileByFlow?FLOW_ID=" + FLOW_ID + "&BUSINESS_ID=" + BUSINESS_ID + "&FLOW_NODE_ID=" + FLOW_NODE_ID + "&FILE_TYPE=" + FILE_TYPE
                //刷新表格
                table.reload('itemFileList', {
                    url: url
                    , where: {} //設定異步數據接口的額外參數
                    //,height: 300
                });
                return delete this.files[index]; //刪除文件隊列已經上傳成功的文件
            } else if (res.code == -1) {
                layer.msg(res.msg);
            }
            this.error(index, upload);
        }

        ,
        error: function (index, upload) {
            var tr = demoListView.find('tr#upload-' + index)
                , tds = tr.children();
            tds.eq(3).html('<span style="color: #FF5722;">上傳失敗</span>');
            tds.eq(4).find('.demo-reload').removeClass('layui-hide'); //顯示重傳
        }
    });
});
function uploadFile (bucket, region, cos, file, signInfo, callback) {
    cos.putObject (
        {
            Key: signInfo.fileId,
            Body: file,
            onHashProgress: function (progressData) {
                console.log ('校验中', JSON.stringify (progressData));
            },
            onProgress: function (progressData) {
                console.log ('上传中', JSON.stringify (progressData));
            },
        },
        function (err, data) {
            if (err) {
                console.log (err);
                callback ({success: false, msg: '文件上传失败!'});
                return;
            }
            callback ({success: true, msg: '上传成功!', data: data, signInfo: signInfo});
        }
    );
}
function GetTimeString() {
    var date = new Date();
    var yy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var hh = date.getHours().toString();
    var nn = date.getMinutes().toString();
    var ss = date.getSeconds().toString();
    var mi = date.getMilliseconds().toString();

    var ret = yy + mm + dd + hh + nn + ss + mi;
    return ret;
}
function getRegionById(id) {
    // 1成都，2南京，3北京，4广州，5上海，6重庆，7北京金融，8上海金融，9深圳金融，10香港，
    // 11新加坡，12印度孟买，13韩国首尔，14,泰国曼谷，15日本东京，
    // 16俄罗斯莫斯科，17德国法兰克福，
    // 18加拿大多伦多，19美东弗吉尼亚，20美西硅谷
    switch (id) {
        case 1:
            return "ap-chengdu";
        case 2:
            return "ap-nanjing";
        case 3:
            return "ap-beijing";
        case 4:
            return "ap-guangzhou";
        case 5:
            return "ap-shanghai";
        case 6:
            return "ap-chongqing";
        case 7:
            return "ap-beijing-fsi";
        case 8:
            return "ap-shanghai-fsi";
        case 9:
            return "ap-shenzhen-fsi";
        case 10:
            return "ap-hongkong";
        case 11:
            return "ap-singapore";
        case 12:
            return "ap-mumbai";
        case 13:
            return "ap-seoul";
        case 14:
            return "ap-bangkok";
        case 15:
            return "ap-tokyo";
        case 16:
            return "eu-moscow";
        case 17:
            return "eu-frankfurt";
        case 18:
            return "na-toronto";
        case 19:
            return "na-ashburn";
        case 20:
            return "na-siliconvalley";
        case 21:
            return "ap-beijing-1";
        default:
            return "";
    }

}
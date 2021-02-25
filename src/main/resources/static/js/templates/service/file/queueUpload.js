var config = {
    SecretId: '',
    SecretKey: '',
    Bucket: '',
    Region: '',
    Path: ''
};
var sql = [];
var md5List = [];
$.ajax({
    url: "//courier-api.iskwen.com/api/getCosInfo",
    type: "POST",
    dataType: "json",
    async: false,
    data: "id=" + getUrlValue("id"),
    headers: {'Authorization': getCookie("token")},
    success: function (msg) {
        if (msg.status == 0) {
            config.SecretId = msg.secretId;
            config.SecretKey = decrypt(msg.secretKey);
            config.Bucket = msg.bucketName;
            config.Region = getRegionById(msg.region);
            if (msg.defaultPath === "/") {
                config.Path = "";
                $("#pathTip").html("該目錄下的相同文件將會被自動覆蓋，當前目錄:" + "<a href='javascript:void(0);'   onclick='changePath();' id='changePathHref'>/</a>");
            } else {
                config.Path = msg.defaultPath;
                $("#pathTip").html("該目錄下的相同文件將會被自動覆蓋，當前目錄:" + "<a href='javascript:void(0);'   onclick='changePath();' id='changePathHref'>" + config.Path + "</a>");
            }
        } else {
            showTip(msg.tip);
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        <!--showErrorMsg(XMLHttpRequest.status);-->
        showErrorMsg("系统在开小差，请稍后再试");
    }
});
var cos = new COS({
    FileParallelLimit: 5,
    ChunkParallelLimit: 5,
    ChunkMbSize: 8 * 1024 * 1024,
    SecretId: config.SecretId, // 可传固定密钥或者临时密钥
    SecretKey: config.SecretKey, // 可传固定密钥或者临时密钥
});
// cos.getBucket({
//     Bucket: config.Bucket, /* 必须 */
//     Region: config.Region,     /* 存储桶所在地域，必须字段 */
//     Prefix: '',           /* 非必须 */
// }, function(err, data) {
//     console.log(err || data.Contents);
// });
new Vue({
    el: '#app',
    data: function () {
        return {
            FileParallelLimit: 5,
            ChunkParallelLimit: 16,
            ChunkMbSize: 2,
            list: [],
            total: 0,
        };
    },
    created: function () {
        var self = this;
        cos.on('list-update', function (data) {
            self.list = data.list;
            self.total = data.list.length;
            for (i = 0; i < data.list.length; i++) {
                //console.log(data.list[i]);
                if (data.list[i].state === 'success' && sql.indexOf(data.list[i].id) === -1) {
                    const cosUrl = getRegionUrlById(data.list[i].Bucket, data.list[i].Region, data.list[i].FilePath, data.list[i].Key);
                    addFile(data.list[i].Key, '', data.list[i].size, data.list[i].Bucket, data.list[i].FilePath, data.list[i].Key, data.list[i].Region, data.list[i].id, data.list[i].error, cosUrl);
                    //console.log(md5List[i]);
                    sql.push(data.list[i].id);//添加记录，避免重复提交
                }
            }
        });
    },
    methods: {
        formatSize: function (size) {
            var i, unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            for (i = 0; i < unit.length && size >= 1024; i++) {
                size /= 1024;
            }
            return (Math.round(size * 100) / 100 || 0) + unit[i];
        },
        selectedFile: function (e) {//上傳文件更新時
            var files = e.target.files;
            var list = [].map.call(files, function (f) {
                //console.log(f);
                //md5List.push(getBrowserMD5(f));//添加记录
                //console.log(getBrowserMD5(f));
                let fileName = "";
                let filePath = "";
                if (f.webkitRelativePath !== null && f.webkitRelativePath !== undefined && f.webkitRelativePath !== "") {
                    fileName = f.webkitRelativePath;
                    filePath = config.Path + getFilePath(fileName);
                    //console.log(filePath);
                } else {
                    fileName = f.name;
                    filePath = config.Path;
                }
                return {
                    Bucket: config.Bucket,
                    Region: config.Region,
                    Key: config.Path + fileName,
                    Body: f,
                    FilePath: filePath,
                };
            });
            cos.uploadFiles({files: list});
            $('#uploadButton').val('');
            $('#uploadButton2').val('');
        },
        pauseTask: function (task) {
            cos.pauseTask(task.id);
        },
        restartTask: function (task) {
            cos.restartTask(task.id);
        },
        cancelTask: function (task) {
            cos.cancelTask(task.id);
        },
    },
});

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

function getRegionUrlById(bucket, region, filePath, key) {
    const mode = 'https://';
    // return mode+bucket+'.cos.'+region+'.myqcloud.com'+filePath+'/'+key;
    return mode + bucket + '.cos.' + region + '.myqcloud.com';
}

function decrypt(str) {
    var base64 = CryptoJS.enc.Base64.parse(str);
    return base64.toString(CryptoJS.enc.Utf8);
}

function deleteTableRow(index) {
    // index=$(table).index();
    console.log(index);
    var x = document.getElementById("filesTable");
    x.deleteRow(index);//删除一行
}

function addFile(fileName, md5, size, bucket, filePath, key, region, id, error, cosUrl) {
    if (error === null || error === undefined || error === "null") {
        error = "";
    }
    $.ajax({
        url: "//courier-api.iskwen.com/api/addFile",
        type: "POST",
        dataType: "json",
        async: false,
        data: "cosId=" + getUrlValue("id") + "&fileName=" + fileName + "&md5=" + md5 + "&size=" + size + "&bucket=" + bucket + "&filePath=" + filePath + "&key=" + key + "&region=" + region + "&requestId=" + id + "&remark=" + error + "&cosUrl=" + cosUrl + "&fileType=" + getFileTypeBySuffix(getSuffix(key)),
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                if (msg.mode === 1) {
                    showMsg("文件上传成功!");
                } else {
                    showMsg("文件覆蓋成功!");
                }
                //console.log("cosId="+getUrlValue("id")+"&fileName="+fileName+"&md5="+md5+"&size="+size+"&bucket="+bucket+"&filePath="+filePath+"&key="+key+"&region="+region+"&requestId="+id+"&remark="+error+"&cosUrl="+cosUrl+"&fileType="+getFileTypeBySuffix(getSuffix(key)));
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
}

function getSuffix(filename) {
    if (!filename || typeof filename != 'string') {
        return false
    }
    ;
    let a = filename.split('').reverse().join('');
    let b = a.substring(0, a.search(/\./)).split('').reverse().join('');
    return b
};

function getFileTypeBySuffix(suffix) {
    if (suffix === undefined || suffix == null) {
        return 7;
    }
    if (suffix === 'doc' || suffix === 'pdf' || suffix === 'txt' || suffix === 'docx' || suffix === 'pptx' || suffix === 'xlsx' || suffix === 'ini' || suffix === 'xls' || suffix === 'log' || suffix === 'chm') {
        return 1;
    } else if (suffix === 'bmp' || suffix === 'jpg' || suffix === 'png' || suffix === 'gif' || suffix === 'jpeg' || suffix === 'ico') {
        return 2;
    } else if (suffix === 'mp3' || suffix === 'mp4' || suffix === 'avi' || suffix === 'rmvb' || suffix === 'rm' || suffix === 'flv') {
        return 3;
    } else if (suffix === '7z' || suffix === 'zip' || suffix === 'rar') {
        return 4;
    } else if (suffix === 'e' || suffix === 'e4a' || suffix === 'c' || suffix === 'cpp' || suffix === 'dll' || suffix === 'sql' || suffix === 'apk' || suffix === 'exe' || suffix === 'class' || suffix === 'php' || suffix === 'jar') {
        return 5;
    } else if (suffix === 'html' || suffix === 'htm' || suffix === 'jsp' || suffix === 'js' || suffix === 'css' || suffix === 'shmtl') {
        return 6;
    } else {
        return 7;
    }
}

function getBrowserMD5(file) {
    browserMD5File(file, function (err, md5) {
        return md5;
    });
}

function checkPath(path) {
    if (path === "" || path === null || path === undefined) {
        return false;
    }
    if (path === "/") {
        return true;
    }
    if (path === "." || path === "..") {
        return false;
    }
    if (path.substr(0, 1) === "/") {
        return false;
    }
    if (path.substr(path.length - 1, 1) !== "/") {
        return false;
    }
    return true;
}

function changePath() {
    layer.prompt({
        title: '切換目錄',
        value: $("#changePathHref").text()
    }, function (val, index) {
        if (!checkPath(val)) {
            showTip("目錄格式錯誤,例:1/");
            return false;
        }
        if (val === "/") {
            config.Path = "";
            $("#pathTip").html("該目錄下的相同文件將會被自動覆蓋，當前目錄:" + "<a href='javascript:void(0);'   onclick='changePath();' id='changePathHref'>/</a>");
        } else {
            config.Path = val;
            $("#pathTip").html("該目錄下的相同文件將會被自動覆蓋，當前目錄:" + "<a href='javascript:void(0);'   onclick='changePath();' id='changePathHref'>" + config.Path + "</a>");
        }
        layer.close(index);
        // layer.msg('切換成功', {icon: 1,time: 3000});
        showMsg("切換成功");
    });
}

function getFileName(str) {
    var obj = str.lastIndexOf("/");
    return str.substr(obj + 1);
}

function getFilePath(str) {
    var obj = str.lastIndexOf("/");
    return str.substr(0, obj+1);
}
function setCookie(key,value,time) {
    const exp = new Date();
    exp.setTime(exp.getTime()+time);
    document.cookie = key+" =" + escape(value) + ";expires=" + exp.toUTCString();
}
function getCookie(key) {
    if (document.cookie.length > 0)     {
        c_start = document.cookie.indexOf(key + "=")
        if (c_start != -1){
            c_start = c_start + key.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1)
                c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
function clearCookie(key) {
    setCookie(key, "", -1);
}
function getUrlValue(key)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == key){return pair[1];}
    }
    return '';
}
function getRandomStr(len) {
     　　len = len || 32;
     　　var $chars = 'abcdefghijklmnopqrstuvwxyz1234567890';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
     　　var maxPos = $chars.length;
     　　var pwd = '';
     　　for (i = 0; i < len; i++) {
         　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
         　　}
     　　return pwd;
     }
function checkStrByLettersOrNumber(str){
    // 判断字符串是否为数字和字母组合
    var zg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/;
    if (!zg.test(str)) {
        return false;
    } else {
        return true;
    }
}
function toThousands(num) {
    var result = '', counter = 0;
    var dot = String(num).indexOf(".");
    if(dot != -1){
        // alert("有小数点");
        // 获取小数点后面的数字(indexOf和substring都不支持数字，所以要先转字符串才可以用)
        var dotCnt = String(num).substring(dot+1,num.length);

        // 获取小数点前面的数字
        num = String(num).split('.')[0]
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) { result = ',' + result; }
        }
        result = result + '.' + dotCnt;
        return result;

    }else{
        // alert("没有小数点");
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
}
function encodeUtf8(str) {
    var rs = '';
    for(var i of str) {
        var code = i.codePointAt(0);
        if(code < 128) {
            rs += i;
        } else if(code > 127 && code < 2048) {
            rs += String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
        } else if(code > 2047 && code < 65536) {
            rs += String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
        } else if(code > 65536 && code < 1114112) {
            rs += String.fromCharCode((code >> 18) | 240, ((code >> 12) & 63) | 128, ((code >> 6) & 63) | 128, (code & 63) | 128);
        }
    }
    console.log(rs);
    return rs;
}
function decodeUtf8(str) {
    var rs = '';
    for(var i of str) {
        var code = i.codePointAt(0);
        if(code < 128) {
            rs += i;
        } else if(code > 127 && code < 2048) {
            rs += String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
        } else if(code > 2047 && code < 65536) {
            rs += String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
        } else if(code > 65536 && code < 1114112) {
            rs += String.fromCharCode((code >> 18) | 240, ((code >> 12) & 63) | 128, ((code >> 6) & 63) | 128, (code & 63) | 128);
        }
    }
    return rs;
}
/** layuiAdmin.std-v1.2.1 LPPL License By http://www.layui.com/admin/ */ ;
var source_cpu=[];
var source_ram=[];
var api_mail_num=0;
var api_sms_num=0;
var pay=[];
$(document).ready(function() {
    $.ajax({
        url:"//courier-api.iskwen.com:8888/api/getEchatsInfoByPerformance?nowDate="+getDay(0),
        type:"POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.list!==null){
                for(let i=0; i<7; i++){
                    //console.log(msg[i].cpu);
                    source_cpu[i]=msg[6-i].cpu.toFixed(2);
                }
                for(let i=0; i<7; i++){
                    source_ram[i]=msg[6-i].ram.toFixed(2);
                }
            }else{
                showTip("Echars接口異常,請重新登錄後再試");
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
    $.ajax({
        url:"//courier-api.iskwen.com:8888/api/getEchatsInfoByApiType",
        type:"POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.status==0){
                api_mail_num=msg.api_mail_num;
                api_sms_num=msg.api_sms_num;
            }else{
                showTip("Echars接口異常,請重新登錄後再試");
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
    $.ajax({
        url:"//courier-api.iskwen.com:8888/api/getEchatsInfoByPay?nowDate="+getDay(0),
        type:"POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success:function(msg){
            if(msg.list!==null){
                for(let i=0; i<7; i++){
                    pay[i]=msg[6-i].actual_amount.toFixed(2);
                }
            }else{
                showTip("Echars接口異常,請重新登錄後再試");
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系统在开小差，请稍后再试");
        }
    });
})
layui.define(function(e) {
    layui.use(["admin", "carousel"], function() {
        var e = layui.$,
            t = (layui.admin, layui.carousel),
            a = layui.element,
            i = layui.device();
        e(".layadmin-carousel").each(function() {
            var a = e(this);
            t.render({
                elem: this,
                width: "100%",
                arrow: "none",
                interval: a.data("interval"),
                autoplay: a.data("autoplay") === !0,
                trigger: i.ios || i.android ? "click" : "hover",
                anim: a.data("anim")
            })
        }), a.render("progress")
    }), layui.use(["admin", "carousel", "echarts"], function() {
        var e = layui.$,
            t = layui.admin,
            a = layui.carousel,
            i = layui.echarts,
            l = [],
            n = [{
                title: {
                    text: "近七日負載趨勢",
                    x: "center",
                    textStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["", ""]
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: !1,
                    data: [ getDay(-6), getDay(-5), getDay(-4), getDay(-3), getDay(-2), getDay(-1), getDay(0)]
                }],
                yAxis: [{
                    type: "value"
                }],
                series: [{
                    name: "CPU",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: source_cpu
                }, {
                    name: "RAM",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: source_ram
                }]
            }, {
                title: {
                    text: "Api調用分佈",
                    x: "center",
                    textStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    x: "left",
                    data: ["Mail", "Sms"]
                },
                series: [{
                    name: "Api方式",
                    type: "pie",
                    radius: "55%",
                    center: ["50%", "50%"],
                    data: [{
                        value: api_mail_num,
                        name: "Mail"
                    }, {
                        value: api_sms_num,
                        name: "Sms"
                    }]
                }]
            }, {
                title: {
                    text: "最近一周支出情況",
                    x: "center",
                    textStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: "axis",
                    formatter: "{b}<br>支出金額：{c}"
                },
                xAxis: [{
                    type: "category",
                    data: [getDay(-6), getDay(-5), getDay(-4), getDay(-3), getDay(-2), getDay(-1), getDay(0)]
                }],
                yAxis: [{
                    type: "value"
                }],
                series: [{
                    type: "line",
                    data: pay
                }]
            }],
            r = e("#LAY-index-dataview").children("div"),
            o = function(e) {
                l[e] = i.init(r[e], layui.echartsTheme), l[e].setOption(n[e]), t.resize(function() {
                    l[e].resize()
                })
            };
        if (r[0]) {
            o(0);
            var d = 0;
            a.on("change(LAY-index-dataview)", function(e) {
                o(d = e.index)
            }), layui.admin.on("side", function() {
                setTimeout(function() {
                    o(d)
                }, 300)
            }), layui.admin.on("hash(tab)", function() {
                layui.router().path.join("") || o(d)
            })
        }
    })
});
function getDay(day){
    var today = new Date();
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear+"-"+tMonth+"-"+tDate;
}
function doHandleMonth(month){

    var m = month;

    if(month.toString().length == 1){

        m = "0" + month;

    }

    return m;

}
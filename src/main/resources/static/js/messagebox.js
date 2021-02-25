function showTip(title){
	layer.msg(title,{
		  time: 1000,
		  anim: 6,
		  icon: 5
	});
}
function showSimpleTip(title){
	layer.msg(title);
}
function showRockTip(title){
	layer.msg(title, function(){

	});
}

function showMsg(title){
	showMsgCore(title,1)
}

function showErrorMsg(title){
	showMsgCore(title,2)
}

function showMsgCore(title,ico){
	layer.msg(title,{
		  time: 1000,
		  icon: ico,
		  isOutAnim:false
	});
}

function showConfirm(title,content,callback){
	layer.confirm(content, {icon: 3, title:title==''?"温馨提示":title},callback,function(index){
			layer.close(index);
	});
}

function showMsgConfirm(tip,callback){
	layer.msg(tip, {
		  time: 0 //不自动关闭
		  ,btn: ['确定']
		  ,yes:callback
		});
}

//skin: 'layui-layer-rim', //加上边框
function showCard(data){
	//页面层
	layer.open({
	  type: 1,
	  title: '卡数据',
	  area: ['420px', '640px'], //宽高
	  content: '<textarea style="overflow:auto;word-break:break-all;margin:0px;width:414px;height:595px;">'+data+'</textarea>'
	});	
}
document.write("<link rel=\"stylesheet\" href=\"https://static.iskwen.com/toastr-v2.1.4/toastr.css\">");
document.write("<script src=\"https://static.iskwen.com/toastr-v2.1.4/toastr.js\"></script>");
function showToastrInfo(title,text,position,timeout){
	toastr.options = {
			  "closeButton": false,//关闭按钮
			  "debug": false,
			  "newestOnTop": false,//从上面插入
			  "progressBar": false,//进度条
			  "positionClass": getPositionClass(position),//显示位置toast-top-center
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300",//持续时间
			  "hideDuration": "1000",//隐藏时间
			  "timeOut": timeout,//超时
			  "extendedTimeOut": "1000",//扩展时间
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			};
	toastr.info(text,title,toastr.options);
}
function showToastrError(title,text,position,timeout){
	toastr.options = {
			  /*positionClass:
			    1:toast-top-right
				2:toast-bottom-right
				3:toast-bottom-left
				4:toast-top-left
				5:toast-top-full-width
				6:toast-bottom-full-width
				7:toast-top-center
				8:toast-bottom-center
				*/
			  "closeButton": false,//关闭按钮
			  "debug": false,
			  "newestOnTop": false,//从上面插入
			  "progressBar": false,//进度条
			  "positionClass": getPositionClass(position),//显示位置toast-top-center
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300",//持续时间
			  "hideDuration": "1000",//隐藏时间
			  "timeOut": timeout,//超时
			  "extendedTimeOut": "1000",//扩展时间
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			};
	toastr.error(text,title,toastr.options);
}
function showToastrSucc(title,text,position,timeout){
	toastr.options = {
			  /*positionClass:
			    1:toast-top-right
				2:toast-bottom-right
				3:toast-bottom-left
				4:toast-top-left
				5:toast-top-full-width
				6:toast-bottom-full-width
				7:toast-top-center
				8:toast-bottom-center
				*/
			  "closeButton": false,//关闭按钮
			  "debug": false,
			  "newestOnTop": false,//从上面插入
			  "progressBar": false,//进度条
			  "positionClass": getPositionClass(position),//显示位置toast-top-center
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300",//持续时间
			  "hideDuration": "1000",//隐藏时间
			  "timeOut": timeout,//超时
			  "extendedTimeOut": "1000",//扩展时间
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			};
	toastr.success(text,title,toastr.options);
}
function showToastrWarn(title,text,position,timeout){
	toastr.options = {
			  "closeButton": false,//关闭按钮
			  "debug": false,
			  "newestOnTop": false,//从上面插入
			  "progressBar": false,//进度条
			  "positionClass": getPositionClass(position),//显示位置toast-top-center
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300",//持续时间
			  "hideDuration": "1000",//隐藏时间
			  "timeOut": timeout,//超时
			  "extendedTimeOut": "1000",//扩展时间
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			};
	toastr.warning(text,title,toastr.options);
}
function getPositionClass(position){
	  /*positionClass:
    1:toast-top-right
	2:toast-bottom-right
	3:toast-bottom-left
	4:toast-top-left
	5:toast-top-full-width
	6:toast-bottom-full-width
	7:toast-top-center
	8:toast-bottom-center
	*/
	switch(position){
	case 1:
		return "toast-top-right";
	case 2:
		return "toast-bottom-right";
	case 3:
		return "toast-bottom-left";
	case 4:
		return "toast-top-left";
	case 5:
		return "toast-top-full-width";
	case 6:
		return "toast-bottom-full-width";
	case 7:
		return "toast-top-center";
	case 8:
		return "toast-bottom-center";
	}
}

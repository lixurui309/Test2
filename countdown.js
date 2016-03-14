var WINDOW_WIDTH;
var WINDOW_HEIGHT;
var RADIUS;  //时钟圆的半径
var RADIUS_H;  //时、分、秒的半径
var RADIUS_M;
var RADIUS_S;
var MARGIN_TOP; //时钟放的位置
var MARGIN_LEFT;

var time = new Date();
time.setTime(time.getTime()+3600);

window.onload = function(){
	//为了屏幕自适应
	WINDOW_WIDTH = document.documentElement.clientWidth;   
	WINDOW_HEIGHT = document.documentElement.clientHeight;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH*3/8);
	RADIUS = Math.round(Math.min(WINDOW_WIDTH/8,WINDOW_HEIGHT/6));
	RADIUS_H = (Math.min(WINDOW_WIDTH/8,WINDOW_HEIGHT/6))/3;
	RADIUS_M = (Math.min(WINDOW_WIDTH/8,WINDOW_HEIGHT/6))*3/5;
	RADIUS_S = (Math.min(WINDOW_WIDTH/8,WINDOW_HEIGHT/6))*4/5;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/3);
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	canvas.width=WINDOW_WIDTH;  //更方便
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSeconds = getCurrentShowTimeSeconds();//得到要显示时间的秒数
	setInterval(
		function(){render(context);update();},50);
	
	}
function getCurrentShowTimeSeconds(){
	//获取当前时间和结束时间的差
	var curTime = new Date();
	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	return ret;
	}	
	
function render(cxt){
	//绘制当前画布
	//绘制时钟
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	
	var hours = parseInt(curShowTimeSeconds/3600);
	if(hours>12){
		var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
		hours = hours-12;
		}
	else{
	var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
	}
	var seconds = curShowTimeSeconds%60;
    cxt.fillStyle = "yellow"; 
	cxt.beginPath();
	cxt.arc(MARGIN_LEFT+RADIUS,MARGIN_TOP+RADIUS,RADIUS,0,2*Math.PI);
	cxt.closePath();
	cxt.fill();
	
	renderHours(MARGIN_LEFT+RADIUS,MARGIN_TOP+RADIUS,hours,minutes,RADIUS_H,cxt);
	renderMAndS(MARGIN_LEFT+RADIUS,MARGIN_TOP+RADIUS,minutes,RADIUS_M,cxt);
	renderMAndS(MARGIN_LEFT+RADIUS,MARGIN_TOP+RADIUS,seconds,RADIUS_S,cxt);
	}
	
function renderHours(x,y,numH,numM,r,cxt){//从x画到y,num表示时间，画关于hour
	cxt.fillStyle = "green";
	cxt.beginPath();
	cxt.arc(x,y,r,3/2*Math.PI,(numH/6+numM/360+3/2)*Math.PI);
	cxt.closePath();
	cxt.fill();
	
	var tox = toHX(x,y,(numH/6+numM/360)*Math.PI,r);
	var toy = toHY(x,y,(numH/6+numM/360)*Math.PI,r);
	cxt.beginPath();
	cxt.moveTo(x,y);
    cxt.lineTo(x,y-r);
	cxt.lineTo(tox,toy);
	cxt.lineTo(x,y);
	cxt.closePath();
	cxt.fill();
	}
	
function renderMAndS(x,y,num,r,cxt){  //画分和秒
	cxt.strokeStyle = "red";
	var toX1=toX(x,y,num,r);
	var toY1=toY(x,y,num,r);
	cxt.beginPath();
	cxt.moveTo(x,y);
    cxt.lineTo(toX1,toY1);
	cxt.closePath();
	cxt.stroke();
	}
function toHX(x,y,num,r){//为了显示关于时钟的扇形做的计算,还有显示时钟数字
	var toX=0;
	 if(num <= Math.PI){
		toX = x + r*Math.cos(1/2*Math.PI-num);
		}
	else if((num <= 2*Math.PI) && (num > Math.PI)){
		toX = x - r*Math.cos(3/2*Math.PI-num);
		}
	return toX;
	}
	
function toHY(x,y,num,r){//为了显示关于时钟的扇形做的计算
	var toY=0;
	if(num <= Math.PI){
		if(num <= (1/2)*Math.PI){   //角度在90度以内
			toY = y - r*Math.sin(1/2*Math.PI-num);
			}
		else{
			toY = y + r*Math.sin(num-1/2*Math.PI);
			}
		}
	else if((num <= 2*Math.PI) && (num > Math.PI)){
		if((num <= 2*Math.PI/3) && (num > Math.PI)){
			toY = y + r*Math.sin(3/2*Math.PI-num);
			}
		else{
			toY = y - r*Math.sin(num-3/2*Math.PI);
			}
		}
	return toY;
	}
function toX(x,y,num,r){//x,y是圆心的坐标，num为时间，，，与角度有关，{}
	var toX=0;
	 if(num*Math.PI/30 <= Math.PI){
		toX = x + r*Math.cos((1/2-num/30)*Math.PI);
		}
	else if((num*Math.PI/30 <= 2*Math.PI) && (num*Math.PI/30 > Math.PI)){
		toX = x - r*Math.cos((3/2-num/30)*Math.PI);
		}
	return toX;
}
function toY(x,y,num,r){
	var toY=0;
	if(num*Math.PI/30 <= Math.PI){
		if(num*Math.PI/30 <= (1/2)*Math.PI){   //角度在90度以内
			toY = y - r*Math.sin((1/2-num/30)*Math.PI);
			}
		else{
			toY = y + r*Math.sin((num/30-1/2)*Math.PI);
			}
		}
	else if((num*Math.PI/30 <= 2*Math.PI) && (num*Math.PI/30 > Math.PI)){
		if((num*Math.PI/30 <= 2*Math.PI/3) && (num*Math.PI/30 > Math.PI)){
			toY = y + r*Math.sin((3/2-num/30)*Math.PI);
			}
		else{
			toY = y - r*Math.sin((num/30-3/2)*Math.PI);
			}
		}
	return toY;
	}

function update(){//数据的改变
	//时间的变化
	//下一次要显示的时间
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	var nextHours= parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;
	
	var curHours= parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;
	
	if(nextSeconds != curSeconds){//若时间改变了
		curShowTimeSeconds = nextShowTimeSeconds;
		
		}
	}
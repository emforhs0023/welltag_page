var express = require("express");
var bodyParser = require("body-parser");
var nunjucks = require("nunjucks");
var cors = require("cors");
var passport = require("./services/passport");
var session = require("express-session");
var config = require("./config")
var fs = require("fs");
var scheduler = require("./services/scheduler");
var app = express();


var http = require("http").Server(app);
var io = require("socket.io")(http);


var mqtt = require("./services/MQTTService")
var socketHandler = require("./services/socketHandler");
var rabbitmqClient = require("./services/rabbitmqClient");

//socketHandler가 socket 통신을 사용할 수 있도록 socket io 등록
socketHandler.setSocketIO(io);

//bady parser 등록
app.use(bodyParser.json());
app.use(cors());

//static 파일 경로 설정
app.use("/static", express.static(__dirname + '/public'));

//세션 설정
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//웹페이지 템플릿 등록
nunjucks.configure("views",{
	autoescape : true,
	express    : app,
	watch      : true
})
//D3 csv
app.use("/data", express.static(__dirname + "/data"));

//리뉴얼 경로
app.use("/css", express.static(__dirname + "/node_modules/jquery-ui-dist"));
app.use("/css", express.static(__dirname+ "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/moment"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/js", express.static(__dirname + "/node_modules/jquery-ui-dist"));
app.use("/js", express.static(__dirname + "/node_modules/datatables.net/js"));
app.use("/js", express.static(__dirname + "/node_modules/jcanvas/dist"));
app.use("/js", express.static(__dirname + "/node_modules/d3/dist"));
app.use("/js", express.static(__dirname + "/node_modules/sugar/dist"));


//기존 웰태그 라우터 등록
var mypageRoute = require("./route/myPageRoute");
var loginRoute = require("./route/loginRoute");
var monitoringRoute = require("./route/monitoringRoute");
var logRoute = require("./route/logRoute");
var systemRoute = require("./route/systemRoute");
var testRoute = require("./route/testRoute")
var apiRoute = require("./api/apiRoute")

app.use("/mypage", mypageRoute);
app.use("/login", loginRoute);
app.use("/monitoring", monitoringRoute);
app.use("/log", logRoute);
app.use("/system", systemRoute);
app.use("/test",testRoute);
app.use("/api",apiRoute);



//리뉴얼 웰태그 라우터 등록
var re_mainRoute = require("./route/re_mainRoute");
var re_systemRoute = require("./route/re_systemRoute");

app.use("/re_main",re_mainRoute);
app.use("/re_system",re_systemRoute);


app.use(function(error, req, res, next) {
	console.error(error.stack);
	res.json({'error': 'error'});
});
// 스케줄러 작동
scheduler.startSchedule();

// PID 저장
// fs.writeFile("web_server.pid", process.pid);

http.listen(config.port, function() {
	console.log("http server start");
});



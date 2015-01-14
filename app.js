var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var multiparty=require('connect-multiparty');


var AV = require('avoscloud-sdk').AV;
AV.initialize("qkln6010w7ln2xe26wtnb56m67qgzzzjxm1tyb7wh0xoktep", "davplp3j3jbrhngjm6edbnneoo99um9oc1yzhkkjmpsincgl");


var routes = require('./routes/index');
var users = require('./routes/users');
var roads = require('./routes/roads');
var points = require('./routes/points');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', {layout: true });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(multiparty({uploadDir:'public/temp', keepExtensions:true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use('/', routes);
app.use('/users', users);
app.use('/roads', roads);
app.use('/points', points);


//设置跨域访问
//app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//    res.header("X-Powered-By",' 3.2.1')
//    res.header("Content-Type", "application/json;charset=utf-8");
//    next();
//});



app.get('/register',function(req, res){
    res.render('register',{ message:''});
});

app.post('/register',function(req, res){
    var user=new AV.User();
    user.set("username",req.body.username);
    user.set("password",req.body.password);
    user.set("email", req.body.usermail);
    user.signUp(null, {
            success: function(user) {
                res.redirect('/');
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                res.render('register',{ message:error.message});
            }}
    );
});

app.post('/login', function(req, res) {

    AV.User.logIn(req.body.username, req.body.password).then(function() {
        //登录成功，avosExpressCookieSession会自动将登录用户信息存储到cookie
        //跳转到profile页面。
        console.log("成哥")

        console.log('signin successfully: %j', AV.User.current());
        res.redirect('/');
    },function(error) {
        //登录失败，跳转到登录页面
        console.log("shibai")
        res.render('index',{ message:'登录失败，请重新登录',layout:'share/layout'});

    });
});












// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

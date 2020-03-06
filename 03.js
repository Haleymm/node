var express = require('express');
var http = require('http');
var socket = require('socket.io');

var port = 3011;

var app = express();
var server = http.createServer(app);
var io = socket(server);


// 静态资源中间件
app.use(express.static(__dirname+'/static'))

// 监听连接
server.listen(port, function () {
    console.log('正在监听' + port + '端口');
});

io.on('connection', (socket) => {
    // 收到客户端的登录请求
    socket.on('login',function(data) {
        // 把用户名存储起来
        socket.username = data
       console.log(data+'登录了')
    })

    // 监听客户端发送来的事件
    socket.on('send',function(data) {
        console.log('收到客户端发来的数据')
        console.log(data)
        // 把数据发给其他客户端
        io.emit('msg',{user:socket.username,msg:data})
    })

  });


// app.get('/',function(req,res) {
//     res.send('hello world');
// })

app.get('*',function(eq,res) {
    res.sendFile(__dirname + '/view/03.html')
})

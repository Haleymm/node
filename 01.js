var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 9000;

// 创建http服务器
var server = http.createServer(function (request, response) {
    console.log('监听' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(port, function () {
    console.log('正在监听' + port + '端口');
});

// 创建websocket服务对象
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// 建立websocket连接
wsServer.on('request', function (request) {

    // 当前连接
    var connection = request.accept(null, request.origin);
    console.log('连接建立成功');

    // 向客户端发送信息
    setInterval(function () {
        connection.sendUTF('服务端发送信息' + new Date())
    }, 1000)

    // 监听有收到message
    connection.on('message', function (message) {

        if (message.type === 'utf8') {
            console.log('收到utf-8信息： ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('收到二进制信息： ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    // 监听连接关闭
    connection.on('close', function (reasonCode, description) {
        console.log('断开连接');
    });
});
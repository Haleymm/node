// 多终端通过websocket通信
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 9001;
// 储存终端的连接
var clients = [];

var server = http.createServer();

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

    // 把连接添加到终端
    clients.push(connection);

    // 监听有收到message
    connection.on('message', function (message) {

        if (message.type === 'utf8') {
            console.log('收到utf-8信息： ' + message.utf8Data);

            clients.forEach((item) => {
                item.sendUTF(message.utf8Data)
            })
        }
        else if (message.type === 'binary') {
            console.log('收到二进制信息： ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });





    // 监听连接关闭
    connection.on('close', function (reasonCode, description) {
        console.log('断开连接');
        // 获取当前索引
        let index = clients.indexOf(connection);
        clients.splice(index, 1)
    });
})
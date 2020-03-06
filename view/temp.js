// 轮询
setInterval(function() {
    $.get("/path/to/server", function(data, status) {
        console.log(data);
    });
}, 10000);

// 轮询
function poll() {
    setTimeout(function() {
        $.get("/path/to/server", function(data, status) {
            console.log(data);
            // 发起下一次请求
            poll();
        });
    }, 10000);
}

// 长轮询
//向后台长轮询消息
function longPolling(){
    $.ajax({
        async : true,//异步
        url : 'longPollingAction!getMessages.action', 
        type : 'post',
        dataType : 'json',
        data :{},
        timeout : 30000,//超时时间设定30秒
        error : function(xhr, textStatus, thrownError) {
            longPolling();//发生异常错误后再次发起请求
        },
        success : function(response) {
            message = response.data.message;
            if(message!="timeout"){
                broadcast();//收到消息后发布消息
            }
            longPolling();
        }
    });
}
// 引入必要的模块
var express = require('express');
var app = express();

function ipv6ToV4(ip) {
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
    return ip
}
// 创建一个路由
app.get('/', function(req, res) {
    let ip = req.ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(',')[0];
    }
    let data = {
        ip: ipv6ToV4(ip)
    }
    res.send(data)
});

// 监听3000端口
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});
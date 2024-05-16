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
        ip: ipv6ToV4(ip),
        address: "无此IP地址"
    }
    let addressFlag = getIpAddress(data.ip)
    if (addressFlag === 1) {
        data.address = "呈贡校区"
    }
    if (addressFlag === 2) {
        data.address = "东陆校区"
    }
    res.send(data)
});

function ipToInt(ip) {
    const parts = ip.split('.');
    return (parseInt(parts[0]) << 24) + (parseInt(parts[1]) << 16) + (parseInt(parts[2]) << 8) + parseInt(parts[3]);
}

function getIpAddress(ip) {
    const cgSubnets = [
        "113.55.0.0/17",
        "10.50.0.0/17",
        "10.100.0.0/16",
        "10.103.0.0/16",
        "10.244.0.0/16",
        "10.245.0.0/16"
    ]
    const dlSubnets = [
        "202.127.253.128/26",
        "202.203.208.0/20",
        "222.19.192.0/19",
        "222.19.224.0/20",
        "10.50.128.0/17",
        "10.99.0.0/16",
        "10.252.0.0/16",
        "10.253.0.0/16"
    ]
    // 地址位置，0.无此地址位置， 1.呈贡校区 2.东陆校区
    let addressFlag = 0
    cgSubnets.forEach(subnet => {
        if(isIpInSubnet(ip, subnet)) {
            addressFlag = 1
        }
    })
    dlSubnets.forEach(subnet => {
        if(isIpInSubnet(ip, subnet)) {
            addressFlag = 2
        }
    })
    return addressFlag
}

function isIpInSubnet(ip, subnet) {
    const [subnetIp, mask] = subnet.split('/');
    const ipInt = ipToInt(ip);
    const subnetIpInt = ipToInt(subnetIp);
    const maskInt = -1 << (32 - parseInt(mask));

    return (ipInt & maskInt) === (subnetIpInt & maskInt);
}

// 监听3000端口
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});
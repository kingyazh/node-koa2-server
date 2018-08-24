let PORT = 3000;

let http = require('http');
let https = require('https');
let url=require('url');
let fs=require('fs');
let mine=require('./mine').types;
let path=require('path');
let httpProxy = require('http-proxy');

let proxy = httpProxy.createProxyServer({
    target: 'http://192.168.10.38:8180/',   //接口地址
    // 下面的设置用于https
    // ssl: {
    //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
    //     cert: fs.readFileSync('server.crt', 'utf8')
    // },
    // secure: false
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});


var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, function (req, res) {
    res.end('secure!');
}).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);


let proxy_http = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 80
    }
});

let proxy_https = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 443
    }
});

// http.createServer(function(req, res) {
//     console.log(req.headers.host)
//     if (req.headers.host === 'localhost') {
//         proxy_web.proxyRequest(req, res);
//         proxy_web.on('error', function(err, req, res) {
//             if (err) console.log(err);
//             res.writeHead(500);
//             res.end('Oops, something went very wrong...');
//         });
//     } else if (req.headers.host === '127.0.0.1') {
//         // PORT = 443;
//         proxy_api.proxyRequest(req, res);
//         proxy_api.on('error', function(err, req, res) {
//             if (err) console.log(err);
//             res.writeHead(500);
//             res.end('Oops, something went very wrong...');
//         });
//     }
// }).listen(PORT);


// 新建一个代理 Proxy Server 对象  
var proxy = httpProxy.createProxyServer({});  
  
// 捕获异常  
proxy.on('error', function (err, req, res) {  
  res.writeHead(500, {  
    'Content-Type': 'text/plain'  
  });  
  res.end('Something went wrong. And we are reporting a custom error message.');  
});  
    
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发  
var server = require('http').createServer(function(req, res) {  
  // 在这里可以自定义你的路由分发  
  var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;  
  console.log("client ip:" + ip + ", host:" + host);  
    
  switch(host){  
    case 'www.111.cn':   
        proxy.web(req, res, { target: 'http://localhost:80' });  
    break;  
    case 'vote.111.cn':  
        proxy.web(req, res, { target: 'http://localhost:443' });  
    break;
    default:  
        res.writeHead(200, {  
            'Content-Type': 'text/plain'  
        });  
        res.end('Welcome to my server!');  
  }  
});  
  
console.log("listening on port 80")  
server.listen(80);
console.log('PORT')





console.log("Server runing at port: " + PORT + ".");
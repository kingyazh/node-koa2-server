let PORT = 80;

let http = require('http');
let url=require('url');
let fs=require('fs');
let mine=require('./mine').types;
let path=require('path');
let httpProxy = require('http-proxy');

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

http.createServer(function(req, res) {
    console.log(req.headers.host)
    if (req.headers.host === 'localhost') {
        proxy_web.proxyRequest(req, res);
        proxy_web.on('error', function(err, req, res) {
            if (err) console.log(err);
            res.writeHead(500);
            res.end('Oops, something went very wrong...');
        });
    } else if (req.headers.host === '127.0.0.1') {
        // PORT = 443;
        proxy_api.proxyRequest(req, res);
        proxy_api.on('error', function(err, req, res) {
            if (err) console.log(err);
            res.writeHead(500);
            res.end('Oops, something went very wrong...');
        });
    }
}).listen(PORT);
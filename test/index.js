import http from 'http';
import fs from 'fs';
import AdataFlowSSR from '../src/AdataFlowSSR.js';

const framework = new AdataFlowSSR({
    wwwroot: "./test"
});

http.createServer((req, res) => {
    framework.handle({
        path: req.url,
        headers: req.headers
    });

    framework.on('head', head => {
        res.writeHead(head.code, head.headers.toObject());
    });

    framework.on('data', data => {
        res.write(data);
    });

    framework.on('end', () => {
        res.end();
    });
}).listen(80, () => {
    console.log('Server running on port 80');
});
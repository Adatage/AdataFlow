import http from 'http';
import fs from 'fs';
import AdataFlowSSR from '../src/AdataFlowSSR.js';

const framework = new AdataFlowSSR({
    wwwroot: "./test"
});

const server = http.createServer((req, res) => {
    framework.handle({
        path: req.url,
        headers: req.headers
    });

    framework


    const path = "./test"+req.url;
    const r = {
        code: 200,
        type: "text/html",
        body: ""
    };
    try {
        const data = fs.readFileSync(path);
        r.body = data;
    } catch(e) {
        r.code = 500;
        r.type = "plain/text";
        r.body = JSON.stringify(e);
    }
    res.writeHead(r.code, { 'Content-Type': r.type });
    res.write(r.body);
    res.end();
}).listen(80, () => {
    console.log('Server running on port 80');
});
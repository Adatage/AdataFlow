const http = require('http');
const fs = require('fs');
const AdataFlowSSR = require('../src/AdataFlowSSR.js').default;

const framework = new AdataFlowSSR({

});

const server = http.createServer((req, res) => {
    const request = {
        path: req.url,
        
    };
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
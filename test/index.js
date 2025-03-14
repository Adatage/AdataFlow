const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
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
}).listen(3000, () => {
    console.log('Server running on port 3000');
});
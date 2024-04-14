const http = require('http');
const fs = require('fs');

const PORT = 4000;

http.createServer(function (request, response) {
    console.log('request starting...', new Date());

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    if (request.method === 'OPTIONS') {
        response.writeHead(204, headers);
        response.end();
        return;
    }

    const filePath1 = './videos/cam1' + request.url;
    const filePath2 = './videos/cam2' + request.url;
    const filePath3 = './videos/cam3' + request.url;

    fs.readFile(filePath1, function (error1, content1) {
        fs.readFile(filePath2, function (error2, content2) {
            fs.readFile(filePath3, function (error3, content3) {
                if (!error1 && content1) {
                    response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
                    response.end(content1, 'utf-8');
                } else if (!error2 && content2) {
                    response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
                    response.end(content2, 'utf-8');
                } else if (!error3 && content3) {
                    response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
                    response.end(content3, 'utf-8');
                } else {
                    const error = error1 || error2 || error3;
                    if (error && error.code == 'ENOENT') {
                        fs.readFile('./404.html', function (error, content) {
                            response.writeHead(404, { 'Content-Type': 'text/html' });
                            response.end(content, 'utf-8');
                        });
                    } else {
                        response.writeHead(500);
                        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    }
                }
            });
        });
    });

}).listen(PORT);

console.log(`Server listening PORT ${PORT}`);

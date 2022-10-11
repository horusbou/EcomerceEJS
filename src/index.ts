const http = require("http")
const fs = require('fs').promises;

const server = http.createServer((req,res)=>{
    const url = req.url;
    res.setHeader('Content-Type','text/html');
    if (url === '/') {
        res.write('<html>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">send</button></form></body>')
        res.write('</html>');
        return res.end();
    }
    if(url ==='/message' && req.method=== 'POST'){
        const body = [];
        req.on('data', (chunk)=>{
            body.push(chunk)
        })
      return  req.on('end',async ()=>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            // fs.writeFile('message.txt', message,(err)=>{
            //     res.statusCode = 302;
            //     res.setHeader('Location','/');
            //    return res.end();
            // });
            await fs.writeFile('message.txt',message)
                res.statusCode = 302;
                res.setHeader('Location','/');
               return res.end();
        })

    }
})
server.listen(3000);
console.log(`The HTTP Server is running on port 3000`);

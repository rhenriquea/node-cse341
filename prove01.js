const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res)  => {
  const { url, method } = req;
  res.setHeader('Content-Type', 'text/html');
 
  if(url === '/') {
    res.write(`
      <html>
        <head><title>Assignment 1</title></head>
        <body>
          <form action="/create-user" method="POST">
            <input type="text" name="username" />
            <button type="submit">Send</button>
          </form>
        </body>
      </html>
    `);
    return res.end();
  }
  
  if(url === '/users') {
    res.write(`
      <html>
        <head><title>Assignment 1</title></head>
        <body>
          <ul>
            <li>User 1</li>
            <li>User 2</li>
          </ul>
        </body>
      </html>
    `);
    return res.end();
  }

  if(url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody.split('=')[1]);
    });

    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }

  res.write(`<h1>Page not found</h1>`);
  res.end();

});

server.listen(PORT);
console.log(`Server listening on http://localhost:${PORT}`)

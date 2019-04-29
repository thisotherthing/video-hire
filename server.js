const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// TODO setup sockets for communication https://github.com/sergiodxa/next-socket.io

app.prepare().then(() => {
  const server = express()

  server.get("*", (req, res) => {
    return handle(req, res);
  })

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

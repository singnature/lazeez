const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  if (pathname === "/") {
    fs.readFile("index.html", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (pathname === "/lazeez.css") {
    fs.readFile("lazeez.css", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (pathname === "/lazeez.js") {
    fs.readFile("lazeez.js", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      } else if (pathname.startsWith("/imgs/")) {
        const imgPath = pathname.slice(6); // remove '/imgs/' from the path
        const ext = imgPath.split(".").pop(); // get the file extension
        const contentType = `image/${ext}`;

        fs.readFile(`imgs/${imgPath}`, (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Image not found");
          } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
          }
        });
      }

      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(data);
    });
  } else if (pathname === "/submit-form") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Raw body:", body);

      try {
        const { name, phone, item } = JSON.parse(body);
        console.log("Parsed body:", { name, phone, item });

        // Save the data to a JSON file
        const data = JSON.stringify({ name, phone, item });
        fs.writeFile("orders.json", data, (err) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Error saving data");
          } else {
            console.log("Data saved successfully");
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(`
              <html>
                <head>
                  <title>Form submitted</title>
                </head>
                <body>
                  <script>
                    alert('Form submitted!');
                    window.location.href = '/';
                  </script>
                </body>
              </html>
            `);
          }
        });
      } catch (err) {
        console.error(err);
        res.statusCode = 400;
        res.end("Invalid JSON data");
      }
    });
  } else if (pathname === "/orders") {
    // Code for showing all the orders
    fs.readFile("orders.json", (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Error reading data");
        return;
      }

      const orders = JSON.parse(data);
      const orderList = orders
        .map((order) => {
          return `
          <tr>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td>${order.item}</td>
          </tr>
        `;
        })
        .join("");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <head>
            <title>Orders</title>
          </head>
          <body>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                ${orderList}
              </tbody>
            </table>
          </body>
        </html>
      `);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));

const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile("index.html", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

app.post("/submit-form", (req, res) => {
  try {
    fs.readFile("orders.json", "utf8", (err, data) => {
      if (err) {
        throw new Error("Can't read file");
      }
      const oldData = data ? JSON.parse(data) : [];
      oldData.push(req.body);

      fs.writeFile("orders.json", JSON.stringify(oldData), (err) => {
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
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 400;
    res.end("Invalid JSON data");
  }
});

app.get("/orders", (req, res) => {
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
});

app.use((req, res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Page not found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

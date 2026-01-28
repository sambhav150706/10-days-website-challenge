const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Folder where static frontend files live
const publicDir = path.join(__dirname, "public");

// Folder and file where we will store orders
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.txt");

// Make sure the data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 1) Middleware to parse JSON bodies
app.use(express.json());

// 2) Serve static frontend (index.html, cart.html, checkout.html, CSS, JS)
app.use(express.static(publicDir));

// 3) Simple API route to receive orders from the frontend
app.post("/api/orders", (req, res) => {
  const body = req.body || {};

  const { name, email, address, items, total } = body;

  if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid order. Please provide your details and at least one item." });
  }

  // Create a plain text representation of the order
  const now = new Date();
  const orderLines = [];
  orderLines.push("========================================");
  orderLines.push(`Time: ${now.toISOString()}`);
  orderLines.push(`Name: ${name}`);
  orderLines.push(`Email: ${email}`);
  orderLines.push(`Address: ${address.replace(/\\r?\\n/g, " ")}`);
  orderLines.push("Items:");
  items.forEach((item) => {
    orderLines.push(
      `  - ${item.title} (id: ${item.id}) x ${item.quantity} @ $${item.price} = $${item.lineTotal}`
    );
  });
  orderLines.push(`Total: $${Number(total).toFixed(2)}`);
  orderLines.push(""); // empty line at end

  const orderText = orderLines.join("\\n");

  // Append to local text file
  fs.appendFile(ordersFile, orderText + "\\n", (err) => {
    if (err) {
      console.error("Error writing order:", err);
      return res.status(500).json({ message: "Failed to save order. Please try again." });
    }

    return res.json({ message: "Order placed successfully! We have saved it on the server." });
  });
});

// 4) Fallback: always serve index.html for unknown routes to make navigation easier (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Mini shop server listening on http://localhost:${PORT}`);
});


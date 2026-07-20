import express from "express";

const app = express();

app.use(express.json());

// POST balance

app.listen(5000, () => {
  console.log("Topup server listening on PORT 5000.");
});

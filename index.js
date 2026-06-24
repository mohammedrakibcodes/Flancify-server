require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./src/db/db");

const app = express();
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const proposalRoutes = require("./src/routes/proposalRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/proposals", proposalRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Flancify Server Running");
});

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(` Server running on port ${port}`);
  });
});

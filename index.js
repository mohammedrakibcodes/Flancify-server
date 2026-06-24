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
const reviewRoutes = require("./src/routes/reviewRoutes");
const statsRoutes = require("./src/routes/statsRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/proposals", proposalRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Flancify Server Running");
});

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(` Server running on port ${port}`);
  });
});

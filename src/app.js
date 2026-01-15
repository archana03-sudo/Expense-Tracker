console.log("app.js loaded");

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ❗ MUST BE LAST
app.use(errorHandler);

module.exports = app;
 
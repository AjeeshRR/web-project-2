const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routers/userRouter");
const mobileRouter = require("./routers/mobileRouter");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routers at the same paths your tests expect
app.use("/user", userRouter);
app.use("/mobile", mobileRouter);

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mobiledb";
if (require.main === module) {
  mongoose
    .connect(MONGO_URL, { dbName: "mobiledb" })
    .then(() => {
      app.listen(8080, () => console.log("Backend running on :8080"));
    })
    .catch((err) => {
      console.error("Mongo error", err);
      process.exit(1);
    });
}

module.exports = app;

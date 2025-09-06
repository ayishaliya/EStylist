const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/userRoute");
const otherRouter = require("./routes/otherRoute");
const tipRouter = require("./routes/tipsRoute");
const forgotRouter = require("./routes/forgotRoute");
const outfitRouter = require("./routes/outfitRoute");

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(console.log("DB Connected"))
  .catch((e) => console.log(e));

//routes
app.use("/api/user", userRouter);
app.use("/api", otherRouter);
app.use("/api/tips", tipRouter);
app.use("/api/main", outfitRouter);
app.use("/api/forgot-password", forgotRouter);

app.listen(PORT, () => {
  console.log("Server listening in on port", PORT);
});

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());

app.use(express.json());


app.use("/api/temp/uploads", express.static(path.join(__dirname, "temp/uploads")));

app.get("/", (req, res) => {
  res.send("Node.js API is running!");
});

app.use("/api", require("./routes/index"));

app.use((err, req, res, next) => {
  console.error(err); // for debugging in console

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    errorMessage: err.message || "Internal Server Error",
    errorCode: err.errorCode || 0,      // add errorCode if available, else 0
    errorKey: err.errorKey || "internal_server_error", // add errorKey if available
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require("dotenv").config();
const path = require("path")
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

console.log("hi");
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};


app.use(express.json());
app.use(cors());


// Available Routes

app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req,res)=> {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  app.get("/", (req,res)=> {
    res.send("Api Running")
  })
}

app.listen(process.env.PORT ||"5000", () => {
  connect()
  console.log("Listening");

});
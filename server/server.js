const express = require("express");
const path = require("path");
const db = require("../db/db");

const app = express();
const port = 3001;

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build"))); // to access built React project

app.get("/", async (req, res) => {
  const isConnected = await db.checkDB();
  if(isConnected) {
    res.send("DB Connected")
    return
  }
  res.send("DB not Connected");
});

app.get("/music", async (req, res) => {
  const music = await db.getMusic();
  res.send(music);
})

const userRouter = require("./routes/users");
app.use("/users", userRouter);

// All other GET requests not handled before will return static React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




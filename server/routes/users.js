const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User List");
});

router.get("/newUser", (req, res) => {
  res.send("New user");
});

router.post("/", (req, res) => {
  res.send("Create new user");
});

router
  .route("/:id")
  .get((req, res) => {
    req.params.id;
    console.log(req.user);
    res.send(`Get User ${req.params.id}`);
  })
  .put((req, res) => {
    req.params.id;
    res.send(`Update User ${req.params.id}`);
  })
  .delete((req, res) => {
    req.params.id;
    res.send(`Delete User ${req.params.id}`);
  });
const users = [{ name: "John" }, { name: "Jane" }];
router.param("id", (req, res, next, id) => {
  console.log(id);
  req.user = users[id];
  next();
});

module.exports = router;

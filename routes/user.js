const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
router.get("/", isLoggedIn, userController.show);

module.exports = router;

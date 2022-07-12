const express = require('express');
const router = express.Router();
const passport = require("passport");
const loginController = require('../app/controllers/LoginController')

router.get('/login',loginController.login )
router.get('/auth/google', passport.authenticate("google", { scope: ["email", "profile"] }))
router.get('/auth/google/callback', passport.authenticate("google", { failureRedirect: "/" }),loginController.authCallback)
module.exports = router;
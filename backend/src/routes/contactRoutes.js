const express = require("express");
const router = express.Router();

const controller = require("../controllers/contactController");

console.log(controller);

router.post("/contact", controller.sendContactMail);

module.exports = router;
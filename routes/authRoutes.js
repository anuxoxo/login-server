const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { validateToken } = require("../jwt");

router.route("/register")
    .post(authController.register_post);

router.get("/login", validateToken, authController.login_get);
router.post("/login", authController.login_post);

module.exports = router;
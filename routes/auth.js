const { login, register,verifyEmail, autoLogin } = require("../controllers/auth");
const { checkAuth } = require("../middleware/checkAuth");

const router = require("express").Router();

router.post("/login",login);
router.post("/register",register);
router.get('/verifyemail/:email/:token', verifyEmail);
router.get('/autoLogin',checkAuth,autoLogin);

module.exports = router;

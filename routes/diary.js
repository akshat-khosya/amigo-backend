
const { checkAuth } = require("../middleware/checkAuth");

const router = require("express").Router();

router.post("/write");
router.get("/all");


module.exports = router;

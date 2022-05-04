
const { checkAuth } = require("../middleware/checkAuth");

const router = require("express").Router();

router.post("/write");
router.post("/read");


module.exports = router;

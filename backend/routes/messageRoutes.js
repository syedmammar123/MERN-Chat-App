const express = require("express")
const  {protect} = require("../middleware/authMiddleware")
const { getMessage, allMessages } = require("../controllers/messageControllers")

const router = express.Router()

router.route("/").post(protect,getMessage)
router.route("/:chatId").get(protect,allMessages)

module.exports = router;
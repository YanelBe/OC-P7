const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");

router.post("/", auth, commentCtrl.createComment);
router.get("/:postId", auth, commentCtrl.getAllComments);
router.put("/:id", auth, commentCtrl.updateComment);
router.delete("/:id", auth, commentCtrl.deleteComment);

module.exports = router;
const express = require("express");
const { registerUser, authUser,getUserProfile,updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile); 


module.exports = router;

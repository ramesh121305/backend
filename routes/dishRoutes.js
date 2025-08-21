const express = require("express");
const { createDish, getDishes, updateDish, deleteDish } = require("../controllers/dishController");
const { protect, admin } = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/", getDishes);
router.post("/", protect, admin, createDish);
router.put("/:id", protect, admin, updateDish);
router.delete("/:id", protect, admin, deleteDish);

module.exports = router;

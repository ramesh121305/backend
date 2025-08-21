const Dish = require("../models/Dish");

// Create dish (Admin)
exports.createDish = async (req, res) => {
  const dish = await Dish.create(req.body);
  res.status(201).json(dish);
};

// Get all dishes (User/Admin)
exports.getDishes = async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
};

// Update dish (Admin)
exports.updateDish = async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dish);
};

// Delete dish (Admin)
exports.deleteDish = async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ message: "Dish removed" });
};

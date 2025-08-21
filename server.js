dotenv.config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");   // ✅ Added


connectDB();

const app = express();


// ✅ This is important to parse JSON body
app.use(express.json());

// ✅ Enable CORS (allow React frontend to talk to backend)
app.use(cors({
  origin: ["https://frontend-hzfz.onrender.com/"],  // ✅ frontend
  methods: ["GET", "POST", "PUT", "DELETE"],  
  credentials: true,
}));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dishes", require("./routes/dishRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

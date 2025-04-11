import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/user.js";
import PropertyRoutes from "./routes/properties.js";
import ContactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/test', (req, res) => {
  console.log('Received test POST data:', req.body);
  res.json({ message: 'POST request received!', data: req.body });
});

app.use("/api/user", UserRoutes)
app.use("/api/property", PropertyRoutes)
app.use("/api/contact", ContactRoutes)

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("Failed to connect with MongoDB Atlas");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started at 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();

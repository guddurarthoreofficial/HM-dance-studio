import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

connectDB();


// In Express server setup
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // ✅ allow cookies
  })
);



app.get("/",(requestAnimationFrame,resp)=>{
  console.log("hello");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:/${PORT}`);
});

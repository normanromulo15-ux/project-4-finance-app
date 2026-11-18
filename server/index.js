import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.js";
import appRouter from "./routes/protected/app.js";
import userRouter from "./routes/protected/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", appRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routers
import authRouter from "./routes/auth/auth.js";
import appRouter from "./routes/protected/app.js";
import userRouter from "./routes/protected/user.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: "http://localhost:5713",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", appRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth/auth.js";
import homePageRouter from "./routes/protected/home.js";
import cookieParser from "cookie-parser";

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

app.use("/auth", authRouter);
app.use("/home", homePageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth/auth.js";
import homePageRouter from "./routes/protected_routes/home.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/home", homePageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

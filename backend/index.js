import express from "express"
import { register, login } from "./routes/auth.js"
import verifytoken from "./middleware/authMidlleware.js";
import { mongoconnect } from "./db/mongodb.js";
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use((req, res, next) => {
  console.log("Middleware is running");
  next();
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});

mongoconnect();

const router = express.Router();
app.use("/api", router);
router.use(express.json())

router.post("/register", register);
router.post("/login", login);
router.use(verifytoken)

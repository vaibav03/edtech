import express from "express"
import { register, login } from "./routes/auth.js"
import verifytoken from "./middleware/authMidlleware.js";
import { mongoconnect } from "./db/mongodb.js";
import dotenv from "dotenv"
import { delAgents, getAgents } from "./routes/admin.js";
import cors from "cors"

dotenv.config()

const app = express()
app.use(cors())
app.use((req, res, next) => {
  console.log("Middleware is running");
  next();
});

app.listen(8000, () => {
  console.log("App is listening on port 8000");
});

mongoconnect();

const router = express.Router();
app.use("/api", router);
router.use(express.json())

router.post("/register", register);
router.post("/login", login);


router.use(verifytoken)

router.get("/admin", getAgents);
router.post("/admin", delAgents);
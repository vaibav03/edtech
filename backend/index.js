import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { register, login } from "./routes/auth.js";
import verifytoken from "./middleware/authMidlleware.js";
import { mongoconnect } from "./db/mongodb.js";
import { delAgents, getAgents } from "./routes/admin.js";
import { uploadedinternships, deleteinternship , addinternship } from "./routes/agents.js";
dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json()); 
app.use(cors());  
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

mongoconnect(); 

router.post("/register", register);
router.post("/login", login);

router.use(verifytoken);

router.get("/admin", getAgents);
router.post("/admin", delAgents);

router.get("/agent",uploadedinternships);
router.post("/agent",addinternship);
router.delete("/agent",deleteinternship);


// router.get("/student",uploadedinternships);
// router.post("/student",applyInternship);
// router.get("/student/applied",getappliedinternships);

app.use("/api", router);

app.listen(8000, () => {
  console.log("App is listening on port 8000");
});

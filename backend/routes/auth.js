import express from "express";
import bcrypt from "bcrypt"
import User from "../models/user";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, interestedtags } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, interestedtags })
    await user.save();
    return res.status(200).json({ message: "Registration Success" })
  } catch (e) {
    res.status(500).json({ error: "Registration failed" })
  }
})


router.post("/login",async (req,res) =>{
  try{
    const {email,password,role} = req.body;
    const user = User.findOne({email})
    if(!user) return res.status(401).json({message : "Invalid User"});

    const passwordmatch = await bcrypt.compare(password,user.password);

    if(!passwordmatch) 
      return res.status(401).json({error: "Authentication Failed"});

    const token = jwt.sign({userId: user.id, role: user.role },secret_key,{
      expiresIn:'1h',
    })
    res.status(200).json({token,user})
  }catch(e){
    return res.status(500).json({error: "Login failed"})
  }
})
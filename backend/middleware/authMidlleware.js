import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export default function verifytoken(req,res,next){
   const token = req.header('Authorization');
   console.log(token)
  if(!token) return res.status(401).json({error: "Access Denied"});
  try{
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    req.userId = decoded.userId;
    next();
  }catch(e){
    console.log(e)
    res.status(401).json({error: 'Invalid Token'})
  }
}


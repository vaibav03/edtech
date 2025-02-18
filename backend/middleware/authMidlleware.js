import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export default function verifytoken(req,res,token){
   token = req.header('Authorization');
  if(!token) return res.status(401).json({error: "Access Denied"});
  try{
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    req.userId = decoded.userId;
    next();
  }catch(e){
    res.status(401).json({error: 'Invalid Token'})
  }
}


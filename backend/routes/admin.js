import user from "../models/user";

export async function getAgents(req,res){
  try{
  const users_agents =  await user.findMany({
    $or: [
      { role: "user" },
      { role: "agent" }
    ]
  });
  console.log(users_agents)
  return res.status(201).json({users_agents});
}catch(e){
  console.log("getagents",e);
  return res.status(500).json({error:"Cannot get agents"});
}
}


export async function delAgents(req,res){
   try{
   const {email} = req.body;
   user.deleteOne({email:email}); 
   return res.status(201).json({message:"Deleting Successful"});
  }catch(e){
    console.log("delagents",e);
    return res.status(500).json({error:"Deletion Unsuccessful"});
  }
}
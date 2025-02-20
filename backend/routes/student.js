export async function getInternships(req,res){
  try{
  const internships =  await internSchema.find();
  return res.status(201).json({internships});
  }catch(e){
    console.log("getinternships",e);
    return res.status(500).json({error:"Cannot get internships"});
  }
}

// export async function applyInternship(req,res){
//   try{
//     const {name,company,position,description,questions,tags,salary,uploadedby} = req.body;
//     const internship = new internSchema({name,company,position,description,questions,tags,salary,uploadedby});
//     await internship.save();
//     return res.status(201).json({message:"Internship added successfully"});
//   }catch(e){
//     console.log(e);
//     return res.status(500).json({error:"Cannot add internship"});
//   }
// }
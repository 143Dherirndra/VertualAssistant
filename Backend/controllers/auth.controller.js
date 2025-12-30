import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

 export const signup= async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        const existEmail= await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"user allReady Exist"})
        }

        if(password<6){
            return res.status({message:"password must be at least 6 charater"})
        }
        const hashPassword= await bcrypt.hash(password,10);



const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword,
});


       const token= await genToken(user._id)

       res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "None",      
  maxAge: 7 * 24 * 60 * 60 * 1000
});

       return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`signup error ${error}`})
    }
}

export const Login= async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(500).json({message:"user does not exist"})
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(500).json({message:"password  does not exist"})
        }
        const token= await  genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            secure: true,       
            sameSite: "None",
        })
        return res.status(200).json(user)
    } catch (error) {
          return res.status(500).json({message:"LOgin error"})
    }
}
export const LogOut= async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"logOut successfully"})
    } catch (error) {
         return res.status(500).json({message:`LogOut Error ${error}`})
    }
}

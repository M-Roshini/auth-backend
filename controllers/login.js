const user = require("../models/user");
//const user =require("../models/user")
const bcrypt=require("bcrypt")
const client = require("../redis")
var jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
dotenv.config()

async function checkUser(email){
    try{
        const  User= await user.findOne({email});
        console.log(User);
        if (User){
            return true;
        }
        return false;
    }catch(e){
        return "Server Busy"
    }
}

async function AuthenticateUser(email,password){
    try{
        const userCheck= await user.findOne({email:email});
        console.log(userCheck)
        const validPassword = await bcrypt.compare(password,userCheck.password);
        console.log(validPassword)
        if (validPassword){
            const token=jwt.sign({email},process.env.login_secret_token)
            const response={
                id:userCheck._id,
                name:userCheck.name,
                email:userCheck.email,
                token:token,
                status:true,
            };

            await client.set(`key-${email}`,JSON.stringify(response))
            await user.findOneAndUpdate(
                {email:userCheck.email},
                {$set:{token:token}},
                {new:true}
                )
                    return response;
        }
        return "Invalid User name and Password"
    }catch(e){
        console.log(e)
        return "Server Busy"
    }
}
async function AuthorizeUser(token){
    try{
        const decodedToken = jwt.verify(token,process.env.login_secret_token)
        console.log("decoded",decodedToken)
        if (decodedToken){
            const email=decodedToken.email;
            const auth = await client.get(`key-${email}`)
            if (auth){
                const  data=JSON.parse(auth)
                return data
            }else{
                const data=await user.findOne({email:email});
                return data
            }
        }
        return false
    }catch(e){
        console.log(e)
    }
        
}

module.exports={checkUser,AuthenticateUser,AuthorizeUser};
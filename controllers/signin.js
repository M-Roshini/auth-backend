const user =require("../models/user")

const {sendMail}=require("./sendmail")
const bcrypt=require("bcrypt")
const mongoose=require("mongoose")
var jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
const verifyuser = require("../models/verifyuser");
dotenv.config()


async function InsertVerifyUser(name,email,password){
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const token=generateToken(email);

        const newuser= new verifyuser({
                name:name,
                email:email,
                password: hashedPassword,
                token:token
        })

        const activationLink=`http://localhost:4000/signin/${token}`;
        const content=`<h4> hi,there </h4>
        <h5>Welcome to the app</h5> 
        <p> Thankyou for signing up. click on the below link to activate</p>
        <a href=" ${activationLink}"> clickhere</a>
        <p>Regards</p> 
        <p>Team</p>`

        await newuser.save();
        sendMail(email,"verifyuser",content)

    }
    catch(e){
            console.log(error);
    }
}

function generateToken(email){
    const token =jwt.sign(email,process.env.signup_Secret_Token)
    return token
}

async function InsertSignUser(token){
    try{
        const userVerify=await verifyuser.findOne({token:token})
    if (userVerify) {
        const newUser=  new user ({
            name: userVerify.name,
            email:userVerify.email,
            password: userVerify.password,
            forgetPassword:{}
        });
        await newUser.save();
        await userVerify.deleteOne({token:token});
        const content = `<h4> Registration Successfull </h4>
        <h5>Welcome to the app</h5> 
        <p> You are successfully registered</p>
        <p>Regards</p> 
        <p>Team</p>`;
        sendMail(newUser.email,"Registration Successful",content)
        return `<h4> hi,there </h4>
        <h5>Welcome to the app</h5> 
        <p> You are successfully registered</p>
        <p>Regards</p> 
        <p>Team</p>`
    }
    return `<h4> Registration Failed </h4> 
        <p> Link expired...</p>
        <p>Regards</p> 
        <p>Team</p>`
    }catch(e){
        console.log(error);
        return `<html>
        <body>
        <h4> Registration Failed </h4> 
        <p> Unexpected error happened...</p>
        <p>Regards</p> 
        <p>Team</p>
        </body>
        <html>`

    }
}

 module.exports={InsertVerifyUser,InsertSignUser};
 


const express = require("express");
const {AuthorizeUser } = require("../controllers/login");
const router = express.Router();


router.get("/",async(req,res) =>{
    try{
        const auth_token= await req.headers.authorization;
        console.log("received: ",req.headers.authorization)
        const loginCredentials =  await AuthorizeUser(auth_token);
        console.log("rec:",loginCredentials)
        if (loginCredentials === false){
            res.status(200).send("Invalid Token")
        }else{
            res.json(loginCredentials);
            //res.status(200).send(loginCredentials)
        }
    }catch(e){
        console.log(e);
        res.status(400).send("Server Busy")
    }
})

module.exports=router;
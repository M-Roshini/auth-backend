const express = require("express");
const { checkUser } = require("../controllers/login");
const { InsertVerifyUser, InsertSignUser } = require("../controllers/signin");
var router = express.Router();

router.get("/:token",async(req,res) =>{
    try{
        const response = await InsertSignUser(req.params.token)
        res.status(200).send(response)
    }catch(e){
        console.log(e)
        res.status(500).send(`<html>
        <body>
        <h4> Registration Failed </h4> 
        <p> Link expired...</p>
        <p>Regards</p> 
        <p>Team</p>
        </body>
        <html>`)
    }
});

router.post("/verify",async(req,res) => {
    try{
        const {name,email,password}=await req.body;
        console.log(name,password,email);
            const registercredentials = await checkUser(email);
                if (registercredentials === false){
                    await InsertVerifyUser(name,email,password);
                    res.status(200).send(true);
        }else if (registercredentials === true){
            res.status(200).send(false)
        }else if (registercredentials === "Server Busy"){
            res.status(500).send("Server Busy");
        }
    } catch(e){

    }
});

module.exports=router;
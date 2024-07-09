const express = require("express")

const router = express.Router()
const Post = require("../models/Post")//we are importing the post model
const User = require("../models/User")//we are importing the post model

const adminLayout = "../views/layouts/admin";


/**GET
 * login page
 *  */ 


router.get('/admin', async(req,res) =>{
    try{


        const locals = {//this is a object 
            title: "Admin",
            description : "simple blog created with nodejs , express and mongodb",
        }

        res.render("admin/index",{locals,layout: adminLayout})//fromhere we can render the local data 
    }
    catch(error){
        console.log(error)
    }
});


/**Post admin chaeck again
 *  */ 


router.post('/admin', async(req,res) =>{
    try{
        const {username, password } = req.body;
        console.log(req.body);
        res.redirect("/admin")
        }
    catch(error){
        console.log(error)
    }
});







module.exports = router;
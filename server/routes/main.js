const express = require("express")

const router = express.Router()


//routes

router.get('',(req,res) =>{
    const locals = {//this is a object 
        title: "NodeJs Blog",
        description : "simple blog created with nodejs , express and mongodb",
    }
    res.render("index",{locals})//fromhere we can render the local data 
});

router.get('/about',(req,res) =>{
    res.render("about")
});

module.exports = router
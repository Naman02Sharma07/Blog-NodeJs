const express = require("express")

const router = express.Router()
const Post = require("../models/Post")//we are importing the post model
const User = require("../models/User")//we are importing the post model
const bcrypt = require("bcrypt")//encryption of the password 
const jwt = require("jsonwebtoken")
const adminLayout = "../views/layouts/admin";//import ing the admin layout 
const jwtSecret = process.env.JWT_SECRET;



/**check the login 
 *  */ 


const authMiddleware = (req,res,next) => {//next is used to pass the control to the next middleware 
    const token = req.cookies.token;//extract the token from the cookies 

    if(!token){
        res.status(401).json({
            mesaage:"Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);//here we are verifying the token using the jwtsecret key 
        req.userId = decoded.userId;//here userId is the data part that we store that means here we are using that userid that we store 
        //in out jwt token and now we are checking that by decoding it 
        next();
    }
    catch(error)
    {
        res.status(401).json({
            mesaage:"Unauthorized"
        })
    }

}








/**GET
 * login page
 *  */ 


router.get('/admin', async(req,res) =>{
    try{


        const locals = {//this is a object 
            title: "Admin",
            // description : "simple blog created with nodejs , express and mongodb",
        }

        res.render("admin/index",{locals,layout: adminLayout})//from here we can render the local data 
        //rendering basically means that we are retriving the data and sending to the will the we put under the "" 
    }
    catch(error){
        console.log(error)
    }
});


/**Post admin chaeck again
 *  */ 

router.post('/admin', async(req,res) =>{
    try{
        const {username, password } = req.body;//we are requsting this and store it in the username and password 
        const user = await User.findOne({username});
        if(!user){
            res.status(401).json({message:"invalid credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            res.status(401).json({mesaage:"invalid credential"})
        }
        const token = jwt.sign({userId:user._id},jwtSecret);//here i am creating the jwt token and the the data part would store the uerid here 
        res.cookie("token",token,{httpOnly: true});//method to set the cookie in response 
        //"token" this is the name of the cookie 
        //httpsonly preven the client side to access the token
        res.redirect("/dashboard")//in response the user get redirect to the dashboard 
        }
    catch(error){
        console.log(error)
    }
});



/**get the dashboard
 *  */ 

router.get('/dashboard',authMiddleware ,async(req,res) =>{
    try{
        const locals = {
            title: "Dashboard",
            description: "sample blog created by nodehs and mongodb"
        }
        const data = await Post.find();
        res.render("admin/dashboard",{
            locals,
            data,
            layout: adminLayout
        })
    }
    catch(error){
        console.log(error);
    }
});



/**GET admin create a new post or i would say add a new post 
 *  */ 

router.get('/add-post',authMiddleware ,async(req,res) =>{
    try{
        const locals = {
            title: "Dashboard",
            description: "sample blog created by nodehs and mongodb"
        }
        const data = await Post.find();
        res.render("admin/add-post",{
            locals,
            layout: adminLayout
        })
    }
    catch(error){
        console.log(error);
    }
});




/**POST the things that we put in the data we have to put them in the database 
 *  */ 

router.post('/add-post',authMiddleware ,async(req,res) =>{
    try{
        try{
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            })
            await Post.create(newPost);
            res.redirect("/dashboard")
        }
        catch(error){
            console.log(error);
        }
    }
    catch(error){
        console.log(error);
    }
});





// router.post('/admin', async(req,res) =>{
//     try{
//         const {username, password } = req.body;//we are requsting this and store it in the username and password 
//         console.log(req.body);//we are printing it to confirm 
//         res.redirect("/admin")//as a response we are coming back to teh same page 
//         }
//     catch(error){
//         console.log(error)
//     }
// });

/**register the admin 
 *  */ 


router.post('/register', async(req,res) =>{
    try{
        const {username, password } = req.body;//we are requsting this and store it in the username and password 
        const hashedPassword = await bcrypt.hash(password,10);//this willl decrypt the passwrod 
        //the parameters int he brypt the first one is the password that we want to decrypt the second one would be the number of rounds we want to run a cycle to convert the string into the hascode 
//exmple naman-> jhdsbhdf -> sjbdcjhsdb ->sjdvcjhbdc so and so 10 times so it's so much hard to crack the pssword by brute force 
        try{
            const user = await User.create({username,password:hashedPassword});
            res.status(201).json({message: "User Created",user});
        }
        catch(error){
            if(error.code === 11000){//this represent the duplicacy that mean the user already exist
                res.status(409).json({message:"user already in use"});
            }
            res.status(500).json({message:"internal server error"})
        }
    }
    catch(error){
        console.log(error)
    }
});


/**GET->PUT/ this is about editing the blog page 
 *  */ 
router.get('/edit-post/:id',authMiddleware ,async(req,res) =>{
    try{
       const locals = {
        title:"Edit Post",
        description: "free NodeJs user management System",
       }

       const data = await Post.findOne({_id: req.params.id});

       res.render("admin/edit-post",{
        locals,
        data,
        layout: adminLayout
       })
    }
    catch(error){
        console.log(error);
    }
});






/**PUT/ this is about editing the blog page 
 *  */ 

router.put('/edit-post/:id',authMiddleware ,async (req,res) =>{
    try{
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            UpdatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    }
    catch(error){
        console.log(error);
    }
});




/**DELETE the blog page 
 *  */ 



router.delete("/delete-post/:id",authMiddleware,async(req,res)=> {
    try{
        await Post.deleteOne({_id:req.params.id});
        res.redirect("/dashboard");
    }
    catch(error){
        console.log(error)
    }
})


/**DELETE the blog page 
 *  */ 



router.get("/logout",async(req,res)=> {
    res.clearCookie("token")
    res.json({message:"logout successful"})
    // res.redirect("/"); //here i get an error
})













module.exports = router;
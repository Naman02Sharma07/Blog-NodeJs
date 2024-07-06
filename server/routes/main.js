const express = require("express")

const router = express.Router()
const Post = require("../models/Post")//we are importing the post model



/**GET
 * hOME
 *  */ 


router.get('', async(req,res) =>{//if we give this request
    try{
        const locals = {//this is a object 
            title: "NodeJs Blog",//then we get these things 
            description : "simple blog created with nodejs , express and mongodb",
        }
        let perpage = 3;//the number of points or the blogs that gonna appear to us would be 3 
        let page = req.query.page || 1;//some thing soemthing



        //this is some complex thing i would look into the future 



        const data = await Post.aggregate([{ $sort: {createdAt: -1}}])//this is that data that we see in the index.ejs
        .skip(perpage * page - perpage)
        .limit(perpage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perpage)

        res.render('index',{//we are rendering the file here 
            locals,
            data,
            current:page,
            nextPage: hasNextPage ? nextPage : null
        })

    }
    catch(error){
        console.log(error)
    }
});





// router.get('', async(req,res) =>{
//     const locals = {//this is a object 
//         title: "NodeJs Blog",
//         description : "simple blog created with nodejs , express and mongodb",
//     }
//     try{
//         const data = await Post.find();
//         res.render("index",{locals,data})//fromhere we can render the local data 
//     }
//     catch(error){
//         console.log(error)
//     }
// });




/**GET
 * post id
 *  */ 

router.get('/Post/:id', async(req,res) =>{
    try{
        const locals = {
            title: "NodeJs Blog",
            description : "simple blog created with nodejs , express and mongodb",
        }

        let  slug = req.params.id;

        const data = await Post.findById({_id : slug});
        res.render("post",{locals,data})
    }
    catch(error){
        console.log(error)
    }
});

/**post - search term that we get when we put the data 
 * hOME
 *  */



// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "bloging website",
//             body:"I am gonna build it by today"
//         },
//         {
//             title: "netflix clone",
//             body:"netflix close with the backend"
//         },
//         {
//             title: "ecommerce website",
//             body:"build something better then the flipkart "
//         },
//         {
//             title: "super website",
//             body:"supe hero fan club could be a grat idea"
//         },
//         {
//             title: " website",
//             body:"ultimate 10 website course"
//         },
//     ])
// }
// insertPostData();




router.get('/about',(req,res) =>{
    res.render("about")
});

module.exports = router;
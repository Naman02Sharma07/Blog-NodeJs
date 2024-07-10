//this is the routing file where we put all our api 

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
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: "/"
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

router.get('/Post/:id', async(req,res) =>{//this is another route we are red the user id 
    try{
        const locals = {
            // title: "NodeJs Blog",
            // description : "simple blog created with nodejs , express and mongodb",
        }

        let  slug = req.params.id;//a variable the store the id of the blog title that we click 
        //now we find the data that the user search for the id from the database 
        const data = await Post.findById({_id : slug});//await allow us to sop the function until the promise we get from the function that we use to find the the post by the id
        res.render("post",{locals,data,
            currentRoute : "/Post"
        })//we are rendering the file that include these two things in the post.ejs that we have created in the view folder 
    }
    catch(error){//this is the conditon to solve any if we get while during our code

        console.log(error)
    }
});

/**post - search term that we get when we put the data 
 * hOME
 *  */


router.post('/search', async(req,res) =>{
    try{


        const locals = {//this is a object 
            title: "search",
            description : "simple blog created with nodejs , express and mongodb",
        }
        let searchTerm = req.body.searchTerm;//this means in search term we are storing the request the user writting
        const searchSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")//this statement will replace all the special character with an empty string
        // console.log(searchTerm)
        // res.send(searchTerm)//this is what we get in response to the thing that we type in the search bar 
        const data = await Post.find({//now here we are finding the data based on that search from the database 
            $or: [
                {title:{$regex: new RegExp(searchSpecialChar,'i')}},
                {body:{$regex: new RegExp(searchSpecialChar,'i')}},
            ]
        })
        //for response we are rendering the data in the search.ejs file that we create in the view 
        res.render("Search",{//this is what we are asking from the search file that is the data and the locals 
            data,
            locals,
            currentRoute : "/Search"
        })
    }
    catch(error){
        console.log(error)
    }
});



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
    res.render("about",{
        currentRoute : "/about"
    })
});

module.exports = router;
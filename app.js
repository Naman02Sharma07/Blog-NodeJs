//app.js is basically the stating point of the file, somethimes it's the server.js

require("dotenv").config()//now we are able to use dotenv in our application

const express = require("express")//THIS mean now e import th express server
const expressLayout = require("express-ejs-layouts")
const methodOverride = require("method-override")
const {isActiveRoute} = require("./server/helpers/routeHelper")
const cookieParser = require("cookie-parser")//this for the cookie
const MongoStore = require("connect-mongo")

const session = require("express-session")
const connectDB = require("./server/config/db")//now we are integrating the database here 
const app = express()
const PORT = 3000 || process.env.PORT;
connectDB();//now using this our databse connects
app.use(express.static("public"))//this allow us to not goback in the file just directly access all the file by simple put their parent file name by a single slash
app.use(express.urlencoded({extended:true}))
app.use(express.json())//a middle ware that wllow use to show the output in the json format 
app.use(cookieParser("Keyboard cat"))//the thing inside the brackests would ebsame as that of the session thing as this is the new update
//templating engine
app.locals.isActiveRoute = isActiveRoute;

app.use(methodOverride("_method"));
app.use(expressLayout)//we are using the library
app.set("layout","./layouts/main")
app.use(session({
    secret:"Keyboard cat",//this is just a place holder
    resave: false,
    saveUninitialized:true,//this means that the session would create even though we don't add anything 
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
}));
// app.use(session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized:true,
//     store: MongoStore.create({
//         mongoUrl:process.env.MONGODB_URL
//     })
// }))
app.set("view engine","ejs")


app.use("/",require("./server/routes/main"))//this should be the route 
app.use("/",require("./server/routes/admin"))//this should be the route 


app.listen(PORT, ()=>{
    console.log(`app is listening at the ${PORT}`)
})


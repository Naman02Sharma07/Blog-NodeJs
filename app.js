//app.js is basically the stating point of the file, somethimes it's the server.js

require("dotenv").config()//now we are able to use dotenv in our application

const express = require("express")//THIS mean now e import th express server
const expressLayout = require("express-ejs-layouts")

const connectDB = require("./server/config/db")//now we are integrating the database here 
const app = express()
const PORT = 3000 || process.env.PORT;
connectDB();//now using this our databse connects
app.use(express.static("public"))//this allow us to not goback in the file just directly access all the file by simple put their parent file name by a single slash
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//templating engine
app.use(expressLayout)//we are using the library
app.set("layout","./layouts/main")
app.set("view engine","ejs")


app.use("/",require("./server/routes/main"))//this should be the route 

app.listen(PORT, ()=>{
    console.log(`app is listening at the ${PORT}`)
})


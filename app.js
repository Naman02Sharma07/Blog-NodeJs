require("dotenv").config()//now we are able to use dotenv in our application

const express = require("express")//THIS mean now e import th express server
const expressLayout = require("express-ejs-layouts")


const app = express()
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"))

//templating engine
app.use(expressLayout)
app.set("layout","./layouts/main")
app.set("view engine","ejs")


app.use("/",require("./server/routes/main"))

app.listen(PORT, ()=>{
    console.log(`app is listening at the ${PORT}`)
})


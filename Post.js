const mongoose = require("mongoose")//this is out database modal

const Schema = mongoose.Schema;//we are using this schema property from the mongoose 
//schema property alllow you to define the structure of your model of that particular page 
const PostSchema = new Schema({//this will create a new instance of your schema class 
    title:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    UpdatedAt:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Post",PostSchema);
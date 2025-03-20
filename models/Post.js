const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        max:100
    },
    description:{
        type:String,
        required:true,
        max:500
    },
    likes:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        ref:'users',  //reference to the user model
        required:true
    },
})

module.exports = mongoose.model('posts', PostSchema)

const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verifyToken = require('../verifyToken')

//POST (Create data)
router.post('/', verifyToken, async(req, res)=>{
    const postData = new Post({
        title:req.body.title,
        description:req.body.description,
        likes:req.body.likes,
        createdBy:req.body.createdBy
    })

    //try to insert
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

// GET 1 Everything (Read)
router.get('/', async(req, res) =>{
    try{
        const posts = await Post.find()
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET 2 by ID (Read)
router.get('/:postID', async(req, res) =>{
    try{
        const postByID = await Post.findById(req.params.postID)
        res.send(postByID)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// Put (Update)
router.put('/:postID', verifyToken, async(req, res) =>{
    try{
        const post = await Post.findByID(req.params.postID);
        if (!post)
        {
            return res.status(404).send({message: "Post not found"})
        }

        if (post.createdBy.toString() !== req.user._id) 
        {
            return res.status(404).send({message: "User not authorized"})
        }

        const updatePostByID = await Post.findByIDAndUpdate(
            {_id:req.params.postID},
            {$set:{
                title:req.body.title,
                description:req.body.description,
                likes:req.body.likes,
                }
            })
            res.send(updatePostByID)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// Delete 
router.delete('/:postID', verifyToken, async(req, res) =>{
    try{
        const post = await Post.findByID(req.params.postID);
        if(!post) 
        {
            return res.status(404).send({message: "Post not found"})
        }

        if (post.createdBy.toString() !== req.user._id) 
        {
            return res.status(404).send({message: "User not authorized"})
        }

        const deletePostByID = await Post.findByIDAndDelete({_id:req.params.postID})
        res.send(deletePostByID)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router

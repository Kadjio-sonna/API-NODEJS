const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { Post } = require("../models/Post");

const multer = require('../middleware/multer-config');

// CREATE NEW POST
router.post("/", multer, async (req, res, next) => {
    const newPost = new Post({
        ...req.body,
        photo: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    try {
        const savedPost = await newPost.save();

        res.status(201).send(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE POST
router.put("/:id", async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );

                res.status(200).send(updatedPost);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).send({ Error: "You can not updated your post" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE POST
router.delete("/:id", async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await post.delete();

                res.status(200).send("Post has been deleted...");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).send({ Error: "You can not delete your post" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET POST
router.get("/:id", async (req, res, next) => {
    if (req.params.id) {
        try {
            const post = await Post.findById(req.params.id);

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).send({ Error: "Could not find user" });
    }
});

// GET ALL POST
router.get("/", async (req, res, next) => {
    const username = req.query.username;
    const catName = req.query.cat;
    try {
        let posts;
        //  posts = await Post.find().sort("title");
        if (username) posts = await Post.find({ username: username }).sort("title");
        else if (catName) posts = await Post.find({ categories: { $in: [catName] } }).sort("title");
        else posts = await Post.find().sort({ title: 1 })

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;

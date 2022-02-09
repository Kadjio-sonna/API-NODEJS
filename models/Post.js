const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            default: "",
        },
        username: {
            type: String,
            required: true,
        },
        categories: { type: Array, required: false },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

exports.postSchema = postSchema;
exports.Post = Post;

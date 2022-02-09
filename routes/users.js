const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/User");
const { Post } = require("../models/Post");

// UPDATE
router.put("/:id", async (req, res, next) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.body.userId,
                {
                    $set: { ...req.body }, // Ou $set: req.body
                },
                { new: true }
            );

            /* const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
                                                    username: req.body.username,
                                                    email: req.body.email,
                                                    password: req.body.password,
                                                }); */

            /*  const updatedUser = await User.updateOne({ _id: req.body.userId },
                                                     {
                                                         $set: {
                                                             username: req.body.username,
                                                             email: req.body.email,
                                                             password: req.body.password,
                                                         },
                                                     }
                                                 ); */

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).send({ Error: "You can update only your account" });
    }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
    if (req.body.userId === req.params.id) {
        try {
            const deleteUser = User.findById(req.body.userId || req.params.id);
            try {
                await Post.deleteMany({ username: deleteUser.username });
                await User.findByIdAndDelete(req.body.userId || req.params.id);
                res.status(200).json({ Msg: "User has been deleted" });
            } catch (error) {
                res.status(500).json(error);
            }
        } catch (error) {
            res.status(404).json({ Error: "User not found" });
        }
    } else {
        res.status(401).send({ Error: "You can not delete your account" });
    }
});

// GET USER
router.get("/:id", async (req, res, next) => {
    if (req.params.id) {
        try {
            const user = await User.findById(req.params.id);

            const { password, ...others } = user._doc;
            // console.log(user)
            res.status(200).json(others)
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).send({ Error: "Could not find user" });
    }

});
module.exports = router;

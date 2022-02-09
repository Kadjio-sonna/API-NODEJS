const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/User");

// REGISTER
router.post("/register", async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            // profilePic,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }],
        });

        if (!user) return res.status(400).json("Wrong credentials!");
        const validate = await bcrypt.compareSync(req.body.password, user.password);
        //   .then(function (result) {
        //     // result == true
        //     console.log(result);
        //   });
        if (!validate) return res.status(400).json("Wrong credentials hash!");

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;

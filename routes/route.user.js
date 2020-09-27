const Joi = require('joi');
const bcrypt = require('bcrypt');
const genUUID = require("../utils/genUUID")
const express = require('express');
const router = express.Router();

// const sgMail = require('@sendgrid/mail');

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const {User, validate} = require('../modules/user');


const ApiResponse = require('../ApiResponse')
// const {emailAPI} = require("../utils/envs")

router.get("/me", auth, async (req, res) => {
    // const user = await User.findOne({uuid: req.user.uuid}).select('-password -__v -uuid');
    // console.log(user)

    const {_id,name, email} = req.user;
    res.send({_id, name, email});
})

router.post("/password", auth, async (req, res) => {
    const {error} = validatePassword(req.body);
    if (error) return res.status(400).send(new ApiResponse(error.details[0].message, false));

    const user = await User.findById(req.user._id);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(new ApiResponse('Password is not match.', false));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    user.updatedAt = Date.now()
    user.uuid = genUUID(req.body.password)
    await user.save();
    res.send(new ApiResponse("Password Changed", true));

})

// router.post("/email", async (req, res) => {
//
//     sgMail.setApiKey(emailAPI);
//     const msg = {
//         to: req.body.email,
//         from: 'misterolloyor@gmail.com',
//         subject: 'Confirm Your Email',
//         text: 'Please Confirm Your Email',
//         // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
//     try {
//         const result = await sgMail.send(msg);
//         console.log(result[0].statusCode)
//     } catch (e) {
//         console.log(e.code)
//     }
// })

router.post("/checkEmail", async (req, res) => {
    if (!req.body.email) return res.status(404).send(new ApiResponse("Email is required", false));

    if (!validateEmail(req.body.email)) return res.status(400).send(new ApiResponse("Email is invalid", false));

    const isBusy = await User.findOne({email: req.body.email});

    isBusy ? res.send(new ApiResponse("Email is busy", false, false)) : res.send(new ApiResponse("Email Available", true, true))
})


router.get("/", [auth, admin], async (req, res) => {

    const userList = await User.find({}).select('-password');

    res.send(new ApiResponse("Users List", true, userList))
})

validateEmail = (email) => {
    let compare = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return compare.test(String(email).toLowerCase());
}

function validatePassword(body) {
    const schema = {
        password: Joi.string().min(5).max(255).required(),
        newPassword: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(body, schema);
}

module.exports = router;

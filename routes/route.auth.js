const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const genUUID = require("../utils/genUUID")
const {User, validate, validateLogin} = require('../modules/user');
const {tokenExpTime, tokenType, secretKey} = require("../utils/envs")
const ApiResponse = require('../ApiResponse')

// @New User Registers
// @Method: POST
// @Route: api/auth/register
router.post("/register", async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    try {
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send({error: 'User already registered.'});

        const newUser = new User({
            uuid: genUUID(req.body.email),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const savedUser = await newUser.save();
        const accessToken = await generateAuthToken(savedUser);
        return res.send({tokenType, accessToken, success: true})
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: 'Something went wrong'});
    }

});

// @User Logins
// @Method: POST
// @Route: api/auth/login
router.post("/login", async (req, res) => {
    const {error} = validateLogin(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    try {
        let user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send({error: 'Invalid email or password.'});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send({error: 'Invalid email or password.'});

        user.uuid = genUUID(req.body.email)
        await user.save();

        const accessToken = await generateAuthToken(user);
        res.send({tokenType, accessToken, success: true});
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: 'Something went wrong'});
    }

});

// @Validate Email by Token
// @Method: GET
// @Route: api/auth/:token
// router.get("/:token", async(req, res)=>{
//
// });

generateAuthToken = async function (user) {
    console.log(user)
    return jwt.sign({_id: user._id, uuid: user.uuid}, secretKey, {
        expiresIn: parseInt(tokenExpTime),
        header: {typ: "MY_JWT", kid: "MY_KID"}
    });
}

module.exports = router;

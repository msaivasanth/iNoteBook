const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/findUser')
const JWT_SECRET = 'Sample@pass'

//ROUTE 1:
router.post('/createuser', [
    body('name').isLength({ min : 3}),
    body('email').isEmail(),
    body('password').isLength({min: 5})
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({email: req.body.email})
        if(user) {
            return res.status(404).json({success, error: "Sorry a user with same email already exits"})
        }

        const salt = await bcrypt.genSalt(10);
        const ScPass = await bcrypt.hash(req.body.password, salt);


        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: ScPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({success, authtoken})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

//ROUTE 2:
router.post('/login', [
    body('email', 'please enter valid email').isEmail(),
    body('password', 'password should not be empty').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    const {email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({success, error: "Enter correct credentials"})
        }
        const pcom = await bcrypt.compare(password, user.password)
        if(!pcom) {
            return res.status(404).json({success, error: "Enter correct credentials"})
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authtoken})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

//ROUTE 3:
router.post('/getuser', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user.id;
        //select everything except password
        const user = await User.findById(userId).select('-password')
        res.json({user})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})
module.exports = router
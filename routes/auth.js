const router = require("express").Router();
const User = require("../model/user");


// register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const user = await newUser.save();
        res.status(201).json(user);

    } catch (err) {
        res.status(500).json({ msg: err })
    }


});


// login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" })
        const validatePassword = await user.comparePassword(req.body.password);

        if (!validatePassword) {
            return res.status(400).json({ msg: "Invalid credentials" })
        }

        res.status(200).json(user);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
});

router.get


module.exports = router;
const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../model/user");
// update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (err) {
                res.status(500).json({ err })
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            res.status(200).json({ msg: "Account updated successfully" })
        } catch (error) {
            res.status(500).json({ err })
        }
    } else {
        res.status(403).json({ msg: "you can only update your account" });
    }
});

// delete a user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);

            res.status(200).json({ msg: "Account deleted successfully" })
        } catch (error) {
            res.status(500).json({ err })
        }
    } else {
        res.status(403).json({ msg: "you can only delete your account" });
    }
});

// get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json({ err })
    }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currrentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currrentUser.updateOne({ $push: { followings: req.params.id } });

                res.status(200).json({ msg: "user has been followed" });
            } else {
                res.status(403).json({ msg: "you already follow this user" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    } else {
        res.status(403).json({ msg: "you can't follow yourself" })
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currrentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currrentUser.updateOne({ $pull: { followings: req.params.id } });

                res.status(200).json({ msg: "user has been unfollowed" });
            } else {
                res.status(403).json({ msg: "you dont follow this user" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    } else {
        res.status(403).json({ msg: "you can't unfollow yourself" })
    }
});




module.exports = router;
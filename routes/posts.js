const router = require("express").Router();

const Post = require("../model/posts");
const User = require("../model/user");

// create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ err });
    }
});

// update post
router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({ msg: "post updated successfully" });
        } else {
            res.status(403).json({ msg: "you can only update your post" })
        }
    } catch (err) {
        res.status(500).json(err)
    }

});

// delete a post
router.delete("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json({ msg: "post deleted successfully" });
        } else {
            res.status(403).json({ msg: "you can only delete your post" })
        }
    } catch (err) {
        res.status(500).json(err)
    }

});

// like or unlike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await Post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json({ msg: "post liked successfully" });
        } else {
            await Post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json({ msg: "post unliked successfully" });

        }
    } catch (err) {
        res.status(500).json(err)
    }
});


// get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
});


// get timeline post
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const usersPost = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        );

        res.status(200).json(usersPost.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;
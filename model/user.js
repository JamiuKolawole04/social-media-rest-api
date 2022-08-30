const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        min: 6,
    },

    profilePicture: {
        type: String,
        default: "",
    },

    coverPicture: {
        type: String,
        default: "",
    },

    followers: {
        type: Array,
        default: [],
    },

    followings: {
        type: Array,
        default: [],
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    desc: {
        type: String,
        max: 50,
    },

    city: {
        type: String,
        max: 50,
    },

    from: {
        type: String,
        max: 50,
    },

    relationship: {
        type: Number,
        enum: [1, 2, 3]
    }
}, { timestamps: true });

// Middleware in mongoose
// In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise.
// In particular, you can use async/await

/**
         * Hashing password logic with "bcrypt" library
         * Generate the salt throuh genSalt() function
         * Hash the passoword through hash() function alogside the salt generated initially
         * store the hashed password in the database
         */
userSchema.pre("save", async function () {
    // generating salts in 10 rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}



module.exports = model("User", userSchema);
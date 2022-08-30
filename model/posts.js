const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const postSchema = Schema({
    userId: {
        type: String,
        required: true,
    },

    desc: {
        type: String,
        max: 500,
    },

    img: String,

    likes: {
        type: Array,
        default: [],
    }
}, { timestamps: true });



module.exports = model("Post", postSchema);
// require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const PORT = process.env.PORT || 8020;
const connectDB = require("./db/db");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");


const MONGO_URI = "mongodb://localhost:27017/social_media_api";



// //  middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("combined"));
app.use(helmet());

// //routes
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ msg: "server on!" })
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postsRoute);



const start = async () => {
    try {
        await connectDB(MONGO_URI)
        app.listen(PORT, () =>
            console.log(`Server  listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
}


start();
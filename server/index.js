import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet"; //for security
import morgan from "morgan"; //used for logging HTTP request details

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// import User from "./models/User.js";
// import Post from "./models/Post.js";

import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy(
  {
   policy: "cross-origin" 
  }
  ));

app.use(morgan("common"));
// to use the predefined "common" log format, which 
// includes the remote address, remote user, date, request method, 
// request URL, HTTP version, status code, response size, and referer. 
// This format is a standard logging format commonly used in web servers.


app.use(bodyParser.json(
  {
     limit: "30mb", extended: true
  }));

app.use(bodyParser.urlencoded(
  {
     limit: "30mb", extended: true
 }));

app.use(cors());


app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* FILE STORAGE */

const storage = multer.diskStorage(
  // need to write the destination and the filename for the place to store the uploaded images
  {
  //   cb = callback function
  //   originalname = original name of the uploaded file.
  destination: function (req, file, cb) {
         cb(null, "public/assets");
        },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

/* ROUTES WITH FILES */
const upload = multer(
  {
     storage
 });


//  the Express application will execute the middleware (upload.single("picture")) first,
//  and if that middleware passes (doesn't throw an error), 
// it will then call the register function to handle the request.


app.post("/auth/register", upload.single("picture"), register);
// upload.single = drag and drop to  upload single file that is stored in public/assets/

app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //   .connect(process.env.MONGO_URL, {
  //     useFindAndModify: false,
  //     useCreateIndex: true,
  //   })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

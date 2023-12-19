import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);



const Post = mongoose.model("Post", postSchema);
// Post = singular name of the collection
// Mongoose schema (column headings) UserSchema into a model and assigns it to the variable User
export default Post;


// By exporting the model, 
// you can import it in other files and perform CRUD (Create, Read, Update, Delete) operations
// on the "Posts" collection in your MongoDB database.
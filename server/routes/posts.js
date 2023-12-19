import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
// Home page feed photos of all users posts are shown 
router.get("/:userId/posts", verifyToken, getUserPosts);
// only User profile's photos are shown

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
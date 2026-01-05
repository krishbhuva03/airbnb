import express from "express";

import {
    GetBlogs,
    GetBlogBySlug,
    GetBlogById,
    CreateBlog,
    UpdateBlog,
    DeleteBlog,
    GetCategories
} from "../controllers/blogs.js";

const router = express.Router();

// Public routes
router.get("/", GetBlogs);
router.get("/categories", GetCategories);
router.get("/slug/:slug", GetBlogBySlug);
router.get("/:id", GetBlogById);

// Admin routes (add auth middleware in production)
router.post("/", CreateBlog);
router.put("/:id", UpdateBlog);
router.delete("/:id", DeleteBlog);

export default router;

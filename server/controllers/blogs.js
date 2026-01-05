import Blog from "../models/Blog.js";

// Get all published blogs with pagination
export const GetBlogs = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, category, search } = req.query;
        
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 50) limit = 50;
        
        const filter = { isPublished: true };
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$text = { $search: search };
        }
        
        const totalCount = await Blog.countDocuments(filter);
        const skip = (page - 1) * limit;
        
        const blogs = await Blog
            .find(filter)
            .select('title slug excerpt featuredImage author category tags publishedAt readTime viewCount')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        return res.status(200).json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit,
                hasMore: skip + blogs.length < totalCount
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get single blog by slug
export const GetBlogBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        
        const blog = await Blog.findOneAndUpdate(
            { slug, isPublished: true },
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.status(200).json(blog);
    } catch (err) {
        next(err);
    }
};

// Get single blog by ID
export const GetBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.status(200).json(blog);
    } catch (err) {
        next(err);
    }
};

// Create new blog (admin only)
export const CreateBlog = async (req, res, next) => {
    try {
        const { title, excerpt, content, featuredImage, author, category, tags, seoTitle, seoDescription } = req.body;
        
        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        const blog = new Blog({
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            author,
            category,
            tags,
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt
        });
        
        const savedBlog = await blog.save();
        
        return res.status(201).json({
            message: "Blog created successfully",
            blog: savedBlog
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "A blog with this title already exists" });
        }
        next(err);
    }
};

// Update blog (admin only)
export const UpdateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // If title is updated, regenerate slug
        if (updates.title) {
            updates.slug = updates.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        
        const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (err) {
        next(err);
    }
};

// Delete blog (admin only)
export const DeleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findByIdAndDelete(id);
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// Get blog categories with count
export const GetCategories = async (req, res, next) => {
    try {
        const categories = await Blog.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        return res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};

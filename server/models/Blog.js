import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        required: true,
        maxLength: 300
    },
    content: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String,
        required: true
    },
    author: {
        name: {
            type: String,
            default: "Travel Expert"
        },
        avatar: {
            type: String,
            default: null
        }
    },
    category: {
        type: String,
        enum: ['destinations', 'tips', 'luxury', 'budget', 'adventure', 'family', 'solo', 'eco-travel'],
        default: 'destinations'
    },
    tags: [{
        type: String,
        trim: true
    }],
    // SEO fields for AdSense optimization
    seoTitle: {
        type: String,
        maxLength: 60
    },
    seoDescription: {
        type: String,
        maxLength: 160
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    viewCount: {
        type: Number,
        default: 0
    },
    readTime: {
        type: Number,
        default: 5 // minutes
    }
}, { timestamps: true });

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });

// Text index for search
blogSchema.index({ 
    title: "text", 
    excerpt: "text", 
    content: "text" 
});

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Calculate read time based on content
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);
    }
    
    next();
});

export default mongoose.model("Blog", blogSchema);

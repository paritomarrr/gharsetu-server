import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const articleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false,
        default: []
    },
    content: {
        type: 'String',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    scheduleDate: {
        type: Date,
        required: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default Article;
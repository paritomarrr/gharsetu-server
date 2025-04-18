import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
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
    }
}, {
    timestamps: true
});

const News = mongoose.models.News || mongoose.model("News", newsSchema);
export default News;
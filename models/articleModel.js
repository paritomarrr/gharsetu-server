import mongoose from "mongoose";

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
    }
}, {
    timestamps: true
}
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default Article; 
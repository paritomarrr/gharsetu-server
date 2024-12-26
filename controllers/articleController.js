import Article from "../models/articleModel.js";

export const articlesTest = (req, res) => {
    res.json({
        message: "Articles controller works",
    })
}

export const createArticle = async (req, res) => {
    const { slug, title, excerpt, image, tags, content } = req.body;
    try {
        const article = new Article({ slug, title, excerpt, image, tags, content });
        await article.save();
        res.status(201).json({
            success: true,
            article
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getArticleBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const article = await Article.findOne({ slug });
        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }
        res.status(200).json({
            success: true,
            article
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
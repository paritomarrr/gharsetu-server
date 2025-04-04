import Article from "../models/articleModel.js";
import User from "../models/userModel.js";
import schedule from "node-schedule";

export const articlesTest = (req, res) => {
    res.json({
        message: "Articles controller works",
    });
};

export const createArticle = async (req, res) => {
    const { slug, title, excerpt, image, tags, content, scheduleDate } = req.body;
    try {
        const article = new Article({
            slug,
            title,
            excerpt,
            image,
            tags,
            content,
            isPublished: !scheduleDate,
            scheduleDate: scheduleDate ? new Date(scheduleDate) : null
        });

        await article.save();

        if (scheduleDate) {
            schedule.scheduleJob(new Date(scheduleDate), async () => {
                try {
                    const scheduledArticle = await Article.findById(article._id);
                    if (scheduledArticle) {
                        scheduledArticle.isPublished = true;
                        await scheduledArticle.save();
                    }
                } catch (err) {
                    console.error("Failed to publish article:", err);
                }
            });
        }

        res.status(201).json({
            success: true,
            article
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({
            $or: [
                { isPublished: true },
                { scheduleDate: { $exists: false } }
            ]
        });
        res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArticleBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const article = await Article.findOne({
            slug,
            $or: [
                { isPublished: true },
                { scheduleDate: { $exists: false } }
            ]
        });
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
};

export const getRandomArticles = async (req, res) => {
    const { excludeSlug } = req.query;
    try {
        const matchCondition = { isPublished: true };
        if (excludeSlug) {
            matchCondition.slug = { $ne: excludeSlug };
        }
        const articles = await Article.aggregate([
            { $match: matchCondition },
            { $sample: { size: 4 } }
        ]);
        res.status(200).json({
            success: true,
            articles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    const { slug } = req.params;
    const { userId, text } = req.body;

    try {
        const article = await Article.findOne({ slug });
        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newComment = { name: `${user.firstName} ${user.lastName}`, text, date: new Date() };
        article.comments.push(newComment);
        await article.save();

        res.status(201).json({
            success: true,
            comments: article.comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
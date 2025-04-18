import News from "../models/newsModel.js";
import schedule from "node-schedule";

export const getNews = async (req, res) => {
    try {
        const news = await News.find({
            $or: [
                { isPublished: true },
                { scheduleDate: { $exists: false } }
            ]
        });
        res.status(200).json({
            success: true,
            news
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNews = async (req, res) => {
    const { slug, title, excerpt, image, tags, content, scheduleDate } = req.body;
    try {
        const news = new News({
            slug,
            title,
            excerpt,
            image,
            tags,
            content,
            isPublished: !scheduleDate,
            scheduleDate: scheduleDate ? new Date(scheduleDate) : null
        });

        await news.save();

        if (scheduleDate) {
            schedule.scheduleJob(new Date(scheduleDate), async () => {
                try {
                    const scheduledNews = await News.findById(news._id);
                    if (scheduledNews) {
                        scheduledNews.isPublished = true;
                        await scheduledNews.save();
                    }
                } catch (err) {
                    console.error("Failed to publish news:", err);
                }
            });
        }

        res.status(201).json({
            success: true,
            news
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getNewsBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const news = await News.findOne({
            slug,
            $or: [
                { isPublished: true },
                { scheduleDate: { $exists: false } }
            ]
        });
        if (!news) {
            return res.status(404).json({ success: false, message: "News not found" });
        }
        res.status(200).json({
            success: true,
            news
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRandomNews = async (req, res) => {
    const { excludeSlug } = req.query;
    try {
        const matchCondition = { isPublished: true };
        if (excludeSlug) {
            matchCondition.slug = { $ne: excludeSlug };
        }
        const news = await News.aggregate([
            { $match: matchCondition },
            { $sample: { size: 4 } }
        ]);
        res.status(200).json({
            success: true,
            news
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCommentToNews = async (req, res) => {
    const { slug } = req.params;
    const { userId, text } = req.body;

    try {
        const news = await News.findOne({ slug });
        if (!news) {
            return res.status(404).json({ success: false, message: "News not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newComment = { name: `${user.firstName} ${user.lastName}`, text, date: new Date() };
        news.comments.push(newComment);
        await news.save();

        res.status(201).json({
            success: true,
            comments: news.comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
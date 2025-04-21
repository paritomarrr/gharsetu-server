import express from "express";
import { createNews, getNewsBySlug, getRandomNews, addCommentToNews, getNews } from "../controllers/newsController.js";

const newsRoutes = express.Router();

newsRoutes.get("/", getNews);
newsRoutes.post("/", createNews);
newsRoutes.get("/random", getRandomNews);
newsRoutes.get("/:slug", getNewsBySlug);
newsRoutes.post("/:slug/comments", addCommentToNews);

export default newsRoutes;
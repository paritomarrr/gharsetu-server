import express from "express";
import { articlesTest, createArticle, getArticles, getArticleBySlug, getRandomArticles, addComment } from "../controllers/articleController.js";

const articleRoutes = express.Router();

articleRoutes.get('/test', articlesTest);
articleRoutes.post('/', createArticle);
articleRoutes.get('/', getArticles);
articleRoutes.get('/random', getRandomArticles);
articleRoutes.get('/:slug', getArticleBySlug);
articleRoutes.post('/:slug/comments', addComment);

export default articleRoutes;
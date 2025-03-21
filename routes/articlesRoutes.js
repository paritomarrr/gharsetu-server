import express from "express";
import { articlesTest, createArticle, getArticles, getArticleBySlug, getRandomArticles } from "../controllers/articleController.js";

const articleRoutes = express.Router();

articleRoutes.get('/test', articlesTest);
articleRoutes.post('/', createArticle);
articleRoutes.get('/', getArticles);
articleRoutes.get('/random', getRandomArticles);
articleRoutes.get('/:slug', getArticleBySlug);

export default articleRoutes;
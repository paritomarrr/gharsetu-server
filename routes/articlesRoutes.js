import express from "express";
import { articlesTest, createArticle, getArticles, getArticleBySlug } from "../controllers/articleController.js";

const articleRoutes = express.Router();

articleRoutes.get('/test', articlesTest);
articleRoutes.post('/', createArticle);
articleRoutes.get('/', getArticles);
articleRoutes.get('/:slug', getArticleBySlug);

export default articleRoutes;
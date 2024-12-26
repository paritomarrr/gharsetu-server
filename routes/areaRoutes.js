import express from "express"
import { convertArea } from "../controllers/areaConversionController.js"

const calculatorRoutes = express.Router();

calculatorRoutes.post("/:fromUnit-to-:toUnit", convertArea);

export default calculatorRoutes; 
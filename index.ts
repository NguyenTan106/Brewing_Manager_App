import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllIngredientsController,
  getAllIngredientByIdController,
  createIngredientController,
  updateIngredientByIdController,
  deleteIngredientByIdController,
} from "./routes/api";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// app.use("/", async (req: Request, res: Response) => {
//   res.send("Hello");
// });
app.use("/api", getAllIngredientsController);
app.use("/api", getAllIngredientByIdController);
app.use("/api", createIngredientController);
app.use("/api", updateIngredientByIdController);
app.use("/api", deleteIngredientByIdController);

app.listen(PORT, () => {
  console.log(`Brewing Manager backend running at http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllIngredientsController,
  getAllIngredientByIdController,
  createIngredientController,
  updateIngredientByIdController,
  deleteIngredientByIdController,
  getAllTypesController,
  createTypeController,
  deleteTypeController,
  paginationController,
} from "./routes/api_ingredient";

import {
  getAllBatchesController,
  getBatchByIdController,
} from "./routes/api_batch";

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
app.use("/api", getAllTypesController);
app.use("/api", createTypeController);
app.use("/api", deleteTypeController);
app.use("/api", paginationController);

//batch
app.use("/api", getAllBatchesController);
app.use("/api", getBatchByIdController);

app.listen(PORT, () => {
  console.log(`Brewing Manager backend running at http://localhost:${PORT}`);
});

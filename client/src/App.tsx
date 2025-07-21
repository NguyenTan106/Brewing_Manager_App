import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IngredientManager from "./pages/IngredientManager/IngredientManager";
import BatchManager from "./pages/BatchManager/BatchManager";
import RecipeManager from "./pages/Recipe/RecipeManager";
import ActivityLogManager from "./pages/ActivityLogManager/ActivityLogManager";
import Layout from "./layout/MainLayout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ingredients" element={<IngredientManager />} />
          <Route path="batchs" element={<BatchManager />} />
          <Route path="recipes" element={<RecipeManager />} />
          <Route path="activity-logs" element={<ActivityLogManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

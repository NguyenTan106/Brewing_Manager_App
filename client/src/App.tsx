import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoardManager from "./pages/DashBoardManager/DashboardManager";
import IngredientManager from "./pages/IngredientManager/IngredientManager";
import BatchManager from "./pages/BatchManager/BatchManager";
import RecipeManager from "./pages/Recipe/RecipeManager";
import ActivityLogManager from "./pages/ActivityLogManager/ActivityLogManager";
import UserManager from "./pages/UserManager/UserManager";
import SettingManager from "./pages/SettingManager";
import Layout from "./layout/MainLayout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashBoardManager />} />
          <Route path="ingredients" element={<IngredientManager />} />
          <Route path="batchs" element={<BatchManager />} />
          <Route path="recipes" element={<RecipeManager />} />
          <Route path="activity-logs" element={<ActivityLogManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="settings" element={<SettingManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

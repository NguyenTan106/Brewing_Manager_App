import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoardManager from "./pages/DashBoardManager/DashboardManager";
import IngredientManager from "./pages/IngredientManager/IngredientManager";
import BatchManager from "./pages/BatchManager/BatchManager";
import RecipeManager from "./pages/Recipe/RecipeManager";
import ActivityLogManager from "./pages/ActivityLogManager/ActivityLogManager";
import UserManager from "./pages/UserManager/UserManager";
import SettingManager from "./pages/SettingManager";
import Layout from "./layout/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import RequireAuth from "./components/Auth/RequireAuth";
import RedirectIfAuthenticated from "./components/Auth/RedirectIfAuthenticated";
import SuperAdminRoute from "./components/Auth/SuperAdminRoute";
import { Toaster } from "sonner";



function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        expand={true}
        closeButton
        toastOptions={{
          duration: 3000, // Thời gian hiển thị
        }}
      />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<DashBoardManager />} />
            <Route path="ingredients" element={<IngredientManager />} />
            <Route path="batchs" element={<BatchManager />} />
            <Route path="recipes" element={<RecipeManager />} />
            <Route path="activity-logs" element={<ActivityLogManager />} />
            <Route
              path="users"
              element={
                <SuperAdminRoute>
                  <UserManager />
                </SuperAdminRoute>
              }
            />
            <Route path="settings" element={<SettingManager />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

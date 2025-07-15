import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IngredientManager from "./pages/IngredientManager/IngredientManager";
import BatchManager from "./pages/BatchManager/BatchManager";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="ingredients" element={<IngredientManager />} />
          <Route path="batch" element={<BatchManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { List } from "./pages/List";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Home from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/budgets" element={<Budget />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
export default App;